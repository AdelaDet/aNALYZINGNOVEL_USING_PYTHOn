
const { session } = require('../../db/neo')
const express = require('express')
const router = express.Router()
const shortid = require('shortid')
const recordsReducer = require('../records-reducer.js')

const makeSlug = string => {
  return string.replace(/[^a-z0-9]/gi, '')
}

const requireUserLogin = function(req, res, next) {
  return req.params.name == req.user.name ? next() : res.err("unauthorised");
}

// an unshielded public route just to make sure mocha/chai/supertest work
router.get('/public', (req, res) => {
  res.json({ answer: null })
})

// GET: api/paths/all/user/:username/
router.get('/all/user/:name/', requireUserLogin, async (req, res, next) => {
  try {
    const param = req.params.name

    const query = `match(u:User)-[:PATHS]->(p:Path)
    where u.name = {username}
    return {details: p}`

    const result = await session.run(query, {username: param})

    const paths = result.records.map(record => {
      return record._fields
    })

    res.send(paths)
    session.close()
  } catch (err) {
    next(err)
  }
})

// GET - api/userAuth/paths/:uid/user/:username/completed
router.get('/:uid/user/:username/completed', async (req, res, next) => {
  try {
    const uid = req.params.uid
    const username = req.params.username

    if (req.user.name !== username ){
      res.status(403).send('Unauthorized')
    }

    const query = `MATCH (u)-[:PATHS]->(p:Path)
    WHERE p.uid = {uid} and u.name = {username}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
    RETURN { steps: collect({ step: s, resource: r, completed: c })}`

    const data = await session.run(query, {uid, username})

    const steps = data.records.map(record => {
      return record._fields[0].steps
    })

    const completionStatus = steps[0].map(el => {
      const completed = el.completed !== null
      return {
        stepName: el.resource.properties.name,
        stepUrl: el.resource.properties.url,
        completed
      }
    })

    res.send(completionStatus)
    session.close()
  } catch (err) {
    next(err)
  }
})

// POST: api/paths/
router.post('/', async (req, res, next) => {
  const createdDate = Date.now()
  const uid = shortid.generate()
  const slug = makeSlug(req.body.name)

  if (req.user.name !== req.body.user ){
    res.status(403).send('Unauthorized')
  }

  try {
    const newPath = `
    MATCH (u:User), (c:Category)
    WHERE u.name = {username} AND c.name = {category}
    CREATE (p:Path {name: {name}, description: {description}, level: {level}, status: {status}, owner: {username}, createdDate: {createdDate}, uid: {uid}, slug: {slug}}),
    (u)-[:PATHS {notes: {notes}}]->(p),
    (p)-[:CATEGORY]->(c)`

    const created = await session.run(newPath, {
      category: req.body.language,
      username: req.body.user,
      name: req.body.name,
      description: req.body.description,
      level: req.body.level,
      status: 'draft',
      notes: '',
      uid,
      slug,
      createdDate
    })

    const result = [
      {details: {properties: created.summary.statement.parameters}}
    ]

    res.send(result)
    session.close()
  } catch (err) {
    next(err)
  }
})

// Follow a public path
// PUT - api/userAuth/paths/:slug/:uid/follow
router.put('/:slug/:uid/follow', async (req, res, next) => {
  try {
    const { userUid, pathUid } = req.body

    if (req.user.uid !== userUid ){
      res.status(403).send('Unauthorized')
    }

    const query = `MATCH (u:User { uid: {userUid} }),(p:Path {uid: {pathUid}, status: 'public'})
    MERGE (u)-[:PATHS]->(p)
    RETURN u, p`

    const followPath = await session.run(query, {userUid, pathUid})

    res.json(followPath)
    session.close()

  }catch(err){
    next(err)
  }
})

// PUT - api/userAuth/paths/:uid/togglePublic
router.put('/:uid/togglePublic', async (req, res, next) => {
  try {
    let status = req.body.hasOwnProperty('public') ? 'public' : 'draft'

    if (req.user.name !== req.body.username ){
      res.status(403).send('Unauthorized')
    }

    let uid = req.params.uid
    let result = await session.run(
      `
        MATCH (p:Path), (u:User)-[:PATHS]->(p)
        WHERE p.uid = {uid}
        SET p.status = {status}
        WITH p, count(distinct u) as subscribers
        OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
        RETURN { details: p, steps: collect( { step: s, resource: r } ), subscribers: subscribers }

      `,
      {uid, status}
    )

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath)

  } catch (err) {
    next(err)
  }
})

// PUT: api/userAuth/paths/:pathUid/user/:username/status/:bool/step/:stepUrl
router.put(
  '/:pathUid/user/:username/status/:completed/step/:stepUrl',
  async (req, res, next) => {

    if (req.user.name !== req.params.username ){
      res.status(403).send('Unauthorized')
    }

    try {
      const uid = req.params.pathUid
      const username = req.params.username
      const stepUrl = decodeURIComponent(req.params.stepUrl)
      const completed = req.params.completed
      let query = ''

      if (completed === 'true') {
        // Remove the relationship
        query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
      OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
      DELETE c
      `
      } else if (completed === 'false') {
        // Add the relationship
        query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
      CREATE (u)-[:COMPLETED]->(s)
      `
      }

      await session.run(query, {uid, username, stepUrl})

      res.send(stepUrl)
      session.close()
    } catch (err) {
      next(err)
    }
  }
)

// PUT `/api/userAuth/paths/${pathUid}/user/${username}/step/${urlEncoded}`
router.post(
  '/:pathUid/user/:username/step/:stepUrl',
  async (req, res, next) => {

    if (req.user.name !== req.params.username ){
      res.status(403).send('Unauthorized')
    }

    try {
      const uid = req.params.pathUid
      const username = req.params.username
      const stepUrl = req.params.stepUrl.startsWith('http')
        ? decodeURIComponent(req.params.stepUrl)
        : decodeURIComponent('http://' + req.params.stepUrl)
      const createdDate = Date.now()
      const newUid = shortid.generate()

      // create the resource if it doesn't exist yet
      if (req.body.type === 'new') {
        const resourceQuery = `
      CREATE (r:Resource { name: {name}, description: {description}, createdDate: {createdDate}, url: {url}, uid: {uid}, type: {type}, imageUrl: {imageUrl} })
      `
        await session.run(resourceQuery, {
          name: req.body.title,
          description: req.body.description,
          type: req.body.type1,
          imageUrl: req.body.imageUrl,
          url: stepUrl,
          uid: newUid,
          createdDate
        })
      }

      // Get number of steps(count) in the Path
      const pathLengthQuery =
        `MATCH (p:Path)-[:STEPS*]->(s:Step)
         WHERE p.uid={uid}
         WITH count(distinct s) as cnt
         RETURN cnt
        `
      const resultForCount = await session.run(pathLengthQuery, {uid})

      const count = resultForCount.records[0]._fields[0].low

      if(count < 1){
        // if there are no steps in the Path ...
        // create a new step as Step 1
        // , and connect it with the resource
        const addStep1Query = `
        MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
        WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
        CREATE (s:Step { name: "Step 1"}),
        (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
        `
          const addedAsStep1 = await session.run(addStep1Query, {
            uid,
            username,
            stepUrl
          })

          res.send(addedAsStep1)

      }else{
        // there are steps in the Path ...
        // so create a new step as the last step and name it 'Step {lastIndex +1}'
        // , and connect it with the resource
        const newStepName = 'Step '+(Number(count) + 1)
        const addStepQuery = `
          MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*` + count + `]->(ls:Step), (r:Resource)
          WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
          WITH ls, p, r
          CREATE (s:Step { name: {newStepName} }),
          (ls)-[:STEPS]->(s)-[:RESOURCE]->(r)
        `

        const addedNewStep = await session.run(addStepQuery, {
          uid,
          username,
          stepUrl,
          newStepName,
        })

        res.send(addedNewStep)
      }

    } catch (err) {
      next(err)
    }
  }
)

// DELETE: api/userAuth/paths/:name
router.delete('/:uid', async (req, res, next) => {

  if (req.user.name !== req.body.username ){
    res.status(403).send('Unauthorized')
  }

  try {
    const uid = req.params.uid

    const query = `
    MATCH (p:Path) WHERE p.uid = {uid}
    DETACH DELETE p`

    await session.run(query, {uid})

    res.send(uid)
    session.close()
  } catch (err) {
    next(err)
  }
})

// PUT: api/userAuth/paths/byName/:name
router.put('/:slug/:uid/unfollow', async (req, res, next)=> {
  try{
    const { username, pathUid } = req.body
    const query = `MATCH (u:User {name: {username}})-[r:PATHS]->(p:Path {uid: {pathUid}})
    DELETE r
    `
    const unfollowPath = await session.run(query, {username, pathUid})
    res.send(unfollowPath)
  }catch(err){
    console.error(err)
    next(err)
  }
})

module.exports = router
const { session } = require('../db/neo')
const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')
const {getMetadata} = require('../../script/metadata')
const shortid = require('shortid')

// GET: /api/paths/step/:url
router.get('/step/:url', async (req, res, next) => {
  try {
    const url = decodeURIComponent(req.params.url)

    const query = `
    MATCH (r:Resource) WHERE r.url = {url}
    return r
    `

    const result = await session.run(query, {url})

    if (result.records.length > 0) {
      const records = result.records.map(record => {
        return record._fields
      })
      res.send(records[0][0].properties)
    } else {
      let md = await getMetadata(url)
      res.send(md)
    }

    session.close()
  } catch (err) {
    next(err)
  }
})

// returns the most popular paths (regardless of category)
// GET: api/paths/popular
router.get('/popular', async (req,res,next) => {
  const query = `
    MATCH (u: User)-[_p:PATHS]->(p: Path {status: 'public'})<-[_r: REVIEWS]-(r:Review),
      (p)-[:CATEGORY]->(c:Category)
      RETURN p.name AS name,
             p.owner AS owner,
             count(r) AS reviewCount,
             count(distinct u) AS userCount,
             avg(r.score) AS rating,
             p.uid AS uid,
             p.slug AS slug,
             c.name AS category
      ORDER BY rating DESC LIMIT 8`

    const result = await session.run(query)

  const reducedResponse = recordsReducer(result.records)
  res.send(reducedResponse)
})

// GET: api/paths/:uid
router.get('/:pathUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    // const query = `
    // MATCH (p:Path) WHERE p.uid = {uid}
    // OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    // RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const query=`
      MATCH (p:Path), (u:User)-[:PATHS]->(p)
      WHERE p.uid = {uid}
      WITH p, count(distinct u) as subscribers
      OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      RETURN { details: p, steps: collect( { step: s, resource: r } ), subscribers: subscribers }`

    const result = await session.run(query, {uid: param})

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath)
    session.close()
  } catch (err) {
    next(err)
  }
})

// GET: api/paths/byName/:name
router.get('/byName/:name', async (req, res, next) => {
  try {
    const param = req.params.name

    const query = `
    MATCH (p:Path) WHERE p.name = {name}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) {
    next(err)
  }
})

// GET: api/paths/:uid/user/:username/completed
router.get('/:uid/user/:username/completed', async (req, res, next) => {
  try {
    const uid = req.params.uid
    const username = req.params.username

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

// PUT: /api/paths/:uid/togglePublic/
router.put('/:uid/togglePublic', async (req, res, next) => {
  try {
    // let status = req.body.bool ? 'public' : 'draft'
    let status = req.body.hasOwnProperty('public') ? 'public' : 'draft'

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

// PUT: api/paths/:pathUid/user/:username/status/:bool/step/:stepUrl
router.put(
  '/:pathUid/user/:username/status/:completed/step/:stepUrl',
  async (req, res, next) => {
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

// PUT `/api/paths/${pathUid}/user/${username}/step/${urlEncoded}`
router.post(
  '/:pathUid/user/:username/step/:stepUrl',
  async (req, res, next) => {
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

      // Get last step name in path
      const query = `
    MATCH (u:User)-[:PATHS]->(p:Path)
    WHERE p.uid = {uid} AND u.name = {username}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)
    RETURN s.name
    ORDER BY s.name DESC
    LIMIT 1
    `
      const result = await session.run(query, {uid, username, stepUrl})

      // If there aren't any steps yet, add resource as 'Step 1'
      if (!result.records[0]._fields[0]) {
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
      } else {
        // Else get last digit of last existing step and increment new step name
        const lastStepName = result.records[0]._fields[0]
        const newStepNum = lastStepName.substr(
          lastStepName.indexOf(' '),
          lastStepName.length - 1
        )
        const newStepName = `Step ` + (Number(newStepNum) + 1)

        const addStepQuery = `
      MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
      WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
      CREATE (s:Step { name: {newStepName} }),
      (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
      `
        const addedNewStep = await session.run(addStepQuery, {
          uid,
          username,
          stepUrl,
          newStepName
        })

        res.send(addedNewStep)
      }
    } catch (err) {
      next(err)
    }
  }
)

// POST: api/paths/
router.post('/', async (req, res, next) => {
  const createdDate = Date.now()
  const uid = shortid.generate()
  const slug = makeSlug(req.body.name)

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

// DELETE: api/paths/:name
router.delete('/:uid', async (req, res, next) => {
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


//follow a public path
router.put('/:slug/:uid/follow', async (req, res, next) => {
  try {
    const { userUid, pathUid } = req.body

    const query = `MATCH (u:User { uid: {userUid} }),(p:Path {uid: {pathUid}, status: 'public'})
    MERGE (u)-[:PATHS]->(p)
    RETURN u, p`

    const followPath = await session.run(query, {userUid, pathUid})

    res.json(followPath)
    session.close()

  }catch(err){
    console.error(err)
    next(err)
  }

})

router.put('/:slug/:uid/unfollow', async (req, res, next) => {
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


router.get('/:pathuid/:username/get-review', async (req, res, next) => {
  try{
    const { username, pathuid } = req.params
    const query = `MATCH (u:User)-[:REVIEWS]->(r)-[:REVIEWS]->(p:Path)
    WHERE u.name = {username} AND p.uid = {pathuid}
    RETURN r.score, r.comments
    `
    const currentUserRating = await session.run(query, {username, pathuid})
    res.json(currentUserRating)

  } catch(err) {
    console.error(err)
    next(err)
  }

})


router.post('/:uid/rate-path', async (req, res, next) => {
  try {
    const { username, pathuid, ratingText, ratingStars} = req.body
    const newId = shortid.generate()
    const query = `MATCH (u:User), (p:Path)
    WHERE u.name = {username} AND p.uid = {pathuid}
    MERGE (u)-[:REVIEWS]->(r:Review)-[:REVIEWS]->(p)
    ON CREATE SET
      r.score = {ratingStars},
      r.comments = {ratingText},
      r.createdDate = timestamp(),
      r.uid = {newId}
    ON MATCH SET
      r.score = {ratingStars},
      r.comments = {ratingText}
    RETURN r`

    const ratePath = await session.run(query, {username, pathuid, ratingText, newId, ratingStars})
    res.json(ratePath)

  } catch(err) {
    console.error(err)
    next(err)
  }
})

// Removes a path's step
// it takes in the index to remove and the last index(for count: otherwise a
// separate call will need to be made to check if the last index was removed)
// POST: /api/paths/remove/:pathUid/:lastIndex/:stepIndex/
router.post('/remove/:pathUid/:lastIndex/:stepIndex/', async (req, res, next) => {
  try{
    const pathUid   = req.params.pathUid
    const lastIndex = req.params.lastIndex
    const stepIndex = req.params.stepIndex

    if(stepIndex   < 1 || stepIndex   > lastIndex) {
       throw new Error('"stepIndex" value is either out of range!!')
    }

    let query = ''

    if(stepIndex === lastIndex) {
    //if removing the last index
      query = `
        MATCH (p:Path {uid:{pUid}})-[:STEPS*` + stepIndex + `]->(stepRem:Step)
        WITH stepRem , p
        MATCH (stepRemP)-[stepRemPE:STEPS]->(stepRem)
        WITH stepRem, stepRemP, p, stepRemPE
        DETACH DELETE stepRemPE, stepRem
      `
    }else{
      query = `
        MATCH (p:Path {uid:{pUid}})-[:STEPS*` + stepIndex + `]->(stepRem:Step)
        WITH stepRem, p
        MATCH (stepRemP)-[stepRemPE:STEPS]->(stepRem)-[stepRemNE:STEPS]->(stepRemN)
        WITH stepRem, stepRemP, stepRemN, p, stepRemPE, stepRemNE
        DETACH DELETE stepRemPE, stepRemNE, stepRem
        CREATE (stepRemP)-[:STEPS]->(stepRemN)
      `
    }

    const queryReturn = `
       WITH p
       MATCH (u:User)-[:PATHS]->(p)
       WITH p, count(distinct u) as subscribers

       OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
       RETURN {
         details: p,
         steps: collect({
           step: s,
           resource: r }),
         subscribers: subscribers
       }
    `

    query += queryReturn

    const result = await session.run(query, {
       pUid : req.params.pathUid,
    })

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath)
    session.close()
  } catch (err) { next(err) }
})

// Reorders a path's steps
// it takes in the indexes to move: from, to
// POST: /api/paths/reorder/:stepCount/:uid/:fromIndex/:toIndex
router.post('/reorder/:pathUid/:stepCount/:fromIndex/:toIndex', async (req, res, next) => {
  try{
    const from   = req.params.fromIndex
    const to     = req.params.toIndex
    const lastIndex = req.params.stepCount

    if(from === to ||
       from < 1 ||
       to   < 1 ||
       from > lastIndex ||
       to   > lastIndex) {
       throw new Error('"from" and "to" values are either out of range or the same value!!')
    } else {

        let query = ''

        if(from < to) {
          //moving from top down
          if(to === lastIndex) {
            //if moving TO the last index
            query = `
              MATCH (p:Path {uid : {pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)
              DELETE fromPE, fromNE
              CREATE (fromP)-[:STEPS]->(fromN), (toC)-[:STEPS]->(fromC)
            `
          } else{
            query = `
              MATCH (p:Path {uid : {pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, fromNE, toNE
              CREATE (fromP)-[:STEPS]->(fromN), (toC)-[:STEPS]->(fromC)-[:STEPS]->(toN)
            `
          }
        }else{
          //moving from bottom up
          if(from === lastIndex) {
          //if moving FROM the last index
            query = `
              MATCH (p:Path {uid:{pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)
              WITH fromC, fromP, p, fromPE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH fromC, fromP, p, fromPE, toC
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, toPE
              CREATE (toP)-[:STEPS]->(fromC)-[:STEPS]->(toC)
            `
          }else{
            query = `
              MATCH (p:Path {uid:{pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, fromNE, toPE
              CREATE (fromP)-[:STEPS]->(fromN), (toP)-[:STEPS]->(fromC)-[:STEPS]->(toC)
            `
          }
        }

        const queryReturn = `
          WITH p
          MATCH (u:User)-[:PATHS]->(p)
          WITH p, count(distinct u) as subscribers

          OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
          RETURN {
            details: p,
            steps: collect({
              step: s,
              resource: r }),
            subscribers: subscribers
          }
        `

        query += queryReturn

        const result = await session.run(query, {
           pUid : req.params.pathUid,
        })

        const singlePath = result.records.map(record => {
          return record._fields
        })

        res.send(singlePath)
        session.close()

      }
    }catch (err) { next(err) }
})

module.exports = router

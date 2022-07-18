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
 
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
router.get('/byName/:name', async (r
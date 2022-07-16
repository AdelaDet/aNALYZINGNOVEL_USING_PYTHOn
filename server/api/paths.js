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
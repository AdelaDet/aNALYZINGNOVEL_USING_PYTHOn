let neo4j = require('neo4j-driver').v1
let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
let { session } = driver.session()
const express = require('express')
const router = express.Router()
const shortid = require('shortid')

// POST: /api/userAuth/reviews/review
router.post('/review', async (req, res, next) => {

  if (req.user.uid !== req.body.userUid ){
    res.status(403).send('Unauthorized')
  }

  const createdDate = Date.now()
  const newReviewUid = shortid.generate()
  const userUid = req.body.userUid
  const resourceUid = req.body.resourceUid
  const rating = req.body.rating

  try {
    const query = `
    MATCH (u:User), (r:Resource)
    WHERE u.uid = {userUid} AND r.uid = {resourceUid}
    MERGE (u)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r)
    ON CREATE SET
      rev.score = {rating},
      rev.createdDate = {createdDate},
      rev.uid = {newReviewUid}
    ON MATCH SET
      rev.score = {rating}
    RETURN u, rev, r
    `

    const result = await session.run(query, {userUid, resourceUid, rating, createdDate, newReviewUid})

    res.send(result)
  } catch (err) { next(err) }
})

// GET: /api/userAuth/reviews/resource/:resourceUid/user/:userUid
router.get('/resource/:resourceUid/user/:userUid', async (req, res, next) => {
  try {

    if (req.user.uid !== req.params.userUid ){
      res.status(403).send('Unauthorized')
    }

    const userUid = req.params.userUid
    const resourceUid = req.params.resourceUid

    const query = `
      MATCH (u:User)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r:Resource)
      WHERE u.uid = {userUid} AND r.uid = {resourceUid}
      RETURN rev.score AS score, r.uid AS resourceUid
    `

    const result = await session.run(query, {userUid, resourceUid})

    const records = result.records.map(record => {
      return record._fields
    })

    const data = {
      userRating: records[0][0],
      resourceUid: records[0][1]
    }

    res.send(data)
  } catch(err) { next(err) }
})

module.exports = router


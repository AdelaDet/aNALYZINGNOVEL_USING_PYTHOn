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

    re
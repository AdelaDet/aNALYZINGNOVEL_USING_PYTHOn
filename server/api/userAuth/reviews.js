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
  const rating = req.body.rati
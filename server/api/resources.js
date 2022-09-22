const { session } = require('../db/neo')

const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

router.get(`/:uid/reviews`, async (req,res,next) => {
  try{
    const uid = req.params.uid
    const query =
    `
      MATCH(u:User)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r:Resource)
      WHERE r.uid={uid}
      RETURN r.name AS resource,
             u.name AS author,
             rev.comments AS comments,
            
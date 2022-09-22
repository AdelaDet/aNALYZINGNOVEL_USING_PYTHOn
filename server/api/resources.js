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
             rev.score AS score
    `

    const result = await session.run(query, {uid})

    const reducedResponse = recordsReducer(result.records)
    const groupedResponse = {}
    groupedResponse['data'] = reducedResponse
    groupedResponse.uid = uid

    res.send(groupedResponse)
    session.close()
  }catch(e){
    next(e)
  }
})

router.get('/:resourceUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    const query = `
    MATCH (r:Resource) WHERE r.uid = {uid}
    RETURN r`

    const result = await session.run(query, {uid: param})

    const singleRecord = result.records.map((record) => {
      return record._fields
    })

    res.send(singleRecord)
    session.close()

  }catch(err){
    console.error(err)
    next(err)
  }
})

module.exports = router

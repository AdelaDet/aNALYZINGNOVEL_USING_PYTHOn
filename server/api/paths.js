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
      const records = result.records.map(rec
let { session } = require('../db/neo')
const router = require('express').Router()
const apoc = require('apoc')
const shortid = require('shortid');

router.post('/', async (req, res, next) => {
  try{
 
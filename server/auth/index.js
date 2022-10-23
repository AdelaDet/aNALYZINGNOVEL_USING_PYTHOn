const { session, driver } = require('../db/neo')
const router = require('express').Router()
const User = require('../db/models/user')
const crypto = require('crypto')

router.post('/signup', async (req, res, next) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const salt = crypto.randomBytes(16).toString('base64')
    const pass = crypto
      .createHash('RSA-SHA256')
      .update(req.body.password)
      .update(salt)
      .digest('hex')

    const query = `
    CREATE (newuser:User {name: {name}, email: {email}, password: {password}, googleId: '',
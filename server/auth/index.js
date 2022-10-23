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
    CREATE (newuser:User {name: {name}, email: {email}, password: {password}, googleId: '', createdDate: timestamp(), isAdmin: false, salt: {salt}})
    RETURN newuser
  `

    const response = await session.run(query, {
      name: name,
      email: email,
      password: pass,
      salt: salt
    })

    const user = response.records[0]._fields[0].properties
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const name = req.body.name
    const pass = req.body.password

    //check if user exists
    let query = `
    MATCH (u:User)
    WHERE u.name = {name}
    RETURN u`

    let response = await session.run(query, {name: name})
    let user = response.records[0]._fields[0].properties

    //if the pw is salted in the database
    if (user.salt) {
      const saltedPW = crypto
        .createHash('RSA-SHA256')
        .update(pass)
        .upda
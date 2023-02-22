const { expect } = require('chai')
const request = require('supertest')
const app = require('../../../../server/index.js')
let { session, driver } = require('../../../../server/db/neo')
const crypto = require('crypto')

const user = {
  name: 'testUser',
  password: '1234',
  email: 'test@user.com'
}

const createTestUser = async () => {
  const salt = crypto.randomBytes(16).toString('base64')
  const password = crypto
    .createHash('RSA-SHA256')
    .update('1234')
    .update(salt)
    .digest('hex')

  const query = `
  CREATE (newuser:User {name: {name}, email: {email}, password: {password}, googleId: '',  createdDate: timestamp(), isAdmin: false, salt: {salt}})
    RETURN newuser`

  await session.run(query, { name: user.name, email: user.email, password, salt })
  driver.close()
  session.close()
}

function promisedAuthRequest() {
  const authenticatedagent2b = request.agent(app)
  return new Promise((resolve, reject) => {
    authenticatedagent2b
      .post("/auth/login")
      .send(user)
      .end(function(error, res) {
        if (error) re
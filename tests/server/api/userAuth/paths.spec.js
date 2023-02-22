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
        if (error) reject(error)
        resolve(authenticatedagent2b)
      })
  })
}

describe("routes", () => {

  before( async () => {
    await createTestUser()
  })

  after( async () => {
    const query = `MATCH (u:User { name: 'testUser' }) DELETE u`
    await session.run(query)
    driver.close()
    session.close()
  })

  it('hits a public route successfully', (done) => {
    request(app).get("/api/userAuth/paths/public")
      .type('json')
      .expect(200)
      .then( (res) => {
        expect(res.body.answer).to.be.null // eslint-disable-line
      }).then(done)
    })

  it('GET: api/userAuth/paths/all/user/:username/', () => {
    return promisedAuthRequest().then(authenticatedagent => {
      const req = authenticatedagent.get(`/api/userAuth/paths/all/user/${user.name}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array')
      })
      return req
    })
  })

})

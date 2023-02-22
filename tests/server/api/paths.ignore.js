// NOTE: THESE TESTS ASSUME DB IS ALREADY SEEDED!

const chai = require('chai')
const expect = chai.expect
// const chaiThings = require('chai-things');
// chai.use(chaiThings);
let neo4j = require('neo4j-driver').v1
let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
let session = driver.session()
const app = require('../../../server/index.js')
const agent = require('supertest')(app)

xdescribe('Paths API Routes', () => {
  before(async () => {
    //re-seed db?
  })

  xdescribe('GET /api/paths/all/user/:username/', () => {
    it('returns all of a users paths', async () => {
      const response = await agent.get('/api/paths/all/user/Jami').expect(200)
    })
  })

  xdescribe('/api/paths/step/:url', () => {
    it('returns the resource given in the URL', async 
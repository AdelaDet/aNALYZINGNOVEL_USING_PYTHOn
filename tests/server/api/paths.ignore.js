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
    it('returns the resource given in the URL', async () => {
      const response = await agent
        .get(
          '/api/paths/step/https://github.com/trekhleb/javascript-algorithms'
        )
        .expect(200)

      //seems like this route may no longer be needed
    })
  })

  describe('/api/paths/popular', () => {
    it('returns the 20 most popular paths by rating', async () => {
      const response = await agent.get('/api/paths/popular').expect(200)
    })
  })

  xdescribe('/api/paths/:uid', () => {
    it('returns a single path with the given uID', async () => {
      const response = await agent.get('/:pathUid').expect(200)
    })
  })

  //redundent route?  probably replaced by uid
  // pi/paths/byName/:name

  xdescribe('/api/paths/:uid/user/:username/completed', () => {
    // uid will change with each seed of the database

    it('returns an array of paths, with completion status', async () => {
      let uid = await session.run(`
        MATCH (p:Path)
        WHERE p.name='Beginner Python'
        RETURN p.uid`)

      uid = uid.records[0]._fields[0]
      const response = await agent.get(`/api/paths/${uid}/user/Jami/completed`)
      let body = response.body
      expect(Array.isArray(body)).to.be.true // eslint-disable-line no-unused-expressions

      expect(Object.keys(body[0])).to.include('completed')
    })
  })

  // PUT: /api/paths/:pathUid/user/:username/status/:bool/step/:stepUrl
  xdescribe('PUT: /api/paths/:pathUid/user/:username/status/:bool/step/:stepUrl', async () => {
    let uid = await session.run(`
        MATCH (p:Path)
        WHERE p.name='Beginner Python'
        RETURN p.uid`)

      uid = uid.records[0]._fields[0]

      const url='https://docs.microsoft.com/en-us/scripting/javascript/advanced/advanced-javascript'

      const response = await agent.put(`/api/paths/${uid}/user/Jami/status/true/step/${url}`)

      console.log(response)

  })


})

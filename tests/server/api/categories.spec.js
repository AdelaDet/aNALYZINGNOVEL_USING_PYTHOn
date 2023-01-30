// NOTE: THESE TESTS ASSUME DB IS ALREADY SEEDED!

const chai = require('chai');
const expect = chai.expect;
// const chaiThings = require('chai-things');
// chai.use(chaiThings);
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.s
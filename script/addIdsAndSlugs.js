// let neo4j = require('neo4j-driver').v1;
// let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// let session = driver.session();
let session = require('../server/db/neo')
const shortid = require('shortid');


const makeSlug = (string) => {
  return string.replace(/[^a-z0-9]/gi,'');
}


const addSlugPaths = async () => {
  const data = await session.run(`MATCH (n:Path) RETURN n`)
  const nodes = data.records
  data.records.forEach(async (node) => {
    const searchName = node._fields[0].properties.name
    const slug = makeSlug(searchName)
    const query = `MATCH (n)
      WHERE n.name = {searchName}
  
const scrape = require('html-metadata')
// let neo4j = require('neo4j-driver').v1
// let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
// let session = driver.session()
let session = require('../server/db/neo')


const getMetadata = url => {
  let metaObj = {}
  return scrape(url)
  .then(metadata => {
      const data = metadata.openGraph ? metadata.openGraph : metadata.general

      if (!data) {
        throw new Error('No metadata found')
      } else {
        metaObj.name = (metadata.general) ? metadata.general.title : ''

        metaObj.type = data.type ? data.type : ''
        metaObj.description = metadata.general.description ? metadata.general.description : ''
        metaObj.imageUrl = data.image ? data.image.url : ''
        metaObj.found = false


        return metaObj
      }
    })
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
    .catch(err => {
      console.error(err.message)
      return `could not retrieve metadata for ${url}`
    })
}

const updateSeed = async () => {
  let data = await session.run(`
    MATCH (r:Resource)
    RETURN collect(r.url)
  `)
  let urls = data.records[0]._fields[0].reverse()
  let metaObj = {},
    md = {},
    metadata = {},
    res = {}

  for (let i = 0; i < urls.length; i++) {
    try {
      metadata = await scrape(urls[i])
      md = metadata.openGraph
      metaObj = {}

      if (!md) {
        throw new Error('No metadata found or empty string returned')
      } else {
        metaObj.name = md.title ? md.title : ''
        metaObj.type = md.type ? md.type : ''
        metaObj.description = md.description ? md.description : ''
        metaObj.imageUrl = md.image ? md.image.url : ''

        res = await session.run(
          `
          MATCH (r:Resource)
          WHERE r.url = {url}
          SET r.name = {name}, r.type = {type}, r.description = {description}, r.imageUrl = {imageUrl}
        `,
          {
            url: urls[i],
            type: metaObj.type,
            name: metaObj.name,
            description: metaObj.description,
            imageUrl: metaObj.imageUrl
          }
        )
      }
    } catch (err) {
      console.error('error with ', urls[i], ' -- ', err.message)
    }
    // urls.forEach(async url => {
    //   await scrape(url)
    //     .then(async metadata => {
    //       let metaObj = {}
    //       data = metadata.openGraph

    //       if (!data || !data.name) {
    //         throw new Error('No metadata found or empty string returned')
    //       } else {
    //         metaObj.name = data.name ? data.name : ''
    //         metaObj.type = data.type ? data.type : ''
    //         metaObj.description = data.description ? data.description : ''
    //         metaObj.imageUrl = data.image ? data.image.url : ''

    //         await session.run(
    //           `
    //       MATCH (r:Resource)
    //       WHERE r.url = {url}
    //       SET r.name = {name}, r.type = {type}, r.description = {description}, r.imageUrl = {imageUrl}
    //     `,
    //           {
    //             url: url,
    //             type: metaObj.type,
    //             name: metaObj.name,
    //             description: metaObj.description,
    //             imageUrl: metaObj.imageUrl
    //           }
    //         )
    //       }
    //     }).then(results => {return results})
    //     .catch(err => {
    //       console.error(url, ' -------', err.message)
    //     })
    // })
  }
}

// updateSeed()
// getMetadata('https://www.codeproject.com/Articles/126380/Writing-Readable-SQL')
module.exports = {getMetadata, updateSeed}

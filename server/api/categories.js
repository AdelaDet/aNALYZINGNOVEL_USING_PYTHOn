
const { session } = require('../db/neo')
const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

////  ROUTE FOR: /api/categories  ////



// GET /categories/all/parent
router.get(`/all/parent`, async (req, res, next) => {
  try {
    const query = `MATCH (c:Category)
    WHERE c.isLanguage
    return c`

    const result = await session.run(query)

    const categories = result.records.map((record) => {
      return record._fields
    })

    const results = categories.map((category) => {
      return category[0].properties.name
    })
    res.send(results)
    session.close()
  } catch (err) { next(err) }
})

router.get('/:categoryName/popular-paths', async (req,res,next) => {
  const category = req.params.categoryName
  const query = `
      MATCH (u:User)-[r:PATHS]->(p:Path)-[:CATEGORY]->(c:Category)
      WHERE c.name = {category} AND p.status = "public"
      WITH count(u) as Users,c,p
      OPTIONAL MATCH (rev:Review)-[:REVIEWS]->(p)
      RETURN c.name as Category, p.name as Path, Users, avg(rev.score) as Rating, p.owner as Owner, p.slug as Slug, p.uid as uid
      ORDER BY Users desc
      LIMIT 4`

  const result = await session.run(query, { category })

  const data = result.records.map((el) => {
    return {
      category: el._fields[0],
      name:  el._fields[1],
      userCount: el._fields[2].low,
      rating: el._fields[3],
      owner: el._fields[4],
      slug: el._fields[5],
      uid: el._fields[6]
    }
  })

  res.json(data)
})

router.get('/:categoryName/all-paths', async (req,res,next) => {
  const category = req.params.categoryName

  const query = `
    MATCH (u:User)-[r:PATHS]->(p:Path)-[:CATEGORY]->(c:Category)
    WHERE c.name = {category} AND p.status = "public"
    WITH count(u) as Users,c,p
    OPTIONAL MATCH (rev:Review)-[:REVIEWS]->(p)
  RETURN c.name as Category, p.name as Path, Users, avg(rev.score) as Rating, p.owner as Owner, p.slug as Slug, p.uid as uid`

  const pathsInCategory = await session.run(query, { category })

  const data = pathsInCategory.records.map((el) => {
    return {
      category: el._fields[0],
      name:  el._fields[1],
      userCount: el._fields[2].low,
      rating: el._fields[3],
      owner: el._fields[4],
      slug: el._fields[5],
      uid: el._fields[6]
    }
  })

  res.send(data)
})

//all the resources and paths that have this category
router.get('/:categoryName/search', async(req,res,next) => {
  const category = req.params.categoryName
  const query = `match (p:Path)-[:CATEGORY]->(c) WHERE c.name={category} AND p.status = "public"
  optional match(rev:Review)-[:REVIEWS]->(p)
  RETURN p AS combined, avg(rev.score) as rating
  UNION
  match (r:Resource)-[:CATEGORY]->(c) where c.name={category}
  optional match(rev:Review)-[:REVIEWS]->(r)
  RETURN r AS combined, avg(rev.score) as rating`
  const response = await session.run(query, {category})
  const allPathsAndResourcesByCategory = response.records
  res.json(allPathsAndResourcesByCategory)
})


//fuzzy match for any node related to a certain category
router.post('/:categoryName/search', async (req, res, next) => {
  const category = req.params.categoryName
  const { searchString } = req.body
  const query = `MATCH (p:Path)-[:CATEGORY]->(c)
  WHERE c.name = {category} AND toLower(p.name) CONTAINS toLower({searchString})
  return p`
  const response = await session.run(query, {category, searchString})
  const fuzzyMatchByCategory = response.records
  console.log('FUZZY', fuzzyMatchByCategory)
  res.json(fuzzyMatchByCategory)
})

//route for getting the most popular categories
router.get('/popular', async (req,res,next) => {
  const query =
`  match (p:Path)-[:CATEGORY]->(c:Category)
    where c.isLanguage=true
    return c as Category, count(p) as Paths
    order by count(p) desc
    limit 10`

  const result = await session.run(query)

  const reducedResponse = recordsReducer(result.records)
  res.send(reducedResponse)
})

module.exports = router

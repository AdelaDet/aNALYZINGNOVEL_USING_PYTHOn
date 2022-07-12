const router = require('express').Router()
module.exports = router

router.use('/userAuth/', require('./userAuth'))
router.use('/users', require('./users'))
router.use('/paths', require('./paths'))
router.use('/categories', require('./categories'))
router.use('/resources', require('./resources'))
router.use('/search', require('./search'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

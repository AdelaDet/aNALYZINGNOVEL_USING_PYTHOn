
const router = require('express').Router()
module.exports = router

// api/userAuth/paths
router.use('/paths', require('./paths'))
router.use('/reviews', require('./reviews'))

module.exports = router
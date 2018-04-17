const router = require('koa-router')()
const user = require('./user')
const device = require('./device')
const scm = require('./scm')
const common = require('./common')

// router.prefix = '/api'

router.use('/user',user.routes(), user.allowedMethods())
router.use('/device',device.routes(), device.allowedMethods())
router.use('/scm', scm.routes(), scm.allowedMethods())
router.use('/common', common.routes(), common.allowedMethods())

module.exports = router

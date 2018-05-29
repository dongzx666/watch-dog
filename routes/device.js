const router = require('koa-router')()
const device = require('../controllers/device')

router.post('/register', device.register)
router.post('/getDeviceLog', device.getDeviceLog)
router.post('/insertDeviceInfo', device.insertDeviceInfo)
router.post('/insertDeviceImage', device.insertDeviceImage)

module.exports = router

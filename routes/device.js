const router = require('koa-router')()
const device = require('../controllers/device')

router.post('/register', device.register)
router.post('/getDeviceLog', device.getDeviceLog)
router.post('/getDeviceInfo', device.getDeviceInfo)
router.post('/insertDeviceInfo', device.insertDeviceInfo)
router.post('/getDeviceImage', device.getDeviceImage)
router.post('/insertDeviceImage', device.insertDeviceImage)

module.exports = router

const router = require('koa-router')()
const device = require('../controllers/device')

router.post('/getDeviceLog', device.getDeviceLog)
router.post('/insertDeviceInfo', device.insertDeviceInfo)
router.post('/insertDeviceImage', device.insertDeviceImage)
router.post('/postUserMsg', device.postUserMsg)

module.exports = router

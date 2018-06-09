const router = require('koa-router')()
const user = require('../controllers/user')
// import user from '../controllers/user'

router.get('/getUserInfo', user.getUserInfo)
router.post('/updateUserInfo', user.updateUserInfo)
router.post('/registerDevice', user.registerDevice)
router.post('/register', user.register)
router.post('/login', user.login)
router.post('/getDeviceImage', user.getDeviceImage)
router.post('/getDeviceInfo', user.getDeviceInfo)
router.post('/postCommand', user.postCommand)


module.exports = router

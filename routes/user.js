const router = require('koa-router')()
const user = require('../controllers/user')

router.get('/getUserInfo', user.getUserInfo)
router.post('/updateUserInfo', user.updateUserInfo)
router.post('/register', user.register)
router.post('/login', user.login)


module.exports = router

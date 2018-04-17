const router = require('koa-router')()
const scm = require('../controllers/scm.js')
const upload = require('../utils/upload_utl.js').upload

router.post('/upload', upload.single('file'), scm.uploads)

module.exports = router

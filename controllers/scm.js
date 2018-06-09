const {ApiError, ApiErrorNames} = require('../utils/err_util.js')
const tool = require('../utils/tool.js')
const config = require('../config/index.js')

exports.uploads = async (ctx, next) => {
  ctx.body = {
    filename: 'http://' + config.ip + ':' + String(process.env.PORT || '3001') + '/images/' + ctx.req.file.filename
  }
}


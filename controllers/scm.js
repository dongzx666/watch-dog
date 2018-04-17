const {ApiError, ApiErrorNames} = require('../utils/err_util.js')
const tool = require('../utils/tool.js')
const config = require('../config/index.js')

/**
 * @apiDefine CODE_0
 * @apiSuccess (Success 200) {number} err_code 0
 * @apiSuccess (Success 200) {string} msg success
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *   }
 */

/**
 * @apiDefine PARAMS_ERROR
 * @apiSuccess (Response Error 1003) {number} err_code 1003
 * @apiSuccess (Response Error 1003) {string} msg 请求参数错误
 * @apiSuccessExample {application/json} 请求参数错误案例：
 *   {
 *     "err_code": 1003,
 *     "msg": "请求参数错误",
 *   }
 */

/**
 * @apiDefine REPEATED_BIND
 * @apiSuccess (Response Error 3002) {number} err_code 3002
 * @apiSuccess (Response Error 3002) {string} msg 设备已激活
 * @apiSuccessExample {application/json} 设备已激活案例：
 *   {
 *     "err_code": 3002,
 *     "msg": "设备已激活",
 *   }
 */

/**
 * @apiDefine ILLEGAL_OPERATION
 * @apiSuccess (Response Error 2001) {number} err_code 2001
 * @apiSuccess (Response Error 2001) {string} msg 操作不合法
 * @apiSuccessExample {application/json} 操作不合法案例：
 *   {
 *     "err_code": 2001,
 *     "msg": "操作不合法",
 *   }
 */

/**
 * @api {POST} /scm/upload 文件/图片上传
 * @apiName upload
 * @apiVersion 1.0.0
 * @apiGroup Scm
 * @apiDescription 文件/图片上传
 *
 * @apiSuccess  {number} err_code 0
 * @apiSuccess  {string} msg success
 * @apiSuccess  {object} res
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *     "res": {
 *          "filename": "http://127.0.0.1:3001/images/1524232323.jpg"
        }
 *   }
 *
 */

exports.uploads = async (ctx, next) => {
  ctx.body = {
    filename: 'http://' + config.ip + ':' + String(process.env.PORT || '3001') + '/images/' + ctx.req.file.filename
  }
}


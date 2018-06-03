const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const {query, executeTrans} = require('../utils/db_util.js')
const UserModel = require('../models/user')
const UserService = require('../services/user.js')
const {testPhone} = require('../utils/format_util.js')
const rp = require('request-promise-native')

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
 * @apiDefine USER_EXIST
 * @apiSuccess (Response Error 1004) {number} err_code 1004
 * @apiSuccess (Response Error 1004) {string} msg 用户已存在
 * @apiSuccessExample {application/json} 用户已存在案例：
 *   {
 *     "err_code": 1004,
 *     "msg": "用户已存在"
 *   }
 */

/**
 * @apiDefine PASSWORD_ERROR
 * @apiSuccess (Response Error 1001) {number} err_code 1001
 * @apiSuccess (Response Error 1001) {string} msg 用户名或密码错误
 * @apiSuccessExample {application/json} 用户名或密码错误案例：
 *   {
 *     "err_code": 1001,
 *     "msg": "用户名或密码错误"
 *   }
 */

/**
 * @apiDefine ILLEGAL_OPERATION
 * @apiSuccess (Response Error 2001) {number} err_code 2001
 * @apiSuccess (Response Error 2001) {string} msg 操作不合法
 * @apiSuccessExample {application/json} 操作不合法案例：
 *   {
 *     "err_code": 2001,
 *     "msg": "操作不合法"
 *   }
 */


/**
 * @api {POST} /user/register 用户注册（*）
 * @apiName register
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiDescription 进行用户注册，POST方法，body传JSON格式手机号和密码，成功返回状态码0
 *
 * @apiParam {Object} data
 * @apiParam {String} data.phone 手机号
 * @apiParam {String} data.password 密码
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "phone": "15033508206",
 *   "password": "123456"
 * }
 *
 * @apiUse CODE_0
 * @apiUse PARAMS_ERROR
 * @apiUse USER_EXIST
 */
exports.register = async ctx => {
  const {phone, password} = ctx.request.body
  if (!Boolean(phone) ||  !Boolean(password) || !testPhone(phone)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
  const userList = await UserModel.getUserUserByPhone(phone)
  if (userList.length) {
    throw new ApiError(ApiErrorNames.USER_EXIST)
  }
  await UserModel.register({phone, password})
  ctx.body = ""
}

/**
 * @api {POST} /user/login 用户登录（*）
 * @apiName login
 * @apiGroup User
 * @apiDescription 进行用户登录，POST方法，body传JSON格式手机号和密码，成功返回状态码0和res对象（包括uid和token
 * ）
 *
 *
 * @apiParam {Object} data
 * @apiParam {String} data.phone 手机号
 * @apiParam {String} data.password 密码
 *
 * @apiParamExample {application/json} 请求body案例:
 * {
 *   "phone": "15033508206",
 *   "password": "123456"
 * }
 *
 * @apiSuccess {Number} err_code 0
 * @apiSuccess {String} msg  'success'
 * @apiSuccess {Object} res
 * @apiSuccess {String} res.uid 用户ID
 * @apiSuccess {String} res.token 用户token
 *
 * @apiSuccessExample {application/json} 响应案例:
 * {
 *   "err_code": 0,
 *   "msg": "success",
 *   "res": {
 *     "uid": 1,
 *     "token": "ccf930e0-b1a6-11e7-99c9-912787fed0d4"
 *   }
 * }
 *
 * @apiUse PARAMS_ERROR
 * @apiUse PASSWORD_ERROR
 */
exports.login = async ctx => {
  const { phone, password } = ctx.request.body
  if (!Boolean(phone) ||  !Boolean(password) || !testPhone(phone)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
  const idList = await UserModel.isExitUser(phone, password)
  if (!idList.length) {
    throw new ApiError(ApiErrorNames.PASSWORD_ERROR)
  }
  const { id } = idList[0]
  const { id:uid, token } = await UserModel.getTokenByUserId(id)
  ctx.body = {uid, token}
}

/**
 * @api {GET} /user/getUserInfo 获取用户信息（*）
 * @apiName getUserInfo
 * @apiGroup User
 * @apiDescription 获取用户信息，GET方法，headers传JSON格式uid和token，成功返回状态码0和res对象（包括用户各种信息
 * ）
 *
 * @apiHeader {String} uid 用户id
 * @apiHeader {String} token 用户token
 *
 * @apiSuccess {Number} err_code 0
 * @apiSuccess {String} msg  'success'
 * @apiSuccess {Object} res
 * @apiSuccess {String} res.id 用户id
 * @apiSuccess {String} res.phone 用户手机号
 * @apiSuccess {String} res.password 用户密码
 * @apiSuccess {String} res.name 用户昵称
 * @apiSuccess {String} res.avatar_url 用户头像url
 *
 * @apiSuccessExample {application/json} 响应案例:
 * {
 *   "err_code": 0,
 *   "msg": "success",
 *   "res": {
 *     "id": 1,
 *     "phone": "15033508206",
 *     "password": "xxxxxx",
 *     "name": "admin001",
 *     "avatar_url": "http://xxxxxxxx"
 *   }
 * }
 *
 * @apiUse ILLEGAL_OPERATION
 */
exports.getUserInfo = async ctx => {
  const {uid, token} = ctx.request.headers
  const isCurrentUser = await UserModel.isCurrentUser(uid, token)
  if (!isCurrentUser) {
    throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
  }
  const select_result = await UserModel.getInfoByUserId(uid)
  ctx.body = select_result[0]
}

/**
 * @api {POST} /user/updateUserInfo 更新用户信息（*）
 * @apiName updateUserInfo
 * @apiGroup User
 * @apiDescription 更新用户信息，POST方法，headers传JSON格式uid和token，body传JSON格式待更新信息，成功返回状态码0
 *
 * @apiHeader {String} uid 用户id
 * @apiHeader {String} token 用户token
 *
 * @apiParam {Object} data
 * @apiParam {String} [data.phone] 用户手机号
 * @apiParam {String} [data.password] 用户密码
 * @apiParam {String} [data.name] 用户昵称
 * @apiParam {String} [data.avatar_url] 用户头像url
 *
 * @apiParamExample {application/json} 请求body案例:
 * {
 *   "name": "admin002"
 * }
 *
 * @apiUse CODE_0
 * @apiUse ILLEGAL_OPERATION
 */
exports.updateUserInfo = async ctx => {
  const { uid, token } = ctx.request.headers
  const updateData = ctx.request.body
  const isCurrentUser = await UserModel.isCurrentUser(uid, token)
  if (!isCurrentUser) {
    throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
  }
  await UserModel.updateInfo(updateData, uid)
  ctx.body = ""
}

/**
 * @api {POST} /device/getDeviceInfo 获取设备信息
 * @apiName getDeviceInfo
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiDescription 获取设备信息
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1"
 * }
 *
 * @apiSuccess  {Number} err_code 0
 * @apiSuccess  {String} msg success
 * @apiSuccess  {Object} res
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *     "res": {
 *       "electricity": 100,
 *       "lock_state": 1,
 *       "knock_state": 1,
 *       "poke_state": 1,
 *       "create_time": "2017-10-21T06:26:16.000Z"
 *     }
 *   }
 *
 */

exports.getDeviceInfo = async ctx => {
  const { uid, token } = ctx.request.headers
  const { device_id } = ctx.request.body
  const result = await UserModel.getDeviceInfo({device_id})
  ctx.body = result[0]
}

/**
 * @api {POST} /user/getDeviceImage 获取设备图像
 * @apiName getDeviceImage
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiDescription 获取设备图像
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 * @apiParam {Number} data.page_size 每页个数
 * @apiParam {Number} data.page_num 页数
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1",
 *   "page_size": 5,
 *   "page_num": 1
 * }
 *
 * @apiSuccess  {Number} err_code 0
 * @apiSuccess  {String} msg success
 * @apiSuccess  {Array} res
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *     "res": [{
 *       "image_url": "http://120.25.199.214:3001/images/1515917257562.jpg"
 *     }, {
 *       "image_url": "http://120.25.199.214:3001/images/1523895285649.jpg"
 *     }]
 *   }
 *
 */

exports.getDeviceImage = async ctx => {
  const { device_id, page_size, page_num } = ctx.request.body
  UserService.validateGetImage(device_id)
  const result = await UserModel.getDeviceImage({ device_id, page_size, page_num })
  ctx.body = result
}

/**
 * @api {POST} /user/postCommand 发送指令
 * @apiName postCommand
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiDescription 发送指令
 *
 * @apiParam {Object} data
 * @apiParam {Number} data.device_id 设备id
 * @apiParam {String} data.type 类型，1为开关，2为拍照，3为电机
 * @apiParam {String} data.content 内容，若type=1，则content为0（关）或1（开），若type=2, 则content为空即可，若type=3，则content为0-100
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": 1,
 *   "type": 1,
 *   "content": 0
 * }
 *
 * @apiSuccess  {Number} err_code 0
 * @apiSuccess  {String} msg success
 * @apiSuccess  {Object} res
 * @apiSuccess  {String} res.result 若type=1或3,则result为空，若type=2,则result为图片地址
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *     "result": ""
 *   }
 *
 */

exports.postCommand = async ctx => {
  const { device_id, type, content } = ctx.request.body
  const post_result = await UserModel.postCommand({ device_id, type, content })
  const insert_id = post_result.insertId
  const options = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
        device_id,
        type,
        content
    },
    json: true
  }
  rp(options).then(res => {
    ctx.body = {
      result: res.result
    }
    if (res.result != null) {
      // const receive_result = await UserModel.receiveCommand({insert_id, result})
    }
  })
}

const {query, executeTrans} = require('../utils/db_util.js')
const DeviceModel = require('../models/device')
const DeviceService = require('../services/device.js')
const LegalModel = require('../models/legal.js')
const {ApiError, ApiErrorNames} = require('../utils/err_util.js');


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
 * @api {POST} /device/register 激活设备（*）
 * @apiName register
 * @apiVersion 1.0.0
 * @apiGroup Device
 * @apiDescription 手动进行激活设备
 *
 * @apiHeader {String} uid 用户id
 * @apiHeader {String} token 用户token
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_token 设备token
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_token": "ccf930e0-b1a6-11e7-99c9-912787fed0d4"
 * }
 *
 * @apiUse CODE_0
 * @apiUse PARAMS_ERROR
 * @apiUse REPEATED_BIND
 */
exports.register = async ctx => {
  const {uid} = ctx.request.headers
  const {device_token} = ctx.request.body
  if (!Boolean(device_token) && !Boolean(uid)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
  const device_id = await DeviceModel.isExitDevice(device_token)
  if (!device_id) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
  const isRegistered = await DeviceModel.isRegistered(device_id)
  if (isRegistered) {
    throw new ApiError(ApiErrorNames.REPEATED_BIND)
  }
  await DeviceModel.register(uid, device_id)
  ctx.body = {}
}

/**
 * @api {POST} /device/getDeviceLog 获取设备日志信息（*）
 * @apiName getDeviceLog
 * @apiVersion 1.0.0
 * @apiGroup Device
 * @apiDescription 获取设备日志信息
 *
 * @apiHeader {String} uid 用户id
 * @apiHeader {String} token 用户token
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1"
 * }
 *
 * @apiSuccess  {number} err_code 0
 * @apiSuccess  {string} msg success
 * @apiSuccess  {object} res
 * @apiSuccess  {string} res.content 日志详情
 * @apiSuccess  {string} res.create_time 日志时间
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success",
 *     "res": {
 *       "content": "发送一条短信",
 *       "create_time": "xxxxxxxx"
 *     }
 *   }
 *
 * @apiUse PARAMS_ERROR
 * @apiUse ILLEGAL_OPERATION
 */

exports.getDeviceLog = async ctx => {
  const { uid, token } = ctx.request.headers
  const { device_id, pageSize, pageNum } = ctx.request.body
  // 验证参数合法性
  if (!Boolean(uid) || !Boolean(token) || !Boolean(device_id)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
  // 验证token合法性
  const isLegal = await LegalModel.isPersonalDevice({uid, token})
  if (!isLegal) {
    throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
  }
  const result = await DeviceModel.getDeviceLog({device_id, pageSize, pageNum})
  ctx.body = result
}

/**
 * @api {POST} /device/insertDeviceInfo 插入设备信息
 * @apiName insertDeviceInfo
 * @apiVersion 1.0.0
 * @apiGroup Device
 * @apiDescription 插入设备信息
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 * @apiParam {Object} data.device_info 设备信息
 * @apiParam {String} data.device_info.electricity 设备电量
 * @apiParam {String} data.device_info.lock_state 开锁标志
 * @apiParam {String} data.device_info.poke_state 锁体检测
 * @apiParam {String} data.device_info.knock_state 震动采样
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1",
 *   "device_info": {
 *     "electricity": 100,
 *     "lock_state": 1,
 *     "knock_state": 1,
 *     "poke_state": 1
    }
 * }
 *
 * @apiSuccess  {number} err_code 0
 * @apiSuccess  {string} msg success
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success"
 *   }
 *
 */

exports.insertDeviceInfo = async ctx => {
  const { device_id, device_info } = ctx.request.body
  DeviceService.validateInsertInfo(device_id, device_info)
  await DeviceModel.insertDeviceInfo({device_id, device_info})
  // ctx.body = result
}

/**
 * @api {POST} /device/insertDeviceImage 插入设备图片信息
 * @apiName insertDeviceImage
 * @apiVersion 1.0.0
 * @apiGroup Device
 * @apiDescription 插入设备图片信息
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 * @apiParam {String} data.image_url 设备图片地址
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1",
 *   "image_url": "http://120.25.199.214:3001/images/1515917257562.jpg"
 * }
 *
 * @apiSuccess  {Number} err_code 0
 * @apiSuccess  {String} msg success
 * @apiSuccessExample {application/json} 响应案例：
 *   {
 *     "err_code": 0,
 *     "msg": "success"
 *   }
 *
 */

exports.insertDeviceImage = async ctx => {
  const { device_id, image_url } = ctx.request.body
  DeviceService.validateInsertImage(device_id, image_url)
  await DeviceModel.insertDeviceImage({ device_id, image_url })
}

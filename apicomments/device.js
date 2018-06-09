/*
* @Author: 董子鑫
* @Date:   2018-06-09 14:46:50
* @Last Modified by:   董子鑫
* @Last Modified time: 2018-06-09 23:18:54
*/

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
 * @apiParam {String} data.31 - data.35 自定义功能
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1",
 *   "device_info": {
 *     "electricity": 100,
 *     "lock_state": 1,
 *     "knock_state": 1,
 *     "poke_state": 1,
 *     "31": "",
 *     "32": "",
 *     "33": "",
 *     "34": "",
 *     "35": ""
 *   }
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

/**
 * @api {POST} /device/postUserMsg 消息推送
 * @apiName postUserMsg
 * @apiVersion 1.0.0
 * @apiGroup Device
 * @apiDescription 消息推送,目前仅支持安卓设备
 *
 * @apiParam {Object} data
 * @apiParam {String} data.device_id 设备id
 * @apiParam {String} data.content 消息内容
 *
 * @apiParamExample {application/json} 请求案例:
 * {
 *   "device_id": "1",
 *   "content": "此为报警推送信息"
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

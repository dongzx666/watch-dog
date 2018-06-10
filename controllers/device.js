// const {query, executeTrans} = require('../utils/db_util.js')
const DeviceModel = require('../models/device')
const DeviceService = require('../services/device.js')
const LegalModel = require('../models/legal.js')
const {ApiError, ApiErrorNames} = require('../utils/err_util.js')

class DeviceController {
  //
  static async getDeviceLog (ctx) {
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

  static async insertDeviceInfo (ctx) {
    const { device_id, device_info } = ctx.request.body
    DeviceService.validateInsertInfo(device_id, device_info)
    await DeviceModel.insertDeviceInfo(device_id, device_info)
    ctx.body = ""
  }
  //
  static async insertDeviceImage (ctx) {
    const { device_id, image_url } = ctx.request.body
    DeviceService.validateInsertImage(device_id, image_url)
    await DeviceModel.insertDeviceImage(device_id, image_url)
    ctx.body = ""
  }
  //
  static async postUserMsg (ctx) {
    const { device_id, content } = ctx.request.body
    // 校验id
    DeviceService.validateHaveDevice(device_id)
    // 插入数据库
    await DeviceModel.insertDeviceInfo(device_id, {content}, type = 1)
    // 提取用户信息
    const user_id = await DeviceModel.getUserByDevice(device_id)
    const alias = await DeviceModel.getAlias(user_id)
    // 极光推送
    const result = await DeviceService.jpush(alias, content)
    if (result) {
      ctx.body = result
    }
  }
}

module.exports = DeviceController

const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const {query, executeTrans} = require('../utils/db_util.js')
const UserModel = require('../models/user')
const UserService = require('../services/user.js')
const {testPhone, isExit} = require('../utils/format_util.js')
const rp = require('request-promise-native')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const jwt_secret = require('../config/index.js').jwt_secret


class UserController {
  // 用户注册
  static async register (ctx) {
    let {phone, password} = ctx.request.body
    if (!isExit({phone, password}) || !testPhone(phone)) {
      throw new ApiError(ApiErrorNames.PARAMS_ERROR)
    }
    const userList = await UserModel.getUserByPhone(phone)
    if (userList.length) {
      throw new ApiError(ApiErrorNames.USER_EXIST)
    }
    password = await bcrypt.hash(password, 5)
    await UserModel.register({phone, password})
    ctx.body = ""
  }
  // 用户登录
  static async login (ctx) {
    const { phone, password } = ctx.request.body
    if (!isExit({phone, password}) || !testPhone(phone)) {
      throw new ApiError(ApiErrorNames.PARAMS_ERROR)
    }
    const user_result = await UserModel.isExitUser(phone, password)
    const pwdCompare = await bcrypt.compare(password, user_result[0].password)
    if (!pwdCompare) {
      throw new ApiError(ApiErrorNames.PASSWORD_ERROR)
    }
    const token = jsonwebtoken.sign({
      data: { phone, password },
      // 设置 token 过期时间
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 60 seconds * 60 minutes = 1 hour, 共一个月
    }, jwt_secret)
    await UserModel.updateInfoByPhone({token}, phone)
    const device_result = await UserModel.getDeviceByUser(user_result[0].id)
    ctx.body = {token, device: device_result}
  }
  // 获取用户信息
  static async getUserInfo (ctx) {
    const token = ctx.request.headers.authorization.substring(7)
    // 校验token
    const result = await UserModel.getInfoByUserToken(token)
    if (!result.length) {
      throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
    }
    ctx.body = result[0]
  }
  // 更新用户信息
  static async updateUserInfo (ctx) {
    // 默认只允许修改这几项
    let updateData = UserService.validateUpdate(ctx.request.body)
    // 校验token
    const token = ctx.request.headers.authorization.substring(7)
    // const result = await UserService.validateToken(ctx.request.headers.authorization)
    // 如果还要修改密码
    if (ctx.request.body.password) {
      updateData.password = await bcrypt.hash(password, 5)
    }
    // 更新用户信息
    await UserModel.updateInfoByToken(updateData, token)
    ctx.body = ""
  }
  // 绑定设备
  static async registerDevice (ctx) {
    const token = ctx.request.headers.authorization.substring(7)
    const {device_id} = ctx.request.body
    // 校验token
    const user_result = await UserModel.getInfoByUserToken(token)
    if (!user_result.length) {
      throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
    }
    // 校验是否重复绑定
    const device_result = await UserModel.isRegisteredDevice(device_id)
    if (device_result.length) {
      throw new ApiError(ApiErrorNames.REPEATED_BIND)
    }
    // 绑定设备
    await UserModel.registerDevice(user_result[0].id, device_id)
    ctx.body = ""
  }
  // 获取设备信息
  static async getDeviceInfo (ctx) {
    // const token = ctx.request.headers.authorization.substring(7)
    const { device_id } = ctx.request.body
    const result = await UserModel.getDeviceInfo({device_id})
    ctx.body = result[0]
  }
  // 获取设备图片
  static async getDeviceImage (ctx) {
    let { device_id, page_size, page_num } = ctx.request.body
    page_size = ~~page_size
    page_num = ~~page_num
    const result = await UserModel.getDeviceImage({ device_id, page_size, page_num })
    ctx.body = result
  }
  // 发送指令
  static async postCommand (ctx) {
    const { device_id, type, content } = ctx.request.body
    const post_result = await UserModel.postCommand({ device_id, type, content })
    const insert_id = post_result.insertId
    const options = {
      method: 'POST',
      uri: 'http://19k6j03315.51mypc.cn:54283/receive',
      body: {
          device_id,
          type,
          content
      },
      json: true
    }
    const res = await rp(options)
    ctx.body = {
        result: res.result
      }
  }
}

module.exports = UserController

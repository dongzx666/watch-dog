const UserModel = require('../models/user')
const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const {deleteNull} = require('../utils/format_util.js')
const validator = require('validator');

exports.validateToken = async (_token) => {
  if (!_token) {
    throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
  }
  const token = _token.substring(7)
  const result = await UserModel.getInfoByUserToken(token)
  if (!result.length) {
    throw new ApiError(ApiErrorNames.ILLEGAL_OPERATION)
  }
  return {result, token}
}

exports.validateUpdate = function (obj) {
  const { name, avatar_url } = obj
  return deleteNull({ name, avatar_url })
}

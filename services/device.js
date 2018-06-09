const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const validator = require('validator');
const DeviceModel = require('../models/device')

exports.validateInsertImage = function (device_id, image_url) {
  if (device_id == null || image_url == null || validator.isEmpty(image_url)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
}

exports.validateInsertInfo = function (device_id, device_info) {
  if (device_id == null || device_info == null) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
}

exports.validateHaveDevice = function (device_id) {
  return true
}

const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const validator = require('validator');

exports.validateInsertImage = function (device_id, image_url) {
  if (device_id == null || image_url == null || validator.isEmpty(image_url)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
}

exports.validateInsertInfo = function (device_id, device_info) {
  if (device_id == null) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
}

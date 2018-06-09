const {ApiError, ApiErrorNames} = require('../utils/err_util.js');
const validator = require('validator');

exports.validateGetImage = function (device_id) {
  if (device_id == null) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }
}

exports.validateToken = async (token) => {

}

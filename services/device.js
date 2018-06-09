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

exports.jpush = async (alias, content) => {
  return new Promise(( resolve, reject ) => {
    let client = JPush.buildClient(jpush_config.key, jpush_config.secret)
    // var client = JPush.buildClient({
    //   appKey: jpush_config.key,
    //   masterSecret: jpush_config.secret,
    //   isDebug:false
    // });
    client.push().setPlatform('android')
      .setAudience(JPush.alias(alias))
      .setNotification('Hi, JPush', JPush.android(content, null, 1))
      .send()
      .then(function(result) {
          console.log(result)
          resolve( result )
      }).catch(function(err) {
          console.log(err)
          reject( err )
      })
  })
}

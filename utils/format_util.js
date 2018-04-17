exports.testPhone = function (mobilePhone) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobilePhone))) {
    return false
  }
  return true
}
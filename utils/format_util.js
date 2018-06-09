exports.testPhone = function (mobilePhone) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobilePhone))) {
    return false
  }
  return true
}

exports.isExit = function (obj) {
  console.log(obj)
  if (typeof obj !== "object") {
    throw Error('参数错误')
  }
  for (let value of Object.values(obj)) {
    if (!value) {
      return false
    }
  }
  return true
}

exports.deleteNull = function (obj) {
  let newObj = {}
  if (typeof obj !== "object") {
    throw Error('参数错误')
  }
  for (let [key,value] of Object.entries(obj)) {
    if (value) {
      newObj[key] = value
    }
  }
  return newObj
}

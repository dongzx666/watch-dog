// const codeToMsg = {
//   0: 'success',
//   1001: '用户名或密码错误',
//   1003: '格式错误',
//   1004: '用户已存在',
//   2001: 'sql执行出错',
//   2002: 'token发生错误，请重新登录',
//   3001: '设备已存在',
//   3003: '设备token输入有误或设备已经激活',
//   3002: '设备重复绑定'
// }

// exports.formatResult = function (code, data) {
//   return {
//     err_code: code,
//     msg: codeToMsg[code],
//     res: data
//   }
// }

/**
 * API错误名称
 */
var ApiErrorNames = {
  'UNKNOW_ERROR': {
    err_code: -1, msg: '未知错误'
  },
  'PASSWORD_ERROR': {
    err_code: 1001, msg: '用户名或密码错误'
  },
  'TOKEN_EXPIRED': {
    err_code: 1002, msg: 'token过期，请重新登录'
  },
  'PARAMS_ERROR': {
    err_code: 1003, msg: '请求参数错误'
  },
  'USER_EXIST': {
    err_code: 1004, msg: '用户已存在'
  },
  'DEVICE_EXIST': {
    err_code: 3001, msg: '设备已存在'
  },
  'REPEATED_BIND': {
    err_code: 3002, msg: '设备已激活'
  },
  'ILLEGAL_OPERATION': {
    err_code: 2001, msg: '操作不合法'
  }
};

exports.ApiErrorNames = ApiErrorNames;

/**
 * 自定义Api异常
 */
class ApiError extends Error{
    //构造方法
    constructor(error_info){
        super();

        if (!error_info) {
          this.err_code = ApiErrorNames.UNKNOW_ERROR.err_code
          this.msg = ApiErrorNames.UNKNOW_ERROR.msg
        } else {
          this.err_code = error_info.err_code;
          this.msg = error_info.msg;
        }
    }
}

exports.ApiError = ApiError;

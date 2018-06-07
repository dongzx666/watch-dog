/**
 * 在app.use(router)之前调用
 */
const {ApiError} = require('../utils/err_util.js')
// const {isLegal} = require('../models/user.js')

var response_formatter = function(pattern){
    return async (ctx, next) => {
        // var reg = new RegExp(pattern);
        try {
            //先去执行路由
            await next();
        } catch (error) {
            console.log('middle error is ')
            console.log(error)
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if(error instanceof ApiError){
                // ctx.status = 200;
                ctx.body = {
                    err_code: error.err_code,
                    msg: error.msg
                }
            } else {
                ctx.body = {
                    err_code: 500,
                    msg: error.originalError ? error.originalError.message : error.message
                }
            }
            //继续抛，让外层中间件处理日志
            throw error;
        }
        //通过正则的url进行格式化处理
        // if(reg.test(ctx.originalUrl)){
            // const {uid, token} = ctx.request.headers
            // const result = await isLegal({uid, token})
            // console.log(result)
            // if (ctx.body) {
            //     ctx.body = {
            //         err_code: 0,
            //         msg: 'success',
            //         res: ctx.body
            //     }
            // } else {
            //     ctx.body = {
            //         err_code: 0,
            //         msg: 'success'
            //     }
            // }
        // }
        console.log('ctx is ')
        console.log(ctx)
        if (ctx.response.status != 200) {
            ctx.body = {
                err_code: ctx.response.status,
                msg: ctx.response.message
            }
        } else {
            if (ctx.body) {
                ctx.body = {
                    err_code: 0,
                    msg: 'success',
                    res: ctx.body
                }
            } else {
                ctx.body = {
                    err_code: 0,
                    msg: 'success'
                }
            }
        }
    }
}
module.exports = response_formatter;

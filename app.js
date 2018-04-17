const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const logUtil = require('./utils/log_util.js');
const response_formatter = require('./middlewares/response_formatter')

const routes = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  let ms
  try {
    await next()
    ms = new Date() - start
    logUtil.logResponse(ctx, ms)
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (error) {
    ms = new Date() - start
    logUtil.logError(ctx, error, ms)
  }
})

// response-formatter
app.use(response_formatter());

// routes
app.use(routes.routes(), routes.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

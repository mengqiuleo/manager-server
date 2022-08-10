/*
 * @Author: Pan Jingyi
 * @Date: 2022-08-10 20:34:11
 * @LastEditTime: 2022-08-11 03:07:47
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')

const router = require('koa-router')()

const users = require('./routes/users')

// error handler
onerror(app)

//# 加载数据库
require('./config/db')

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

// app.use(() => {
//   ctx.body = 'hello'
// })

// logger
app.use(async (ctx, next) => {
  await next()
  log4js.info(`get params: ${ JSON.stringify(ctx.request.query) }`)
  log4js.info(`post params: ${ JSON.stringify(ctx.request.body) }`)
})

// routes
router.prefix('/api')

router.use(users.routes(), users.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  //console.error('server error', err, ctx)
  log4js.error(`${err.stack}`)
});

module.exports = app

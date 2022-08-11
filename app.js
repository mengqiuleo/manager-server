/*
 * @Author: Pan Jingyi
 * @Date: 2022-08-10 20:34:11
 * @LastEditTime: 2022-08-11 21:59:40
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
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

//# logger
app.use(async (ctx, next) => {
  log4js.info(`get params: ${ JSON.stringify(ctx.request.query) }`)
  log4js.info(`post params: ${ JSON.stringify(ctx.request.body) }`)
  await next().catch((err) => {
    if(err.status == '401'){
      ctx.status = 200
      ctx.body = utils.fail('Token认证失败(token可能已过期)',util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
})

app.use(koajwt({secret:'imooc'}).unless({
  path: [/^\/api\/users\/login/]
}))

// routes
router.prefix('/api')

// router.get('/leave/count',(ctx) => {
//   const token = ctx.request.headers.authorization.split(' ')[1]
//   const payload = jwt.verify(token, 'imooc')
//   console.log('count接口正在请求')
//   ctx.body = 'hello'
// })


router.use(users.routes(), users.allowedMethods())
app.use(router.routes(), router.allowedMethods())



// error-handling
app.on('error', (err, ctx) => {
  //console.error('server error', err, ctx)
  log4js.error(`${err.stack}`)
});

module.exports = app

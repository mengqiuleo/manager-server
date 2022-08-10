/*
 * @Author: Pan Jingyi
 * @Date: 2022-08-11 01:26:03
 * @LastEditTime: 2022-08-11 01:38:54
 */
const mongoose = require('mongoose')
const config = require('./index')
const log4js = require('./../utils/log4j')

mongoose.connect(config.URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  log4js.error('***数据库连接失败***')
})

db.on('open', () => {
  log4js.info('***数据库连接成功***')
})
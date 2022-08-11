/*
 * @Author: Pan Jingyi
 * @Date: 2022-08-10 20:34:11
 * @LastEditTime: 2022-08-11 22:06:08
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')

router.prefix('/users')

router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role deptId roleList')
    const data = res._doc
    console.log("登录时的data:",data)
    const token = jwt.sign({
      data,
    },'imooc',{ expiresIn: '20h' })
    console.log('token: ', token)
    if(res){
      data.token = token
      ctx.body = util.success(data)
    }else{
      ctx.body = util.fail('账号或密码不正确')
    }

  } catch(error){ //如果数据库查询出错，是可以在catch中捕获到的
    ctx.body = util.fail(error.msg)
  }
  
})

module.exports = router

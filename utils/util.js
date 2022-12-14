/*
 * @Author: Pan Jingyi
 * @Date: 2022-08-10 22:50:42
 * @LastEditTime: 2022-08-11 21:51:40
 */
const log4js = require('./log4j')
const CODE  = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, //账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, //业务请求失败
    AUTH_ERROR: 500001, // 认证失败或TOKEN过期
}

module.exports = {
  pager({pageNum = 1, pageSize = 10}){
    pageNum *= 1,
    pageSize *= 1
    const skipIndex = (pageNum - 1)*pageSize
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    }
  },

  success(data = '', msg = '', code = CODE.SUCCESS){
    log4js.debug(data)
    return {
      code, data, msg
    }
  },

  fail(msg = '', data = '', code = CODE.BUSINESS_ERROR){
    log4js.debug(msg);
    return {
      code, data, msg
    }
  },
  CODE
}
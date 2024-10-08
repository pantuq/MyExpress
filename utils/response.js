/**
 * 自定义404错误
 */
class NotFoundError extends Error {
    constructor(message) {
      super(message)
      this.name = 'NotFoundError'
    }
  }
  
  function success(res,message,data = {},code = 200){
      res.json({
          status: code,
          message,
          data
      })
  }
  
  function failure(res,err){
    // console.log(11111,res,33333);
    
      if(err.errors[0].type === 'Validation error'){
          const errors = err.errors.map(error => error.message)
          res.json({
              status: 400,
              message: '请求参数错误',
              errors
          })
      }
  
      if(err.name === 'NotFoundError'){
          res.json({
              status: 404,
              message: '资源不存在',
              errors: [err.message]
          })
      }
  
      res.json({
          status: 500,
          message: '服务器错误',
          errors: [err.message]
      })
  }
  
  module.exports = {
      NotFoundError,
      success,
      failure
  }
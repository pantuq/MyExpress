const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors')
const { success, failure } = require('../utils/responses')

module.exports = async (req, res, next) => {
    // 前端传递token一般会放在请求头也就是headers中
    // 所以在验证的时候，需要从请求头中获取token
    try{
        const { token } = req.headers
        if(!token){
            throw new UnauthorizedError('当前接口需要认证才能访问')
        }

        // 验证token是否正确
        const decoded = jwt.verify(token,process.env.SECRET)

        // 从jwt中解析出之前存入的userId
         const { userId } = decoded

        // 如果通过验证，讲userId挂载到req上，方便后续中间件或者路由使用
        req.userId = userId

        // 一定要加 next() 才能继续进入到后续中间件或路由
        next()
    }catch(err){
        failure(res, err)
    }
}
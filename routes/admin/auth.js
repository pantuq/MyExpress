const express = require('express');
const router = express.Router();
const { User } = require('../../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')
const jwt = require('jsonwebtoken')

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.get('/sign_in',async function(req,res){
    try{
        const { login, password } = req.body;
        if(!login) {
            throw new BadRequestError('邮箱/用户名必须填写')
        }
        if(!password) {
            throw new BadRequestError('密码必须填写')
        }

        const conditions = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        }
        // 查询用户
        const user = await User.findOne(conditions)
        if(!user) {
            throw new NotFoundError('用户不存在')
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compareSync(password, user.password)
        if(!isPasswordValid) {
            throw new UnauthorizedError('密码不正确')
        }

        // 验证是否为管理员
        if(user.role !== 100){
            throw new UnauthorizedError('用户没有管理员权限')
        }

        const token = jwt.sign({
            userId: user.id
            // 去.env文件里配置的SECRET
        }, process.env.SECRET,{ expiresIn: '30d'})
        // 过期时间：30天
        
        success(res,'登录成功',{token})
    }catch(err){
        failure(res,err)
    }
})

module.exports = router
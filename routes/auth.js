const express = require('express');
const router = express.Router();
const { success, failure } = require('../utils/responses');
const { User } = require('../models');
const { NotFoundError,BadRequestError,UnauthorizedError } = require('../utils/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * 用户注册
 */
router.post('/sign_up',async function(req,res){
    try{
        const body = {
            email : req.body.email,
            username: req.body.username,
            nickname : req.body.nickname,
            password : req.body.password,
            sex: 2,
            role: 0
        }

        const user = await User.create(body)
        delete user.dataValues.password     //删除返回显示的密码
        success(res,'创建用户成功',{user},201)
    }catch(err){
        failure(res,err)
    }
})

/**
 * 用户登录
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

module.exports = router;
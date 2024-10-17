const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, failure } = require('../utils/responses');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const bcrypt = require('bcryptjs');

/**
 * 查询当前登录用户详情
 */
router.get('/me', async function(req,res){
  try{
    const id = req.userId

    const conditions = {
      attributes: { exclude: ['password'] }
    }
    const user = await User.findByPk(id,conditions)

    if(!user){
      throw new NotFoundError(`ID 为 ${id} 的用户不存在`)
    }

    success(res,'查询当前用户信息成功',{user})
  }catch(err){
    failure(res, err)
  }
})

/**
 * 更新当前用户信息
 */
router.put('/info', async function(req,res){
  try{
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar
    }

    const id = req.userId
    const user = await User.findByPk(id)

    await user.update(body)
    
    success(res,'更新用户信息成功',{user})
  }catch(err){
    failure(res, err)
  }
})

/**
 * 更新当前账户信息
 */
router.put('/account', async function(req,res){
  try{
    const body = {
      email: req.body.email,
      username: req.body.username,
      current_password: req.body.current_password,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation
    }

    if(!body.current_password){
      throw new BadRequestError('请输入当前密码')
    }

    if(body.password && body.password !== body.password_confirmation){
      throw new BadRequestError('两次密码不一致')
    }

    const user = await User.findByPk(req.userId)

    // 验证当前密码是否正确
    const isPasswordValid = await bcrypt.compare(body.current_password, user.password)
    if(!isPasswordValid){
      throw new BadRequestError('当前密码不正确')
    }

    await user.update(body)

    delete user.dataValues.password

    success(res,'更新用户账户信息成功',{user})
  }catch(err){
    console.log(err);
    
    failure(res, err)
  }
})

module.exports = router;
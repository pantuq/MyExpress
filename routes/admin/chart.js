const express = require('express');
const router = express.Router();
const {sequelize ,User } = require('../../models');
const { Op, where } = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');


/**
 * 统计用户性别
 */
router.get('/sex',async function(req,res){
    try{
        const male = await User.count({where: {sex: 0}})
        const female = await User.count({where: {sex: 1}})
        const unknown = await User.count({where: {sex: 2}})

        const data = [
            {name: '男',value: male},
            {name: '女',value: female},
            {name: '未知',value: unknown}
        ]
        success(res,'查询用户性别成功',{data})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 统计每个月用户数量
 */
router.get('/user', async function(req,res){
    try{
        const [result] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`,'%Y-%m') AS `month`,COUNT(*) AS `value` FROM `users` GROUP BY `month` ORDER BY `month` ASC")

        const data = {
            months: [],
            values: []
        }

        result.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res,'查询用户数量成功',{data})
    }catch(err){
        failure(res,err)
    }
})

module.exports = router;
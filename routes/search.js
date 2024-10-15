const express = require('express')
const router = express.Router()
const { success, failure } = require('../utils/responses')
const { Course } = require('../models')
const { Op } = require('sequelize')

/**
 * 模糊搜索课程
 */
router.get('/',async function(req,res){
    try{
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize

        const conditions = {
            attributes: { exclude: ['CategoryId', 'UserId', 'content']},
            order: [['id','DESC']],
            limit: pageSize,
            offset: offset
        }

        if(query.name){
            conditions.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        const { count, rows } = await Course.findAndCountAll(conditions)
        success(res,'搜索课程成功', {
            courses: rows,
            pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                total: count
            }
        })
    }catch(err){ 
        failure(res,err)
    }
})

module.exports = router
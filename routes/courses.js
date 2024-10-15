const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 查询课程列表
 */
router.get('/',async function (req, res) {
    try{
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize

        if(!query.categoryId){
            throw new Error('获取列表失败，分类ID不能为空')
        }

        const conditions = {
            attributes: {
                exclude: ['CategoryId', 'UserId', 'content']
            },
            where: { CategoryId: query.categoryId },
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        }

        const {count,rows} = await Course.findAndCountAll(conditions)
        success(res, '查询课程列表成功', {
            courses: rows,
            pagination: {
                total: count,
                currentPage: currentPage,
                pageSize: pageSize
            }
        })
    }catch(err){
        failure(res, err)
    }
})

/**
 * 查询课程详情
 */
router.get('/:id',async function(req, res){
    try{
        const { id } = req.params
        const conditions = {
            attributes: { exclude: ['CategoryId','UserId']},
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'nickname', 'avatar', 'company']
                },
                {
                    model: Chapter,
                    as: 'chapters',
                    attributes: ['id', 'title', 'rank', 'createdAt'],
                    order: [['rank', 'ASC'],['id', 'DESC']]
                }
            ]
        }

        const course = await Course.findByPk(id, conditions)
        if(!course){
            throw new NotFoundError(`ID 为 ${id} 的课程不存在`)
        }

        success(res, '查询课程详情成功', {course})
    }catch(err){
        failure(res, err)
    }
})

module.exports = router;
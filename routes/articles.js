const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');


router.get('/',async function(req,res){
    try{
       const query = req.query
       const currentPage = Math.abs(Number(query.currentPage)) || 1
       const pageSize = Math.abs(Number(query.pageSize)) || 10
       const offset = (currentPage - 1) * pageSize

       const conditions = {
        attributes: { exclude: ['content'] },
        order: [['id','DESC']],
        limit: pageSize,
        offset: offset
       }

       const { count, rows } = await Article.findAndCountAll(conditions);
       success(res,'查询文章列表',{
        articles: rows,
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

/**
 * 查询文章详情
 */
router.get('/:id',async function(req,res){
    try{
        const { id } = req.params

        const article = await Article.findByPk(id)
        if(!article){
            throw new NotFoundError(`ID 为 ${id} 的文章不存在`)
        }

        success(res,'查询文章详情',{article})
    }catch(err){
        failure(res,err)
    }
})

module.exports = router;
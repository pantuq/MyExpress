const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const {Article} = require('../../models');
// 引入Article

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const conditions = {
            order: [['id', 'DESC']]
            // 倒序查询
        };

        const query = req.query;
        if(query.title){
            conditions.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
    
        const articles =await Article.findAll(conditions);
        // 查询所有的文章，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(articles){
            res.json({
                status: 200,
                message: '文章列表查询成功',
                data: articles
            })
        }else{
            res.json({
                status: 404,
                message: '文章列表为空',
            })
        }

    }catch(err){
        // 捕获错误
        res.json({
            status: 500,
            message: '文章列表查询失败',
            error:[err.message]
        })
    }
})

/**
 * 查询文章详情
 * GET admin/articles/:id
 */
router.get('/:id',async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        const {id} = req.params;
        const article =await Article.findByPk(id);
        if(article){
            res.json({
                status: 200,
                message: '文章详情查询成功',
                data: article
            })
        }else{
            res.json({
                status: 404,
                message: '文章不存在',
            })
        }
    }catch(err){
        res.json({
            status: 500,
            message: '文章详情查询失败',
            error:[err.message]
        })
    }
})

/**
 * 新增文章
 * POST admin/articles
 */
router.post('/', async function(req,res){
    try{
        const article =await Article.create(req.body);

        res.json({
            status: 201,
            message: '文章新增成功',
            data: article
        })
    }catch(err){
        res.json({
            status: 500,
            message: '文章新增失败',
            error:[err.message]
        })
    }
})

/**
 * 删除文章
 * DELETE admin/articles/:id
 */
router.delete('/:id', async function(req,res){
    try{
        const { id } = req.params;
        const article = await Article.findByPk(id);
        if(article){
            await article.destroy();

            res.json({
                status: 200,
                message: '文章删除成功'
            })
        }else{
            res.json({
                status: 404,
                message: '文章不存在'
            })
        }
    }catch(err){
        res.json({
            status: 500,
            message: '文章删除失败',
            error:[err.message]
        })
    }
})

/**
 * 修改文章
 * PUT admin/articles/:id
 */
router.put("/:id", async function(req,res){
    try{
        const { id } = req.params
        const article = await Article.findByPk(id)
        if(article){
            await article.update(req.body)

            res.json({
                status: 200,
                message: '文章修改成功',
                data: article
            })
        }else{
            res.json({
                status: 404,
                message: '文章不存在'
            })
        }
    }catch(err){
        res.json({
            status: 500,
            meaasge: '文章修改失败',
            error: [err.message]
        })
    }
})

module.exports = router;

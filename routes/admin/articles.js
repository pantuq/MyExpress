const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const {Article} = require('../../models');
// 引入Article

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const query = req.query;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const offset = (currentPage - 1) * pageSize;

        const conditions = {
            order: [['id', 'DESC']],
            // 倒序查询
            limit: pageSize,
            offset: offset
        };
        
        if(query.title){
            conditions.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
    
        // count是查询出来的数据总数，rows才是最终查询到的数据
        const {count,rows} =await Article.findAndCountAll(conditions);
        // 查询所有的文章，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(rows){
            res.json({
                status: 200,
                message: '文章列表查询成功',
                data: rows,
                pagination: {
                    total: count,
                    pageSize: pageSize,
                    currentPage: currentPage
                }
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
        // 白名单过滤
        // 防止用户将无关的数据插入在数据库中
        const body = filterBody(req)
        const article =await Article.create(body);

        res.json({
            status: 201,
            message: '文章新增成功',
            data: article
        })
    }catch(err){
        if(err.name === 'SequelizeValidationError'){
            const errors = err.errors.map(error => error.message)
            res.json({
                status: 400,
                // 状态码400的意思是请求中出现语法错误
                // 无效参数或者格式不正确等问题
                message: '请求参数错误',
                error: errors
            })
        }else{
            res.json({
                status: 500,
                message: '文章新增失败',
                error:[err.message]
            })
        }
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
        const body = filterBody(req)
        if(article){
            await article.update(body)

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

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        title: req.body.title,
        content: req.body.content
    }
}

module.exports = router;

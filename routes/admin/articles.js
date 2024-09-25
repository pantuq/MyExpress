const express = require('express');
const router = express.Router();

const {Article} = require('../../models');
// 引入Article

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const conditions = {
            order: [['id', 'DESC']]
            // 倒序查询
        };
    
        const articles =await Article.findAll(conditions);
        // 查询所有的文章，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        res.json({
            status: 200,
            message: '文章列表查询成功',
            data: articles
        })

    }catch(err){
        // 捕获错误
        res.json({
            status: 500,
            message: '文章列表查询失败',
            error:[err.message]
        })
    }
})

module.exports = router;

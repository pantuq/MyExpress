const express = require('express');
const router = express.Router();
const { Category } = require('../models')
const { success, failure} = require('../utils/responses')

/* 获取所有分类 */
router.get('/', async function(req, res, next) {
    try{
        const categories = await Category.findAll({
            order: [['rank','ASC'],['id','DESC']]
        })
        success(res,'查询分类成功',{categories})
        // 忘记给categories加上大括号，报错
    }catch(err){
        failure(res,err)
    }
  
});

module.exports = router;

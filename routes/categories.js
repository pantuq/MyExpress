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
        success(res,'查询成功',{categories})
    }catch(err){
        failure(res,err)
    }
  
});

module.exports = router;

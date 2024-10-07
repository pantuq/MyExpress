const express = require('express');
const router = express.Router();
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');

const {Setting} = require('../../models');
const setting = require('../../models/setting');
// 引入Setting

/**
 * 查询系统设置详情
 * GET admin/settings
 */
router.get('/', async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        
        const setting = await Setting.findByPk(1)
        
       success(res,"系统设置查询成功",{setting})
    }catch(err){
        failure(res.err)
    }
})


/**
 * 修改系统设置
 * PUT admin/settings
 */
router.put("/", async function(req,res){
    try{
        
        const setting = await Setting.findByPk(1)        
        const body = filterBody(req)
        
        await setting.update(body)

        success(res,"系统设置修改成功",{setting})
    }catch(err){
        failure(res.err)
    }
})

/**
 * 公共方法：查询数据
 * @param {Object} query 查询参数
 */
async function getSetting(req){
    const {id} = req.params
    
    const setting = await Setting.findByPk(id)
    if(!setting){
        throw new NotFoundError(`ID：${id}的系统设置不存在}`)
    }

    return setting
}

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    }
}

module.exports = router;

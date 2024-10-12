const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const {
    success,
    failure
} = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');

const {Category,Course} = require('../../models');
const category = require('../../models/category');
// 引入Category

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const query = req.query;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const offset = (currentPage - 1) * pageSize;

        const conditions = {
            order: [['rank','ASC'],['id', 'ASC']],
            // 倒序查询
            limit: pageSize,
            offset: offset
        };
        
        if(query.name){
            conditions.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }
    
        // count是查询出来的数据总数，rows才是最终查询到的数据
        const {count,rows} =await Category.findAndCountAll(conditions);
        // 查询所有的分类，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(rows){
            success(res,"分类列表查询成功",{
                categorys: rows,
                pagination: {
                    current: currentPage,
                    pageSize: pageSize,
                    total: count
                }
            })
        }else{
            res.json({
                status: 404,
                message: '分类列表为空',
            })
        }

    }catch(err){
        // 捕获错误
        failure(res,err)
    }
})

/**
 * 查询分类详情
 * GET admin/categorys/:id
 */
router.get('/:id', async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        const {id} = req.params
        const category = await Category.findByPk(id)

        res.json({category})
        
    //    success(res,"分类详情查询成功",{category})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 新增分类
 * POST admin/categorys
 */
router.post('/', async function(req,res){
    try{
        // 白名单过滤
        // 防止用户将无关的数据插入在数据库中
        const body = filterBody(req)
        const category =await Category.create(body);

        success(res,"分类新增成功",{category},201)
    }catch(err){
        failure(res,err)
    }
})

/**
 * 删除分类
 * DELETE admin/categorys/:id
 */
router.delete('/:id', async function(req,res){
    try{
        
        const {id} = req.params
        const category = await Category.findByPk(id)
        if(!category){
            throw new NotFoundError(`ID：${id}的分类不存在}`)
        }

        const count = await Course.count({
            where: {
                categoryId: id
            }
        })
        if(count > 0){
            throw new Error(`该分类下有课程，无法删除`)
        }
        
        await category.destroy();
        success(res,"分类删除成功")
        
    }catch(err){        
        failure(res,err)
    }
})
//
/**
 * 修改分类
 * PUT admin/categorys/:id
 */
router.put("/:id", async function(req,res){
    try{
        const {id} = req.params
        const category = await Category.findByPk(id)
        if(!category){
            throw new NotFoundError(`ID：${id}的分类不存在}`)
        }
        
        const body = filterBody(req)
        
        await category.update(body)

        success(res,"分类修改成功",{category})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 公共方法：查询数据
 * @param {Object} query 查询参数
 */
async function getCategory(req){
    const {id} = req.params
    
    const category = await Category.findByPk(id)
    if(!category){
        throw new NotFoundError(`ID：${id}的分类不存在}`)
    }

    return category
}

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        name: req.body.name,
        rank: req.body.rank
    }
}

module.exports = router;

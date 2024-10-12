const express = require('express');
const router = express.Router();
const { Category, User, Course, Chapter } = require('../../models');
const {Op} = require('sequelize');
const {
    success,
    failure
} = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');
const course = require('../../models/course');

// 引入Course

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const query = req.query;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const offset = (currentPage - 1) * pageSize;

        const conditions = getConditions()

        if(query.categoryId){
            conditions.where = {
                categoryId: {
                    [Op.eq]: query.categoryId
                }
            }
        }

        if(query.userId){
            conditions.where = {
                userId: {
                    [Op.eq]: query.userId
                }
            }
        }
        
        if(query.name){
            conditions.where = {
                title: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        if(query.recommended){
            conditions.where = {
                recommended: {
                    // 需要转布尔值
                    [Op.eq]: query.recommended === 'true'
                } 
            }
        }

        if(query.introductory){
            conditions.where = {
                introductory: {
                    // 需要转布尔值
                    [Op.eq]: query.introductory === 'true'
                } 
            }
        }
    
        // count是查询出来的数据总数，rows才是最终查询到的数据
        const {count,rows} =await Course.findAndCountAll(conditions);
        // 查询所有的课程，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(rows){
            success(res,"课程列表查询成功",{
                courses: rows,
                pagination: {
                    current: currentPage,
                    pageSize: pageSize,
                    total: count
                }
            })
        }else{
            res.json({
                status: 404,
                message: '课程列表为空',
            })
        }

    }catch(err){
        // 捕获错误
        failure(res,err)
    }
})

/**
 * 查询课程详情
 * GET admin/courses/:id
 */
router.get('/:id', async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        const {id} = req.params
        const conditions = getConditions()
        const course = await Course.findByPk(id,conditions)

        res.json({course})
        
    //    success(res,"课程详情查询成功",{course})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 新增课程
 * POST admin/courses
 */
router.post('/', async function(req,res){
    try{
        // 白名单过滤
        // 防止用户将无关的数据插入在数据库中
        const body = filterBody(req)
        // 获取当前登录的用户ID
        body.userId = req.user.id
        const course =await Course.create(body);

        success(res,"课程新增成功",{course},201)
    }catch(err){
        failure(res,err)
    }
})

/**
 * 删除课程
 * DELETE admin/courses/:id
 */
router.delete('/:id', async function(req,res){
    try{
        
        const {id} = req.params
        const course = await Course.findByPk(id)
        if(!course){
            throw new NotFoundError(`ID：${id}的课程不存在}`)
        }

        const chapters = await Chapter.count({where:{CourseId:id}})
        if(chapters > 0){
            throw new Error(`该课程下有章节，无法删除`)
        }
        
        await course.destroy();
        success(res,"课程删除成功")
        
    }catch(err){
        failure(res,err)
    }
})
//
/**
 * 修改课程
 * PUT admin/courses/:id
 */
router.put("/:id", async function(req,res){
    try{
        const {id} = req.params
        const course = await Course.findByPk(id)
        if(!course){
            throw new NotFoundError(`ID：${id}的课程不存在}`)
        }
        
        const body = filterBody(req)
        
        await course.update(body)

        success(res,"课程修改成功",{course})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 公共方法：查询条件
 */
function getConditions(){
    return  {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        // 先排除掉大写的CategoryId和UserId
        include: [
            {
                model: Category,
                as: 'category',
                // 查询出来的对应的数据是小写
                attributes: ['id', 'name']
                // 确定查询出来的关联数据限制在哪些字段
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }
}

/**
 * 公共方法：查询数据
 * @param {Object} query 查询参数
 */
async function getCourse(req){
    const {id} = req.params
    
    const course = await Course.findByPk(id)
    if(!course){
        throw new NotFoundError(`ID：${id}的课程不存在}`)
    }

    return course
}

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        categoryId: req.body.categoryId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content
    }
}

module.exports = router;

const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const {
    success,
    failure
} = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');

const {Chapter,Course} = require('../../models');
const chapter = require('../../models/chapter');
// 引入Chapter

router.get('/', async function(req,res){
    // 添加上try catch代码块，防止错误导致项目崩溃
    try{
        const query = req.query;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const offset = (currentPage - 1) * pageSize;

        if(!query.courseId){
            throw new Error('获取章节列表失败，课程ID不能为空');
        }       

        const conditions = {
            ...getCondition(),
            order: [['rank','ASC'],['id', 'ASC']],
            // 如果rank相等，就按照id升序排列
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

        if(query.courseId){
            conditions.where = {
                courseId: {
                    [Op.eq]: query.courseId
                }
            }
        }
    
        // count是查询出来的数据总数，rows才是最终查询到的数据
        const {count,rows} =await Chapter.findAndCountAll(conditions);
        // 查询所有的章节，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(rows){
            success(res,"章节列表查询成功",{
                chapters: rows,
                pagination: {
                    current: currentPage,
                    pageSize: pageSize,
                    total: count
                }
            })
        }else{
            res.json({
                status: 404,
                message: '章节列表为空',
            })
        }

    }catch(err){
        // 捕获错误
        failure(res,err)
    }
})

/**
 * 查询章节详情
 * GET admin/chapters/:id
 */
router.get('/:id', async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        const {id} = req.params
        const conditions = getCondition()
        const chapter = await Chapter.findByPk(id,conditions)

        res.json({chapter})
        
    //    success(res,"章节详情查询成功",{chapter})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 新增章节
 * POST admin/chapters
 */
router.post('/', async function(req,res){
    try{
        // 白名单过滤
        // 防止用户将无关的数据插入在数据库中
        const body = filterBody(req)
        const chapter =await Chapter.create(body);

        success(res,"章节新增成功",{chapter},201)
    }catch(err){
        failure(res,err)
    }
})

/**
 * 删除章节
 * DELETE admin/chapters/:id
 */
router.delete('/:id', async function(req,res){
    try{
        
        const {id} = req.params
        const chapter = await Chapter.findByPk(id)
        if(!chapter){
            throw new NotFoundError(`ID：${id}的章节不存在`)
        }
        
        await chapter.destroy();
        success(res,"章节删除成功")
        
    }catch(err){
        failure(res,err)
    }
})
//
/**
 * 修改章节
 * PUT admin/chapters/:id
 */
router.put("/:id", async function(req,res){
    try{
        const {id} = req.params
        const chapter = await Chapter.findByPk(id)
        if(!chapter){
            throw new NotFoundError(`ID：${id}的章节不存在}`)
        }
        
        const body = filterBody(req)
        
        await chapter.update(body)

        success(res,"章节修改成功",{chapter})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 公共方法： 查询条件
 */
function getCondition(){
    return {
        attributes: { exclude: ['CourseId']},
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id','name']
            }
        ]
    }
}

/**
 * 公共方法：查询数据
 * @param {Object} query 查询参数
 */
async function getChapter(req){
    const {id} = req.params
    
    const chapter = await Chapter.findByPk(id)
    if(!chapter){
        throw new NotFoundError(`ID：${id}的章节不存在}`)
    }

    return chapter
}

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank
    }
}

module.exports = router;

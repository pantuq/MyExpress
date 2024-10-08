const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');

const {User} = require('../../models');
const user = require('../../models/user');
// 引入User

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
        
        if(query.nickname){
            conditions.where = {
                title: {
                    [Op.like]: `%${query.nickname}%`
                }
            }
        }

        if(query.email){
            conditions.where = {
                email: {
                    [Op.eq]: query.email
                }
            }
        }

        if(query.username){
            conditions.where = {
                username: {
                    [Op.eq]: query.username
                }
            }
        }

        if(query.role){
            conditions.where = {
                role: {
                    [Op.eq]: query.role
                }
            }
        }
    
        // count是查询出来的数据总数，rows才是最终查询到的数据
        const {count,rows} =await User.findAndCountAll(conditions);
        // 查询所有的用户，
        // 但是需要注意的是，这个函数是异步函数，所以需要用到async await
    
        if(rows){
            success(res,"用户列表查询成功",{
                users: rows,
                pagination: {
                    current: currentPage,
                    pageSize: pageSize,
                    total: count
                }
            })
        }else{
            res.json({
                status: 404,
                message: '用户列表为空',
            })
        }

    }catch(err){
        // 捕获错误
        failure(res,err)
    }
})

/**
 * 查询用户详情
 * GET admin/users/:id
 */
router.get('/:id', async function(req,res){
    // 请求路径的参数 保存在resquest的参数中
    try{
        const {id} = req.params
        const user = await User.findByPk(id)

        res.json({user})
        
    //    success(res,"用户详情查询成功",{user})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 新增用户
 * POST admin/users
 */
router.post('/', async function(req,res){
    try{
        // 白名单过滤
        // 防止用户将无关的数据插入在数据库中
        const body = filterBody(req)
        const user =await User.create(body);

        success(res,"用户新增成功",{user},201)
    }catch(err){        
        failure(res,err)
    }
})

/**
 * 修改用户
 * PUT admin/users/:id
 */
router.put("/:id", async function(req,res){
    try{
        const {id} = req.params
        const user = await User.findByPk(id)
        if(!user){
            throw new NotFoundError(`ID：${id}的用户不存在}`)
        }
        
        const body = filterBody(req)
        
        await user.update(body)

        success(res,"用户修改成功",{user})
    }catch(err){
        failure(res,err)
    }
})

/**
 * 公共方法：查询数据
 * @param {Object} query 查询参数
 */
async function getUser(req){
    const {id} = req.params
    
    const user = await User.findByPk(id)
    if(!user){
        throw new NotFoundError(`ID：${id}的用户不存在}`)
    }

    return user
}

/**
 * 公共方法：白名单过滤
 * @param {Object} body 需要过滤的对象
 * 
 */
function filterBody(req){
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    }
}

module.exports = router;

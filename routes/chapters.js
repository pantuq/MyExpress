const express = require('express');
const router = express.Router();
const { Course, Chapter, Category, User } = require('../models');
const { success, failure } = require('../utils/responses')
const { NotFoundError } = require('../utils/errors');

router.get('/:id', async function(req, res){
    try{
        const { id } = req.params
        const conditions = {
            attributes: { exclude: ['CourseId']},
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            // 章节和User没有直接的关联，
                            // 所以要借助课程来获取User
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'nickname', 'avatar', 'company']
                        }
                    ]
                }
            ]
        }

        const chapter = await Chapter.findByPk(id, conditions)
        if(!chapter) throw new NotFoundError(`ID为 ${id} 对应章节不存在`)

        const chapters = await Chapter.findAll({
            attributes: { exclude: ['CourseId', 'content']},
            where: { courseId: chapter.courseId },
            order: [['rank', 'ASC'],['id','DESC']],
        })

        success(res,'查询章节成功',{chapter,chapters})
    }catch(err){       
        failure(res, err)
    }
})

module.exports = router;
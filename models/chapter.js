'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment')
moment.locale('zh-cn')
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Chapter.belongsTo(models.Course,{ as: 'course' })
    }
  }
  Chapter.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '课程ID必须填写'
        },
        notEmpty: {
          msg: '课程ID不能为空'
        },
        async isPresent(value){
          const course = await sequelize.models.Course.findByPk(value);
          if(!course){
            throw new Error(`ID为${value}的课程不存在`)
          }
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '章节名称必须填写'
        },
        notEmpty: {
          msg: '章节名称不能为空'
        },
        len: {
          args: [2,25],
          msg: '章节名称长度必须在2-25个字符之间'
        }
      }
    },
    content: DataTypes.TEXT,
    video: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: {
          msg: '视频地址格式不正确'
        }
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写' },
        notEmpty: { msg: '排序不能为空' },
        isInt: { msg: '排序必须为整数' },
        isPositive(value){
          if(value < 1){
            throw new Error('排序必须为正整数')
          }
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get(){
        return moment(this.getDataValue('createdAt')).format('LL')
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get(){
        return moment(this.getDataValue('updatedAt')).format('LL')
      }
    }
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};
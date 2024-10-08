'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Category.hasMany(models.Course, { as: 'courses' })
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "名称必须填写" },
        notEmpty: { msg: "名称不能为空" },
        len: { args: [2, 45], msg: "名称长度在2-45位之间" },
        async isUnique(value){
          const category = await Category.findOne({ where: { name: value } })
          if(category){
            throw new Error('名称已存在，请选择其他名称')
          }
        }
      }
    },
    rank: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: "排序必须填写" },
        notEmpty: { msg: "排序不能为空" },
        isInt: { msg: "排序必须是一个整数" },
        isPositive(value){
          if(value <= 0){
            throw new Error("排序必须是一个正整数")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
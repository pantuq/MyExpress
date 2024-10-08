'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Course, { as: 'courses' }); 
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '邮箱必须填写' },
        notEmpty: { msg: '邮箱不能为空' },
        isEmail: { msg: '邮箱格式不正确' },
        async isUnique(value){
          const user = await User.findOne({ where: { email: value } });
          if (user) throw new Error('邮箱已存在,请直接登录');
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户名必须填写' },
        notEmpty: { msg: '用户名不能为空' },
        async isUnique(value){
          const user = await User.findOne({ where: { username: value } });
          if (user) throw new Error('用户名已存在');
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '密码必须填写' },
        notEmpty: { msg: '密码不能为空' },
      },
      set(value){
        if(value.length >= 6 && value.length <= 16){
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        }else{
          throw new Error('密码长度在6-16位之间');
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '昵称必须填写' },
        notEmpty: { msg: '昵称不能为空' },
        len: { args: [2, 16], msg: '昵称长度在2-16位之间' }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        isIn: { args: [[0, 1, 2]], msg: '性别的值必须是男性、女性或者不选择' }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: '用户组必须选择' },
        notEmpty: { msg: '用户组不能为空' },
        isIn: { args: [[0, 100]], msg: '用户组的值必须是普通用户或管理员' }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '图片地址不正确' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
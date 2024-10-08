'use strict';

const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users",[
      {
        email: 'admin@123',
        username: 'admin',
        password: bcrypt.hashSync('123456', 10),
        nickname: '管理员',
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@123',
        username: 'user1',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@123',
        username: 'user2',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户2',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@123',
        username: 'user3',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户3',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@123',
        username: 'user4',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户4',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user5@123',
        username: 'user5',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户5',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user6@123',
        username: 'user6',
        password: bcrypt.hashSync('123456', 10),
        nickname: '普通用户6',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

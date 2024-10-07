'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: '前端',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '后端',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '算法',
        rank: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '移动端开发',
        rank: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '数据库',
        rank: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '运维',
        rank: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '公共',
        rank: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ],{})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};

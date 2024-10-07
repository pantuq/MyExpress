'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSINGED
      },
      courseId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSINGED
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSINGED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('Likes', ['userId']);
    await queryInterface.addIndex('Likes', ['courseId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};
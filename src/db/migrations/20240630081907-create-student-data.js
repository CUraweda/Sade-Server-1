'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_student_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: 'tbl_students', 
          key: 'id',
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING
      },
      nis: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: false,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_student_data');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_payment_report', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_post_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: 'tbl_payment_post', 
          key: 'id',
        },
        allowNull: false,
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
      payment: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.DOUBLE
      },
      payment_date: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_payment_report');
  }
};

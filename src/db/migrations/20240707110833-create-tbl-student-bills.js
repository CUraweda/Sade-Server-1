'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_student_bills', {
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
          model: 'tbl_students'
        },
      },
      payment_bill_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_payment_bills"
        }
      },
      evidence_path: {
        allowNull: true,
        type: Sequelize.STRING
      },
      paidoff_at: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('tbl_student_bills');
  }
};

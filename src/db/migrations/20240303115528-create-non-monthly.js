"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_non_monthly", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_class_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_students_in_class",
          key: "id",
        },
      },
      payment_category_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_payment_category",
          key: "id",
        },
      },
      academic_year: {
        type: Sequelize.STRING,
      },
      bill_amount: {
        type: Sequelize.DOUBLE,
      },
      payment_status: {
        type: Sequelize.STRING,
      },
      payment_date: {
        type: Sequelize.DATE,
      },
      payment_response: {
        type: Sequelize.TEXT,
      },
      invoice: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_non_monthly");
  },
};

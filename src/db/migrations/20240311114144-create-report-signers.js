"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_report_signers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_classes",
          key: "id",
        },
      },
      academic_year: {
        type: Sequelize.STRING,
      },
      semester: {
        type: Sequelize.INTEGER,
      },
      head: {
        type: Sequelize.STRING,
      },
      form_teacher: {
        type: Sequelize.STRING,
      },
      facilitator: {
        type: Sequelize.STRING,
      },
      sign_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("tbl_report_signers");
  },
};

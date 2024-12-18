"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_employee_signature", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        unique: true,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employees",
          key: "id"
        }
      },
      signature_path: {
        type: Sequelize.STRING
      },
      signature_name: {
        type: Sequelize.STRING
      },
      is_headmaster: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      headmaster_of: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      is_form_teacher: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      form_teacher_class_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "ref_classes",
          key: "id"
        }
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_signature");
  },
};

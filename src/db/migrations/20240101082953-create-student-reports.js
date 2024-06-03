"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_student_reports", {
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
      semester: {
        type: Sequelize.INTEGER,
      },
      number_path: {
        type: Sequelize.STRING,
      },
      narrative_path: {
        type: Sequelize.STRING,
      },
      portofolio_path: {
        type: Sequelize.STRING,
      },
      merged_path: {
        type: Sequelize.STRING,
      },
      nar_teacher_comments: {
        type: Sequelize.TEXT,
      },
      nar_parent_comments: {
        type: Sequelize.TEXT,
      },
      por_teacher_comments: {
        type: Sequelize.TEXT,
      },
      por_parent_comments: {
        type: Sequelize.TEXT,
      },
      nar_comments_path: {
        type: Sequelize.STRING,
      },
      por_comments_path: {
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
    await queryInterface.dropTable("tbl_student_reports");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_student_task", {
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
      task_category_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_task_categories",
          key: "id",
        },
      },
      semester: {
        type: Sequelize.INTEGER,
      },
      subject_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_subjects",
          key: "id",
        },
      },
      topic: {
        type: Sequelize.STRING,
      },
      characteristic: {
        type: Sequelize.STRING,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
      },
      assign_value: {
        type: Sequelize.DOUBLE,
      },
      feed_fwd: {
        type: Sequelize.STRING,
      },
      up_file: {
        type: Sequelize.STRING,
      },
      down_file: {
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
    await queryInterface.dropTable("tbl_student_task");
  },
};

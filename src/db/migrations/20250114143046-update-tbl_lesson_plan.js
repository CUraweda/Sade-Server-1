'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_lesson_plan', 'subject_id', {
      type: Sequelize.INTEGER,
      references: {
        model: "ref_subjects",
        key: "id"
      },
      allowNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addColumn('tbl_lesson_plan', 'employee_id', {
      type: Sequelize.INTEGER,
      references: {
        model: "tbl_employees",
        key: "id"
      },
      allowNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_lesson_plan', 'subject_id');
    await queryInterface.removeColumn('tbl_lesson_plan', 'employee_id');
  }
};

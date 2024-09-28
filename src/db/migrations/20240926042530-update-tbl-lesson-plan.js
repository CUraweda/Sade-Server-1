'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_lesson_plan', 'class')

    await queryInterface.addColumn('tbl_lesson_plan', 'class_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "ref_classes",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_lesson_plan', 'class_id')

    await queryInterface.addColumn('tbl_lesson_plan', 'class', { type: Sequelize.STRING });
  }
};

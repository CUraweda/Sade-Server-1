'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_student_data', 'grade');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_student_data', 'grade', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
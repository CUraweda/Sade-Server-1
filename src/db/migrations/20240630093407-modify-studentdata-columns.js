'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('tbl_student_data', 'createdAt', 'created_at');
    await queryInterface.renameColumn('tbl_student_data', 'updatedAt', 'updated_at');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('tbl_student_data', 'created_at', 'createdAt');
    await queryInterface.renameColumn('tbl_student_data', 'updated_at', 'updatedAt');
  }
};

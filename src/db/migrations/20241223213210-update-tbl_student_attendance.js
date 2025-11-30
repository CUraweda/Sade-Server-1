'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_students_attendance', 'uid', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('tbl_students_attendance', 'uid');
  }
};

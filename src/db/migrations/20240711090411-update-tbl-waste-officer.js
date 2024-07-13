'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename column from 'class' to 'class_name'
    await queryInterface.renameColumn('tbl_waste_officer', 'class', 'class_name');
  },

  async down(queryInterface, Sequelize) {
    // Revert column name back from 'class_name' to 'class'
    await queryInterface.renameColumn('tbl_waste_officer', 'class_name', 'class');
  }
};

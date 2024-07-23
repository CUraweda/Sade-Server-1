'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column 'status' to 'is_active'
    await queryInterface.renameColumn('tbl_form_subject', 'status', 'is_active');

    // Change the data type of the renamed column to BOOLEAN
    await queryInterface.changeColumn('tbl_form_subject', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,  // Adjust as needed based on your requirements
      defaultValue: false  // Adjust the default value as needed
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the column data type change
    await queryInterface.changeColumn('tbl_form_subject', 'is_active', {
      type: Sequelize.STRING,  // Assuming the original type was STRING
      allowNull: true  // Adjust based on original column definition
    });

    // Rename the column 'is_active' back to 'status'
    await queryInterface.renameColumn('tbl_form_subject', 'is_active', 'status');
  }
};

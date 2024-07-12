'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify column type from datetime to date
    await queryInterface.changeColumn('tbl_waste_officer', 'assignment_date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the column type back to datetime
    await queryInterface.changeColumn('tbl_waste_officer', 'assignment_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};

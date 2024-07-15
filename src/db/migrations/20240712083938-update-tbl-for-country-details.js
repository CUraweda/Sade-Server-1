'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_for_country_details', 'plan_date', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('tbl_for_country_details', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('tbl_for_country_details', 'is_date_approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_for_country_details', 'plan_date')
    await queryInterface.removeColumn('tbl_for_country_details', 'status')
    await queryInterface.removeColumn('tbl_for_country_details', 'is_date_approved')
  }
};

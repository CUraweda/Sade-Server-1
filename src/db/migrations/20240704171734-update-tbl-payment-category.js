'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.renameTable('tbl_payment_categrory', 'tbl_payment_category');
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.renameTable('tbl_payment_category', 'tbl_payment_categrory');
  }
};
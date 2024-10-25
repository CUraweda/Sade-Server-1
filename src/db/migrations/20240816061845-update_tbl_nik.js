'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_parents', 'nik', {
      type: Sequelize.STRING,
      allowNull: true,
      onUpdate: 'CASCADE',
      onUpdate: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_parents', 'nik')
  }
};


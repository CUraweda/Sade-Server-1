'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ref_classes', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // You can change this to false if you don't want to allow null values
      defaultValue: null // You can set a default value if needed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ref_classes', 'is_active');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ref_wastetypes', 'price', {
      type: Sequelize.DOUBLE,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ref_wastetypes', 'price');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_announcements', 'class_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ref_classes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_announcements', 'class_id');
  }
};

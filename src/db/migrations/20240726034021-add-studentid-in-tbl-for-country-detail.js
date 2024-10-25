'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_for_country_details', 'student_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_for_country_details', 'student_id');
  }
};

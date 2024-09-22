'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_edu_calendar_details', 'teacher_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_employees',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onUpdate: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('tbl_edu_calendar_details', 'teacher_id');
  }
};

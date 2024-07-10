'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tbl_student_bills', 'paidoff_at', {
			type: Sequelize.DATE,
			allowNull: true,
		});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tbl_student_bills', 'paidoff_at', {
			type: Sequelize.STRING,
			allowNull: true,
		});
  }
};



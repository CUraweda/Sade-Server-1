'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('tbl_student_reports', 'student_access', Sequelize.BOOLEAN);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('tbl_student_reports', 'student_access');
	},
};

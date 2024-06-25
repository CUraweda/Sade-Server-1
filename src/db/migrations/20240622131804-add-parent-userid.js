'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('tbl_parents', 'user_id', Sequelize.INTEGER);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('tbl_parents', 'user_id');
	},
};


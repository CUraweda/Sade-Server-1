'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('tbl_parents', 'latitude', Sequelize.DOUBLE);
		await queryInterface.addColumn('tbl_parents', 'longitude', Sequelize.DOUBLE);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('tbl_parents', 'latitude');
		await queryInterface.removeColumn('tbl_parents', 'longitude');
	},
};


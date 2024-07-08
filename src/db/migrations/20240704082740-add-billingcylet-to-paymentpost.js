'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('ref_payment_post', 'billing_cycle', {
			type: Sequelize.STRING,
		});

		await queryInterface.addColumn('ref_payment_post', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		});

		await queryInterface.addColumn('ref_payment_post', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('ref_payment_post', 'billing_cycle');
		await queryInterface.removeColumn('ref_payment_post', 'created_at');
		await queryInterface.removeColumn('ref_payment_post', 'updated_at');
	},
};


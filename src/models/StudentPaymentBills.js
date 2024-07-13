'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class StudentPaymentBills extends Model {
		static associate(models) {
			StudentPaymentBills.belongsTo(models.paymentpost, {
				foreignKey: 'payment_post_id',
			});
		}
	}
	StudentPaymentBills.init(
		{
			name: DataTypes.STRING,
			academic_year: DataTypes.STRING,
			total: DataTypes.DOUBLE,
			due_date: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'studentpaymentbills',
			tableName: 'tbl_payment_bills',
			underscored: true,
		}
	);
	return StudentPaymentBills;
};

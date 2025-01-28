'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class StudentPaymentBills extends Model {
		static associate(models) {
			StudentPaymentBills.belongsTo(models.paymentpost, {
				foreignKey: 'payment_post_id',
			});
			StudentPaymentBills.hasMany(models.studentbills, {
				foreignKey: "payment_bill_id"
			})
		}
	}
	StudentPaymentBills.init(
		{
			name: DataTypes.STRING,
			academic_year: DataTypes.STRING,
			payment_post_id: DataTypes.INTEGER,
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

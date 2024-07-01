"use strict"
const {Model} = require("sequelize")
const StudentData = require("./StudentData")

module.exports = (sequelize, DataTypes) => {
    class StudentPaymentPost extends Model {
        static associate(models) {
            StudentPaymentPost.belongsTo(models.paymentpost, {
                foreignKey: "payment_post_id"
            })
            StudentPaymentPost.belongsTo(models.paymentcategory, {
                foreignKey: "payment_category_id"
            })
        }
    }
    StudentPaymentPost.init(
        {
            description: DataTypes.STRING,
            category: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "studentpaymentpost",
            tableName: "tbl_payment_post",
            underscored: true
        }
    )
    return StudentPaymentPost
}
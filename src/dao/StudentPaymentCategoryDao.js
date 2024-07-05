const SuperDao = require("./SuperDao")
const models = require("../models")
const {Op} = require("sequelize")
const { defineScript } = require("redis")

const StudentPaymentCategory = models.studentpaymentcategory
const PaymentPost = models.paymentpost

class StudentPaymentCategoryDao extends SuperDao {
    constructor() {
        super(StudentPaymentCategory)
    }
    async getById(id) {
        return StudentPaymentCategory.findAll({
          where: {
            id: id,
          },
          order: [["id", "DESC"]],
        });
    }
    
    async getCount(search) {
        return StudentPaymentCategory.count({
            where: {
                [Op.or]: [
                    {
                        "$paymentpost.name$": {
                            [Op.like]: "%" + search + "%",
                        },
                    }, 
                ],
            },
            include: [
                {
                    model: PaymentPost,
                    as: 'paymentpost',
                    attributes: ["id", "name", "desc"],
                },
            ], 
        })
    }
    async getStudentPaymentCategoryPage(search, offset, limit) {
        try {    
            const result = await StudentPaymentCategory.findAll({
                where: {
                    [Op.or]: [
                        { '$paymentpost.name$': { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                        { post: { [Op.like]: `%${search}%` } },
                        { due_date: { [Op.like]: `%${search}%` } },
                        { total: { [Op.like]: `%${search}%` } },
                    ],
                },
                include: [
                    {
                        model: PaymentPost,
                        as: 'paymentpost',
                        attributes: ["id", "name", "desc"],
                    },
                ],
                offset: offset,
                limit: limit,
                order: [['id', 'DESC']],
            });
    
            return result;
        } catch (error) {
            console.error('Error in getStudentPaymentCategory:', error);
            throw error;
        }
    }
}

module.exports = StudentPaymentCategoryDao
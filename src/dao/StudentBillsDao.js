const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where } = require("sequelize");

const StudentBills = models.studentbills
const Students = models.students;
const PaymentBills = models.studentpaymentbills
const PaymentPosts = models.paymentpost;

class StudentBillsDao extends SuperDao {
    constructor() {
        super(StudentBills)
    }
    async getByStudentId(student_id) {
        return StudentBills.findAll({
          where: {
            student_id: student_id,
          },
          order: [["id", "DESC"]],
          include: [
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: ["id", "name", "academic_year", "total", "due_date"],
                    include: [
                        {
                            model: PaymentPosts,
                            as: 'paymentpost',
                            attributes: ["id", "name", "desc", "billing_cycle"]
                        },
                    ]
                },
                {
                    model: Students,
                    as: 'student',
                    attributes: ["id", "nis", "full_name", "class"]
                },
            ],
        });
    }
    async findById(id) {
        return StudentBills.findAll({
          where: {
            id: id,
          },
          order: [["id", "DESC"]],
          include: [
              {
                  model: Students,
                  as: 'student',
                  attributes: ["id", "nis", "full_name", "class"]
              },
              {
                  model: PaymentBills,
                  as: 'studentpaymentbill',
                  attributes: ["id","student_id"]
              }
          ]
        });
    }
    async getCount(search, billId) {
        const where = {
            [Op.or]: [
                { '$student.full_name$': { [Op.like]: '%' + search + '%' } },
                { evidence_path: { [Op.like]: '%' + search + '%' } },
                { paidoff_at: { [Op.like]: '%' + search + '%' } },
                { status: { [Op.like]: '%' + search + '%' } },
            ],
        };

        if (billId) where['payment_bill_id'] = parseInt(billId);

        return StudentBills.count({
            where,
            include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["id", "nis", "full_name", "class"]
                },
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: ["id","name"]
                }
            ]
        })
    }
    async getStudentBillsPage(search,offset,limit, billId) {
        const where = {
            [Op.or]: [
                {"$student.full_name$": {[Op.like]: "%" + search + "%"}},
                {evidence_path: {[Op.like]: "%" + search + "%"}},
                {paidoff_at: {[Op.like]: "%" + search + "%"}},
                {status: {[Op.like]: "%" + search + "%"}},
            ]
        }

        if (billId) where['payment_bill_id'] = parseInt(billId)

        try {
            const result = await StudentBills.findAll({
                where,
                include: [
                    {
                        model: Students,
                        as: 'student',
                        attributes: ["id", "nis", "full_name", "class"]
                    },
                    {
                        model: PaymentBills,
                        as: 'studentpaymentbill',
                        attributes: ["id", "name"]
                    }
                ],
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]],
            })
            return result
        } catch (error) {
            console.error('Error in getStudentPaymentBillsPage:', error);
            throw error;
        }
    }
}
module.exports = StudentBillsDao
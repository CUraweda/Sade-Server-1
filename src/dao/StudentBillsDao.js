const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where, fn, col } = require("sequelize");
const { formatDateForSQL } = require("../helper/utils");

const StudentBills = models.studentbills
const Students = models.students;
const PaymentBills = models.studentpaymentbills
const PaymentPosts = models.paymentpost;
const StudentClass = models.studentclass

class StudentBillsDao extends SuperDao {
    constructor() {
        super(StudentBills)
    }
    async getByStudentId(student_id, filters) {
        const where = {
            student_id: student_id,
        }

        if (filters.cycle) {
            if (filters.cycle == 'bulanan') 
                where["$studentpaymentbill.paymentpost.billing_cycle$"] = { [Op.like]: 'bulanan'} 
            else if (filters.cycle == 'non-bulanan')
               where["$studentpaymentbill.paymentpost.billing_cycle$"] = { [Op.notLike]: 'bulanan'} 
        } 
        if (filters.status) where['status'] = { [Op.like]: filters.status }

        return StudentBills.findAll({
          where,
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
                //   attributes: ["id","student_id"]
              }
          ]
        });
    }
    async getCount(search, billId, classId) {
        const where = {
            [Op.or]: [
                { '$student.full_name$': { [Op.like]: '%' + search + '%' } },
                { evidence_path: { [Op.like]: '%' + search + '%' } },
                { paidoff_at: { [Op.like]: '%' + search + '%' } },
                { status: { [Op.like]: '%' + search + '%' } },
            ],
        };

        if (billId) where['payment_bill_id'] = parseInt(billId);
        if (classId) {
            const students = await StudentClass.findAll({
                where: {
                    class_id: classId
                }
            })
            where['student_id'] = {
                [Op.in]: students.map(st => st.student_id)
            }
        }

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
    async getStudentBillsPage(search,offset,limit, billId, classId) {
        const where = {
            [Op.or]: [
                {"$student.full_name$": {[Op.like]: "%" + search + "%"}},
                {evidence_path: {[Op.like]: "%" + search + "%"}},
                {paidoff_at: {[Op.like]: "%" + search + "%"}},
                {status: {[Op.like]: "%" + search + "%"}},
            ]
        }

        if (billId) where['payment_bill_id'] = parseInt(billId)
        if (classId) {
            const students = await StudentClass.findAll({
                where: {
                    class_id: classId
                }
            })
            where['student_id'] = {
                [Op.in]: students.map(st => st.student_id)
            }
        }

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

    async getIncome(filters = {}) {
        const where = {
            status: { [Op.like]: "lunas" }
        }

        const ands = []

        if (filters.start_date) ands.push({ paidoff_at: { [Op.gte]: formatDateForSQL(filters.start_date) }})
        if (filters.end_date) ands.push({ paidoff_at: { [Op.lte]: formatDateForSQL(filters.end_date) }})

        where[Op.and] = ands

        return await StudentBills.findAll({
            where,
            include: [
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: []
                }
            ],
            attributes: [
                [fn('SUM', col('studentpaymentbill.total')), 'sum']
            ]
        })
    } 
    async getRecentPaidOffBills(start_date, limit = 5) {
        return StudentBills.findAll({
            where: {
                paidoff_at: {
                    [Op.gte]: formatDateForSQL(start_date)
                },
                status: {
                    [Op.like]: 'belum lunas'
                },
            },
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
            limit,
            order: [["updated_at", "DESC"]],
        })
    }
}
module.exports = StudentBillsDao
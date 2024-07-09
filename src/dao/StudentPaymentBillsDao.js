const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentPaymentBills = models.studentpaymentbills;
const PaymentPosts = models.paymentpost;
const Students = models.students;
const Classes = models.classes;

class StudentPaymentBillsDao extends SuperDao {
  constructor() {
    super(StudentPaymentBills);
  }

  async getByStudentId(student_id) {
    return StudentPaymentBills.findAll({
      where: {
        student_id: student_id,
      },
      order: [["id", "DESC"]],
    });
  }

  async findByClass(class_id) {
      return StudentPaymentBills.findAll({
        where: {
          class_id: class_id,
        },
      });
  }
  async findById(id) {
    return StudentPaymentBills.findAll({
      where: {
        id: id,
      },
    });
  }
  async getCount(search) {
      return StudentPaymentBills.count({
          where: {
              [Op.or]: [
                { "$student.full_name$": { [Op.like]: "%" + search + "%"}},
                { "$paymentpost.name$": { [Op.like]: "%" + search + "%"}},
                { "$class.level$": { [Op.like]: "%" + search + "%", }},
              ],
          },
          include: [
              {
                  model: Students,
                  as: 'student',
                  attributes: ["id", "nis", "full_name", "class"],
              },
              {
                  model: Classes,
                  as: 'class',
                  attributes: ["id", "level", "class_name"],
              },
              {
                  model: PaymentPosts,
                  as: 'paymentpost',
                  attributes: ["id", "name", "desc", "billing_cycle"],
              },
          ], 
      })
  }
  async getStudentPaymentBillsPage(search, offset, limit) {
      try {

          const result = await StudentPaymentBills.findAll({
              where: {
                  [Op.or]: [
                    { "$student.full_name$": { [Op.like]: "%" + search + "%"}},
                    { "$paymentpost.name$": { [Op.like]: "%" + search + "%"}},
                    { "$class.level$": { [Op.like]: "%" + search + "%", }},
                    { total: { [Op.like]: `%${search}%` } },
                    { due_date: { [Op.like]: `%${search}%` } },
                  ],
              },
              include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["id", "nis", "full_name", "class"],
                },
                {
                    model: Classes,
                    as: 'class',
                    attributes: ["id", "level", "class_name"],
                },
                {
                    model: PaymentPosts,
                    as: 'paymentpost',
                    attributes: ["id", "name", "desc", "billing_cycle"],
                },
              ],
              offset: offset,
              limit: limit,
              order: [['id', 'DESC']],
          });

          return result;
      } catch (error) {
          console.error('Error in getStudentPaymentBillsPage:', error);
          throw error;
      }
  }

}

module.exports = StudentPaymentBillsDao;
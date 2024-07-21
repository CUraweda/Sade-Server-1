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
        // student_id: student_id,
      },
      order: [["id", "DESC"]],
      include: [
        {
            model: PaymentPosts,
            as: 'paymentpost',
            attributes: ["id", "name", "desc", "billing_cycle"],
        },
      ],
    });
  }

  async findByClass(class_id) {
      return StudentPaymentBills.findAll({
        where: {
          // class_id: class_id,
        },
        order: [["id", "DESC"]],
        include: [
          {
              model: PaymentPosts,
              as: 'paymentpost',
              attributes: ["id", "name", "desc", "billing_cycle"],
          },
        ],
      });
  }
  async findById(id) {
    return StudentPaymentBills.findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
      include: [
        {
            model: PaymentPosts,
            as: 'paymentpost',
            attributes: ["id", "name", "desc", "billing_cycle"],
        },
      ],
    });
  }
  async getCount(search, filters) {
      const where = {
        [Op.or]: [
          { "$paymentpost.name$": { [Op.like]: "%" + search + "%"}},
          { name: { [Op.like]: `%${search}%` } },
        ],
      } 

      if (filters.payment_post_id) where["payment_post_id"] = filters.payment_post_id
      if (filters.academic_year) where["academic_year"] = filters.academic_year

      return StudentPaymentBills.count({
          where,
          include: [
              {
                  model: PaymentPosts,
                  as: 'paymentpost',
                  attributes: ["id", "name", "desc", "billing_cycle"],
              },
          ], 
      })
  }
  async getStudentPaymentBillsPage(search, offset, limit, filters) {
      try {
          const where = {
            [Op.or]: [
              { "$paymentpost.name$": { [Op.like]: "%" + search + "%"}},
              { name: { [Op.like]: `%${search}%` } },
            ],
          } 

          if (filters.payment_post_id) where["payment_post_id"] = filters.payment_post_id
          if (filters.academic_year) where["academic_year"] = filters.academic_year

          const result = await StudentPaymentBills.findAll({
              where,
              include: [
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
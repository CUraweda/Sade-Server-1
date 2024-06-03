const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NonMonthly = models.nonmonthly;
const StudentClass = models.studentclass;
const PaymentCategory = models.paymentcategory;
const Students = models.students;
const PaymentPost = models.paymentpost;
const Classes = models.classes;

class NonMonthlyDao extends SuperDao {
  constructor() {
    super(NonMonthly);
  }

  async getNonMonthlyById(id) {
    return NonMonthly.findAll({
      where: {
        id,
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
              attributes: ["id", "nisn", "nis", "full_name"],
            },
            {
              model: Classes,
              attributes: ["id", "class_name"],
            },
          ],
        },
        {
          model: PaymentCategory,
          attributes: [],
          attributes: ["id", "payment_type", "billing_cycle", "level"],
          include: [{ model: PaymentPost }],
        },
      ],
    });
  }

  async getNonMonthlyByStudent(student_id) {
    return NonMonthly.findAll({
      where: {
        "$studentclass.student_id$": student_id,
      },
      include: [
        {
          model: StudentClass,
          attributes: ["academic_year", "is_active"],
          include: [
            {
              model: Students,
              attributes: ["id", "nisn", "nis", "full_name"],
            },
            {
              model: Classes,
              attributes: ["id", "class_name"],
            },
          ],
        },
        {
          model: PaymentCategory,
          attributes: ["id", "payment_type", "billing_cycle", "level"],
          include: [{ model: PaymentPost }],
        },
      ],
    });
  }

  async getCount(search) {
    return NonMonthly.count({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            payment_status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getNonMonthlyPage(search, offset, limit) {
    return NonMonthly.findAll({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            payment_status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = NonMonthlyDao;

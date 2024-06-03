const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Monthly = models.monthly;
const StudentClass = models.studentclass;
const PaymentCategory = models.paymentcategory;
const Students = models.students;
const PaymentPost = models.paymentpost;
const Classes = models.classes;
const Months = models.months;

class MonthlyDao extends SuperDao {
  constructor() {
    super(Monthly);
  }

  async getMonthlyById(id) {
    return Monthly.findAll({
      where: {
        id,
      },
      include: [
        {
          model: Months,
        },
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

  async getMonthlyByStudent(student_id) {
    return Monthly.findAll({
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
    return Monthly.count({
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

  async getMonthlyPage(search, offset, limit) {
    return Monthly.findAll({
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
module.exports = MonthlyDao;

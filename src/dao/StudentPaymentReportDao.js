const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const Students = models.students;
const StudentBills = models.studentbills;
const PaymentBills = models.studentpaymentbills;
const StudentClass = models.studentclass;
const PaymentPosts = models.paymentpost;

class StudentPaymentReportDao extends SuperDao {
  async getById(id) {
    return StudentBills.findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
      attributes: ["id", "status", "paidoff_at"],
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["full_name", "nis"],
        },
        {
          model: PaymentBills,
          as: "studentpaymentbill",
          attributes: ["name", "due_date", "class_id"],
        },
      ],
    });
  }

  async getByStudentId(student_id) {
    return StudentBills.findAll({
      where: {
        student_id: student_id,
      },
      order: [["id", "DESC"]],
      attributes: ["id", "status", "paidoff_at"],
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["full_name", "nis"],
        },
        {
          model: PaymentBills,
          as: "studentpaymentbill",
          attributes: ["name", "due_date", "class_id"],
        },
      ],
    });
  }

  async getByClassId(class_id) {
    return StudentBills.findAll({
      where: {
        "$studentpaymentbill.class_id$": class_id,
      },
      order: [["id", "DESC"]],
      attributes: ["id", "status", "paidoff_at"],
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["full_name", "nis"],
        },
        {
          model: PaymentBills,
          as: "studentpaymentbill",
          attributes: ["name", "due_date", "class_id"],
        },
      ],
    });
  }
  async getByFilter(
    classes,
    student,
    start_date,
    end_date,
    payment_category,
    status
  ) {
    const whereClause = {};

    if (classes) whereClause["$studentpaymentbill.class_id$"] = classes;
    if (student)
      whereClause["$student.full_name$"] = { [Op.like]: `%${student}%` };
    if (start_date)
      whereClause["$studentpaymentbill.due_date$"] = {
        [Op.gte]: new Date(start_date),
      };
    if (end_date) whereClause["paidoff_at"] = { [Op.lte]: new Date(end_date) };
    if (payment_category)
      whereClause["$studentpaymentbill.name$"] = payment_category;
    if (status) whereClause["status"] = status;

    return StudentBills.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
      attributes: ["id", "status", "paidoff_at"],
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["full_name", "nis"],
        },
        {
          model: PaymentBills,
          as: "studentpaymentbill",
          attributes: ["name", "due_date", "class_id"],
        },
      ],
    });
  }

  async getCount(search, filters) {
    const where = {
      [Op.or]: [
        { "$student.full_name$": { [Op.like]: "%" + search + "%" } },
        { "$student.nis$": { [Op.like]: "%" + search + "%" } },
        { "$studentpaymentbill.name$": { [Op.like]: "%" + search + "%" } },
        { status: { [Op.like]: "%" + search + "%" } },
      ],
    };

    if (filters.payment_category_id)
      where["payment_bill_id"] = filters.payment_category_id;
    if (filters.start_paid)
      where["paidoff_at"] = { [Op.gte]: filters.start_paid };
    if (filters.end_paid) where["paidoff_at"] = { [Op.lte]: filters.end_paid };
    if (filters.status) where["status"] = { [Op.like]: filters.status };
    if (filters.nis_prefix)
      where["$student.nis$"] = { [Op.like]: `${filters.nis_prefix}%` };
    if (filters.post_payment_id)
      where["$studentpaymentbill.payment_post_id$"] = filters.post_payment_id;
    if (filters.class_id) {
      const students = await StudentClass.findAll({
        where: {
          class_id: filters.class_id,
        },
      });
      where["student_id"] = {
        [Op.in]: students.map((st) => st.student_id),
      };
    }
    if (filters.student_id) where["student_id"] = filters.student_id;

    return StudentBills.count({
      where,
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["full_name", "nis"],
        },
        {
          model: PaymentBills,
          as: "studentpaymentbill",
          attributes: ["name", "due_date"],
          include: [
            {
              model: PaymentPosts,
              as: "paymentpost",
              attributes: ["name", "billing_cycle"],
            },
          ],
        },
      ],
    });
  }
  async getStudentBillsPage(search, offset, limit, filters) {
    const where = {
      [Op.or]: [
        { "$student.full_name$": { [Op.like]: "%" + search + "%" } },
        { "$student.nis$": { [Op.like]: "%" + search + "%" } },
        { "$studentpaymentbill.name$": { [Op.like]: "%" + search + "%" } },
        { status: { [Op.like]: "%" + search + "%" } },
      ],
    };

    if (filters.payment_category_id)
      where["payment_bill_id"] = filters.payment_category_id;
    if (filters.start_paid)
      where["paidoff_at"] = { [Op.gte]: filters.start_paid };
    if (filters.end_paid) where["paidoff_at"] = { [Op.lte]: filters.end_paid };
    if (filters.status) where["status"] = { [Op.like]: filters.status };
    if (filters.nis_prefix)
      where["$student.nis$"] = { [Op.like]: `${filters.nis_prefix}%` };
    if (filters.post_payment_id)
      where["$studentpaymentbill.payment_post_id$"] = filters.post_payment_id;
    if (filters.class_id) {
      const students = await StudentClass.findAll({
        where: {
          class_id: filters.class_id,
        },
      });
      where["student_id"] = {
        [Op.in]: students.map((st) => st.student_id),
      };
    }
    if (filters.student_id) where["student_id"] = filters.student_id;
    if (filters.pos)
      where["$studentpaymentbill.paymentpost.id$"] = filters.pos;
    try {
      const result = await StudentBills.findAll({
        where,
        attributes: [
          "id",
          "status",
          "student_id",
          "payment_bill_id",
          "paidoff_at",
        ],
        include: [
          {
            model: Students,
            as: "student",
            attributes: ["full_name", "nis"],
          },
          {
            model: PaymentBills,
            as: "studentpaymentbill",
            attributes: ["name", "due_date", "total"],
            include: [
              {
                model: PaymentPosts,
                as: "paymentpost",
                attributes: [],
              },
            ],
          },
        ],
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });

      return result;
    } catch (error) {
      console.error("Error in getStudentPaymentBillsPage:", error);
      throw error;
    }
  }

async groupByStatus(search, filters) {
    const where = {
      [Op.or]: [
        { "$student.full_name$": { [Op.like]: "%" + search + "%" } },
        { "$student.nis$": { [Op.like]: "%" + search + "%" } },
        { "$studentpaymentbill.name$": { [Op.like]: "%" + search + "%" } },
        { status: { [Op.like]: "%" + search + "%" } },
      ],
    };

    if (filters.payment_category_id)
      where["payment_bill_id"] = filters.payment_category_id;
    if (filters.start_paid)
      where["paidoff_at"] = { [Op.gte]: filters.start_paid };
    if (filters.end_paid) where["paidoff_at"] = { [Op.lte]: filters.end_paid };
    if (filters.status) where["status"] = { [Op.like]: filters.status };
    if (filters.nis_prefix)
      where["$student.nis$"] = { [Op.like]: `${filters.nis_prefix}%` };
    if (filters.post_payment_id)
      where["$studentpaymentbill.payment_post_id$"] = filters.post_payment_id;
    if (filters.pos)
      where["$studentpaymentbill.paymentpost.id$"] = filters.pos;
    if (filters.class_id) {
      const students = await StudentClass.findAll({
        where: {
          class_id: filters.class_id,
        },
      });
      where["student_id"] = {
        [Op.in]: students.map((st) => st.student_id),
      };
    }
    if (filters.student_id) where["student_id"] = filters.student_id;

    try {
      const result = await StudentBills.findAll({
        where,
        attributes: [
          "status",
          [
            Sequelize.fn("SUM", Sequelize.col("studentpaymentbill.total")),
            "total",
          ],
        ],
        include: [
          {
            model: Students,
            as: "student",
            attributes: [], 
          },
          {
            model: PaymentBills, 
            as: "studentpaymentbill",
            attributes: [],
            include: [
              {
                model: PaymentPosts,
                as: "paymentpost",
                attributes: [], 
              },
            ],
          },
        ],
        group: [
          "status", 
        ],
      });

      return result;
    } catch (error) {
      console.error("Error in groupByStatus:", error);
      throw error;
    }
  }
}

module.exports = StudentPaymentReportDao;

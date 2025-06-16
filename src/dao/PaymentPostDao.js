const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const PaymentPost = models.paymentpost;
const StudentPaymentBill = models.studentpaymentbills;
const StudentBill = models.studentbills;

class PaymentPostDao extends SuperDao {
  constructor() {
    super(PaymentPost);
  }

  async getCount(search) {
    return PaymentPost.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getPaymentPostPage(search, offset, limit, startDate, endDate) {
    const sequelize = models.sequelize; // ⬅️ Wajib agar bisa pakai sequelize.escape

    let start = startDate;
    let end = endDate;

    if (startDate && endDate) {
      start = sequelize.escape(`${startDate} 00:00:00`);
      end = sequelize.escape(`${endDate} 23:59:59`);
    }
    console.log(start, end);
    

    return PaymentPost.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { desc: { [Op.like]: `%${search}%` } },
        ],
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                SELECT COALESCE(SUM(b.total), 0)
                FROM tbl_payment_bills b
                WHERE b.payment_post_id = paymentpost.id
                AND EXISTS (
                  SELECT 1 FROM tbl_student_bills ub
                  WHERE ub.payment_bill_id = b.id
                  AND ub.status = 'Lunas'
                  AND ub.updated_at BETWEEN ${start} AND ${end}
                )
              )`),
            "paid",
          ],
          [
            Sequelize.literal(`(
              SELECT COALESCE(SUM(b.total), 0)
              FROM tbl_payment_bills b
              WHERE b.payment_post_id = paymentpost.id
              AND EXISTS (
                SELECT 1 FROM tbl_student_bills ub
                WHERE ub.payment_bill_id = b.id
                AND ub.status = 'Belum Lunas'
                AND ub.updated_at BETWEEN ${start} AND ${end}
              )
            )`),
            "pending"
          ],
        ],
      },
      include: [
        {
          model: StudentPaymentBill,
          attributes: [],
        },
      ],
      group: ["id"],
      offset,
      limit,
      order: [["id", "DESC"]],
    });
  }

  async getPaymentTotalByPOS() {
    return PaymentPost.findAll({
      include: [
        {
          model: StudentPaymentBill,
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("studentpaymentbills.total")),
              "total",
            ],
          ],
          required: false,
        },
      ],
      group: ["id"],
    });
  }
}
module.exports = PaymentPostDao;

const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const PaymentPost = models.paymentpost;
const StudentPaymentBill = models.studentpaymentbills
const StudentBill = models.studentbills

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

  async getPaymentPostPage(search, offset, limit) {
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
              SELECT COALESCE(SUM(b.total * ub.paid_count), 0)
              FROM tbl_payment_bills b
              LEFT JOIN (
                SELECT payment_bill_id, COUNT(*) AS paid_count
                FROM tbl_student_bills ub
                WHERE status = 'Lunas'
                GROUP BY payment_bill_id
              ) ub ON b.id = ub.payment_bill_id
              WHERE b.payment_post_id = paymentpost.id
            )`),
            'paid'
          ],
          [
            Sequelize.literal(`(
              SELECT COALESCE(SUM(b.total * ub.not_paid_count), 0)
              FROM tbl_payment_bills b
              LEFT JOIN (
                SELECT payment_bill_id, COUNT(*) AS not_paid_count
                FROM tbl_student_bills ub
                WHERE status = 'Belum Lunas'
                GROUP BY payment_bill_id
              ) ub ON b.id = ub.payment_bill_id
              WHERE b.payment_post_id = paymentpost.id
            )`),
            'pending'
          ]
        ]
      },
      include: [
        {
          model: StudentPaymentBill,
          attributes: []
        }
      ],
      group: ['id'],
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
          attributes: [[Sequelize.fn('SUM', Sequelize.col('studentpaymentbills.total')), 'total'],],
          required: false
        }
      ],
      group: ["id"]
    })
  }
}
module.exports = PaymentPostDao;

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
      include: [
        {
          model: StudentPaymentBill,
          attributes: ["id", "total"], 
          include: [
            {
              model: StudentBill,
              attributes: ["status"],
            },
          ],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`
              (SELECT COALESCE(SUM(pb.total * (
                SELECT COUNT(*) FROM studentbills b WHERE b.payment_bill_id = pb.id AND b.status = 'Lunas'
              )), 0)
              FROM studentpaymentbills pb
              WHERE pb.payment_post_id = paymentpost.id)
            `),
            "paid_total",
          ],
          [
            Sequelize.literal(`
              (SELECT COALESCE(SUM(pb.total * (
                SELECT COUNT(*) FROM studentbills b WHERE b.payment_bill_id = pb.id AND b.status = 'Belum Lunas'
              )), 0)
              FROM studentpaymentbills pb
              WHERE pb.payment_post_id = paymentpost.id)
            `),
            "unpaid_total",
          ],
        ],
      },
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

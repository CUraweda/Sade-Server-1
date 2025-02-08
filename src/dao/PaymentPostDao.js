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
          attributes: [
            "id",
            "total",
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  `CASE WHEN studentbills.status = 'Lunas' THEN studentpaymentbills.total ELSE 0 END`
                )
              ),
              "paid_total",
            ],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  `CASE WHEN studentbills.status = 'Belum Lunas' THEN studentpaymentbills.total ELSE 0 END`
                )
              ),
              "unpaid_total",
            ],
          ],
          include: [
            {
              model: StudentBill,
              attributes: [],
            },
          ],
          required: false,
        },
      ],
      group: ["paymentpost.id"],
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

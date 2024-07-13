const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const PaymentCategory = models.paymentcategory;
const PaymentPost = models.paymentpost;

class PaymentCategoryDao extends SuperDao {
  constructor() {
    super(PaymentCategory);
  }

  async findByBillingCycle(billingCycle) {
    return PaymentCategory.findAll({
      where: {
        billing_cycle: billingCycle,
      },
    });
  }

  async getCount(search) {
    return PaymentCategory.count({
      where: {
        [Op.or]: [
          {
            "$paymentpost.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            payment_type: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            billing_cycle: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: PaymentPost,
          as: 'paymentpost',
          attributes: ["desc"]
        },
      ],
    });
  }

  async getPaymentCategoryPage(search, offset, limit) {
    return PaymentCategory.findAll({
      where: {
        [Op.or]: [
          {
            "$paymentpost.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            payment_type: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            billing_cycle: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: PaymentPost,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = PaymentCategoryDao;

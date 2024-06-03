const httpStatus = require("http-status");
const PaymentCategoryDao = require("../dao/PaymentCategoryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class PaymentCategoryService {
  constructor() {
    this.paymentCategoryDao = new PaymentCategoryDao();
  }

  createPaymentCategory = async (reqBody) => {
    try {
      let message = "Payment category successfully added.";

      let data = await this.paymentCategoryDao.create(reqBody);

      if (!data) {
        message = "Failed to create payment post.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updatePaymentCategory = async (id, body) => {
    const message = "Payment category successfully updated!";

    let rel = await this.paymentCategoryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment category not found!",
        {}
      );
    }

    const updateData = await this.paymentCategoryDao.updateWhere(
      {
        payment_post_id: body.payment_post_id,
        academic_year: body.academic_year,
        payment_type: body.payment_type,
        billing_cycle: body.billing_cycle,
        level: body.level,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showPaymentCategory = async (id) => {
    const message = "Payment category successfully retrieved!";

    let rel = await this.paymentCategoryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showPaymentCategoryByBillingCycle = async (billingCycle) => {
    const message = "Payment category successfully retrieved!";

    let rel = await this.paymentCategoryDao.findByBillingCycle(billingCycle);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.paymentCategoryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.paymentCategoryDao.getPaymentCategoryPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Payment category successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deletePaymentCategory = async (id) => {
    const message = "Payment category successfully deleted!";

    let rel = await this.paymentCategoryDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment category not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = PaymentCategoryService;

const httpStatus = require("http-status");
const PaymentPostDao = require("../dao/PaymentPostDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class PaymentPostService {
  constructor() {
    this.paymentPostDao = new PaymentPostDao();
  }

  createPaymentPost = async (reqBody) => {
    try {
      let message = "Payment post successfully added.";

      let data = await this.paymentPostDao.create(reqBody);

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

  updatePaymentPost = async (id, body) => {
    const message = "Payment post successfully updated!";

    let rel = await this.paymentPostDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment post not found!",
        {}
      );
    }

    const updateData = await this.paymentPostDao.updateWhere(
      {
        name: body.name,
        desc: body.desc,
        billing_cycle: body.billing_cycle
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showPaymentPost = async (id) => {
    const message = "Payment post successfully retrieved!";

    let rel = await this.paymentPostDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment post not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.paymentPostDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.paymentPostDao.getPaymentPostPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Payment post successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deletePaymentPost = async (id) => {
    const message = "Payment post successfully deleted!";

    let rel = await this.paymentPostDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Payment post not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = PaymentPostService;

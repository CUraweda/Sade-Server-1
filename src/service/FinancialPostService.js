const httpStatus = require("http-status");
const FinancialPostDao = require("../dao/FinancialPostDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class FinancialPostService {
  constructor() {
    this.financialPostDao = new FinancialPostDao();
  }

  createFinancialPost = async (body) => {
    try {
      let message = "Financial Post successfully added.";

      let data = await this.financialPostDao.create(body);

      if (!data) {
        message = "Failed to create financial Post.";
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

  updateFinancialPost = async (id, body) => {
    const message = "Financial Post successfully updated!";

    let rel = await this.financialPostDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Financial Post not found!",
        {}
      );
    }

    const updateData = await this.financialPostDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showFinancialPost = async (id) => {
    const message = "Financial Post successfully retrieved!";

    let rel = await this.financialPostDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Financial Post not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.financialPostDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.financialPostDao.getFinancialPostPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Financial Post successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteFinancialPost = async (id) => {
    const message = "Financial Post successfully deleted!";

    let rel = await this.financialPostDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Financial Post not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = FinancialPostService;

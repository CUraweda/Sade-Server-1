const httpStatus = require("http-status");
const MonthDao = require("../dao/MonthDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class MonthService {
  constructor() {
    this.monthDao = new MonthDao();
  }

  createMonth = async (reqBody) => {
    try {
      let message = "Month successfully added.";

      let data = await this.monthDao.create(reqBody);

      if (!data) {
        message = "Failed to create month.";
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

  updateMonth = async (id, body) => {
    const message = "Month successfully updated!";

    let rel = await this.monthDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Month not found!",
        {}
      );
    }

    const updateData = await this.monthDao.updateWhere(
      {
        name: body.name,
        status: body.status,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showMonth = async (id) => {
    const message = "Month successfully retrieved!";

    let rel = await this.monthDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Month not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.monthDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.monthDao.getMonthPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Month successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteMonth = async (id) => {
    const message = "Month successfully deleted!";

    let rel = await this.monthDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Month not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = MonthService;

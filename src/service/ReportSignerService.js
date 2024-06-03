const httpStatus = require("http-status");
const ReportSignerDao = require("../dao/ReportSignerDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class ReportSignerService {
  constructor() {
    this.reportSignerDao = new ReportSignerDao();
  }

  createReportSigner = async (reqBody) => {
    try {
      let message = "Report signer successfully added.";

      let data = await this.reportSignerDao.create(reqBody);

      if (!data) {
        message = "Failed to create report signer.";
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

  updateReportSigner = async (id, body) => {
    const message = "Report signer successfully updated!";

    let rel = await this.reportSignerDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Report signer not found!",
        {}
      );
    }

    const updateData = await this.reportSignerDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showReportSigner = async (id) => {
    const message = "Report signer successfully retrieved!";

    let rel = await this.reportSignerDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Report signer not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showReportSignerByClassId = async (id) => {
    const message = "Report signer successfully retrieved!";

    let rel = await this.reportSignerDao.getByIdClass(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Report signer not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.reportSignerDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.reportSignerDao.getReportSignerPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Report signer successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteReportSigner = async (id) => {
    const message = "Report signer successfully deleted!";

    let rel = await this.reportSignerDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Report signer not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ReportSignerService;

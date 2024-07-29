const httpStatus = require("http-status");
const ForCountryDetailDao = require("../dao/ForCountryDetailDao");
const uploadForCountry = require('../middlewares/uploadForCountry')
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");

class ForCountryDetailService {
  constructor() {
    this.forCountryDetailDao = new ForCountryDetailDao();
  }

  createForCountryDetail = async (reqBody) => {
    try {
      let data = await this.forCountryDetailDao.create(reqBody);
      if (!data) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create for your country details");
      return responseHandler.returnSuccess(httpStatus.CREATED, "For country details successfully added", data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateForCountryDetail = async (id, body) => {
    let rel = await this.forCountryDetailDao.findById(id);
    if (!rel) return responseHandler.returnSuccess(httpStatus.OK, "For your country details not found!");
    await this.forCountryDetailDao.updateById(body, id).catch((e) => {
      logger.error(e)
      return responseHandler.returnError(httpStatus[400], "Cannot update for country details")
    })

    const rData = rel.dataValues;
    if (rData.certificate_path && body.certificate_path) {
      fs.unlink(rData.certificate_path, (err) => {
        if (err) return responseHandler.returnError(httpStatus.NOT_FOUND, "Cannot delete attachment!");
      });
    }

    return responseHandler.returnSuccess(httpStatus.OK, "For your country details successfully updated!");
  };

  showForCountryDetail = async (id) => {
    const message = "For your country details successfully retrieved!";

    let rel = await this.forCountryDetailDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "For your country details not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showForCountryDetailByUserId = async (id, academic) => {
    const message = "For your country details successfully retrieved!";

    let rel = await this.forCountryDetailDao.getByUserId(id, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "For your country details not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showByDate(date, month, year) {
    const result = await this.forCountryDetailDao.getDetailsByDate(date, month, year)
    return responseHandler.returnSuccess(httpStatus.OK, "For country details by month successfully retrieved", result)
  }

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.forCountryDetailDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.forCountryDetailDao.getForCountryDetailPage(
      search,
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "For your country details successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteForCountryDetail = async (id) => {
    const message = "For your country details successfully deleted!";

    let rel = await this.forCountryDetailDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "For your country details not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ForCountryDetailService;

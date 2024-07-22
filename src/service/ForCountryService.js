const httpStatus = require("http-status");
const ForCountryDao = require("../dao/ForCountryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");

class ForCountryService {
  constructor() {
    this.forCountryDao = new ForCountryDao();
  }

  createForCountry = async (reqBody) => {
    try {
      let message = "One day for your country successfully added.";
      let data = await this.forCountryDao.create(reqBody);
      if (!data) {
        message = "Failed to create One day for your country.";
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
  
  updateForCountry = async (id, body) => {
    const message = "One day for your country successfully updated!";

    let rel = await this.forCountryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "One day for your country not found!",
        {}
      );
    }

    const updateData = await this.forCountryDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showForCountry = async (id) => {
    const message = "One day for your country successfully retrieved!";

    let rel = await this.forCountryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "ForCountry not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showForCountryByUserId = async (id, academic) => {
    const message = "One day for your country successfully retrieved!";

    let rel = await this.forCountryDao.getAllByUserId(id, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "ForCountry not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.forCountryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.forCountryDao.getForCountryPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "One day for your country successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteForCountry = async (id) => {
    const message = "One day for your country successfully deleted!";

    let rel = await this.forCountryDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "One day for your country not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ForCountryService;

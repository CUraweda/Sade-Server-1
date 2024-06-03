const httpStatus = require("http-status");
const ReligionDao = require("../dao/ReligionDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class ReligionService {
  constructor() {
    this.religionDao = new ReligionDao();
  }

  createReligion = async (reqBody) => {
    try {
      let message = "Religion successfully added.";

      let data = await this.religionDao.create(reqBody);

      if (!data) {
        message = "Failed to create religion.";
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

  updateReligion = async (id, body) => {
    const message = "Religion successfully updated!";

    let rel = await this.religionDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Religion not found!",
        {}
      );
    }

    const updateData = await this.religionDao.updateWhere(
      {
        code: body.code,
        name: body.name,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showReligion = async (id) => {
    const message = "Religion successfully retrieved!";

    let rel = await this.religionDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Religion not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.religionDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.religionDao.getReligionPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Religion successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteReligion = async (id) => {
    const message = "Religion successfully deleted!";

    let rel = await this.religionDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Religion not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ReligionService;

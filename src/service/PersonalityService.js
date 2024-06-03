const httpStatus = require("http-status");
const PersonalityDao = require("../dao/PersonalityDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class PersonalityService {
  constructor() {
    this.personalityDao = new PersonalityDao();
  }

  createPersonality = async (reqBody) => {
    try {
      let message = "Personality successfully added.";

      let data = await this.personalityDao.create(reqBody);

      if (!data) {
        message = "Failed to create personality.";
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

  updatePersonality = async (id, body) => {
    const message = "Personality successfully updated!";

    let rel = await this.personalityDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Personality not found!",
        {}
      );
    }

    const updateData = await this.personalityDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showPersonality = async (id) => {
    const message = "Personality successfully retrieved!";

    let rel = await this.personalityDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Personality not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.personalityDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.personalityDao.getPersonalityPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Personality successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deletePersonality = async (id) => {
    const message = "Personality successfully deleted!";

    let rel = await this.personalityDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Personality not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = PersonalityService;

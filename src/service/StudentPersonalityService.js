const httpStatus = require("http-status");
const StudentPersonalityDao = require("../dao/StudentPersonalityDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class StudentPersonalityService {
  constructor() {
    this.studentPersonalityDao = new StudentPersonalityDao();
  }

  createStudentPersonality = async (reqBody) => {
    try {
      let message = "Student Personality successfully added.";

      let data = await this.studentPersonalityDao.create(reqBody);

      if (!data) {
        message = "Failed to create studen personality.";
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

  updateStudentPersonality = async (id, body) => {
    const message = "Student Personality successfully updated!";

    let rel = await this.studentPersonalityDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Personality not found!",
        {}
      );
    }

    const updateData = await this.studentPersonalityDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showStudentPersonality = async (id) => {
    const message = "Student Personality successfully retrieved!";

    let rel = await this.studentPersonalityDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Personality not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.studentPersonalityDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentPersonalityDao.getStudentPersonalityPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student Personality successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteStudentPersonality = async (id) => {
    const message = "Student Personality successfully deleted!";

    let rel = await this.studentPersonalityDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Personality not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = StudentPersonalityService;

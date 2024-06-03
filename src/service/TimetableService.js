const httpStatus = require("http-status");
const TimetableDao = require("../dao/TimetableDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class TimetableService {
  constructor() {
    this.timetableDao = new TimetableDao();
  }

  createTimetable = async (reqBody) => {
    try {
      let message = "Timetable successfully added.";

      let data = await this.timetableDao.create(reqBody);

      if (!data) {
        message = "Failed to create timetable.";
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

  updateTimetable = async (id, body) => {
    const message = "Timetable successfully updated!";

    let rel = await this.timetableDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable not found!",
        {}
      );
    }

    const updateData = await this.timetableDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTimetable = async (id) => {
    const message = "Timetable successfully retrieved!";

    let rel = await this.timetableDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showTimetableByClassId = async (classId, semester, academic) => {
    const message = "Timetable successfully retrieved!";

    let data = await this.timetableDao.findByClassId(
      classId,
      semester,
      academic
    );

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, data);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.timetableDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.timetableDao.getTimetablePage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Timetable successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTimetable = async (id) => {
    const message = "Timetable successfully deleted!";

    let rel = await this.timetableDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TimetableService;

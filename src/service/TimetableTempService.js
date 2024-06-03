const httpStatus = require("http-status");
const TimetableTempDao = require("../dao/TimetableTempDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class TimetableTempService {
  constructor() {
    this.timetableTempDao = new TimetableTempDao();
  }

  createTimetableTemp = async (reqBody) => {
    try {
      let message = "Timetable Temp successfully added.";

      let data = await this.timetableTempDao.create(reqBody);

      if (!data) {
        message = "Failed to create Timetable Temp.";
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

  updateTimetableTemp = async (id, body) => {
    const message = "Timetable Temp successfully updated!";

    let rel = await this.timetableTempDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Temp not found!",
        {}
      );
    }

    const updateData = await this.timetableTempDao.updateWhere(
      {
        class_id: body.class_id,
        day_id: body.day_id,
        subject_id: body.subject_id,
        semester: body.semester,
        time_seq: body.time_seq,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTimetableTemp = async (id) => {
    const message = "Timetable Temp successfully retrieved!";

    let rel = await this.timetableTempDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Temp not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.timetableTempDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.timetableTempDao.getTimetableTempPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Timetable Temp successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTimetableTemp = async (id) => {
    const message = "Timetable Temp successfully deleted!";

    let rel = await this.timetableTempDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Temp not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TimetableTempService;

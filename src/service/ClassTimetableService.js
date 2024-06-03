const httpStatus = require("http-status");
const ClassTimetableDao = require("../dao/ClassTimetableDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const TimetableTempDao = require("../dao/TimetableTempDao");

class ClassTimetableService {
  constructor() {
    this.classTimetableDao = new ClassTimetableDao();
    this.timetableTempDao = new TimetableTempDao();
  }

  createClassTimetable = async (reqBody) => {
    try {
      let message = "Class Timetable successfully added.";

      const year = parseInt("2024", 10);
      const month = parseInt("7", 10);

      const bodyReq = [];

      // Validate year and month
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid year or month" });
      }

      // Calculate the number of days in the month
      const lastDay = new Date(year, month, 0).getDate();

      // Generate an array of weekdays for the month
      const weekdaysForMonth = [];
      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();

        // Check if it's a weekday (Monday to Friday)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          weekdaysForMonth.push(
            `${year}-${month.toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`
          );

          var tempData = await this.timetableTempDao.getByDayId(dayOfWeek);

          let tmp;
          for (let i = 0; i < tempData.length; i++) {
            tmp = tempData[i].dataValues;
            delete tmp.id;
            delete tmp.createdAt;
            delete tmp.updatedAt;
            tmp.date_at = `${year}-${month.toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`;

            bodyReq.push(tmp);
          }
        }
      }

      let data = await this.classTimetableDao.bulkCreate(bodyReq);

      if (!data) {
        message = "Failed to create Class Timetable.";
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

  updateClassTimetable = async (id, body) => {
    const message = "Class Timetable successfully updated!";

    let rel = await this.classTimetableDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Class Timetable not found!",
        {}
      );
    }

    const updateData = await this.classTimetableDao.updateWhere(
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

  showClassTimetable = async (id) => {
    const message = "Class Timetable successfully retrieved!";

    let rel = await this.classTimetableDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Class Timetable not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showByClassId = async (id) => {
    const message = "Class Timetable successfully retrieved!";

    let rel = await this.classTimetableDao.getByClassId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Class Timetable not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.classTimetableDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.classTimetableDao.getClassTimetablePage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Class Timetable successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteClassTimetable = async (id) => {
    const message = "Class Timetable successfully deleted!";

    let rel = await this.classTimetableDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Class Timetable not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ClassTimetableService;

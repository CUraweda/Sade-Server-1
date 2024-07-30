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

  duplicateCreateTimetable = async (reqBody) => {
    try {
      let message = "Timetable successfully added.";

      const dataToDuplicate = await this.timetableDao.findById(
        reqBody.timetable_id
      );

      if (!dataToDuplicate)
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "Timetable to duplicate not found!",
          {}
        );

      const startTime = new Date(dataToDuplicate.start_date)
        .toISOString()
        .split("T")[1];
      const endTime = new Date(dataToDuplicate.end_date)
        .toISOString()
        .split("T")[1];
      const startDate = new Date(reqBody.start_date);
      const endDate = new Date(reqBody.end_date);

      const dataToCreate = [];
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const datePart = date.toISOString().split("T")[0];

        dataToCreate.push({
          academic_year: dataToDuplicate.academic_year,
          class_id: dataToDuplicate.class_id,
          semester: dataToDuplicate.semester,
          title: dataToDuplicate.title,
          start_date: `${datePart}T${startTime}`,
          end_date: `${datePart}T${endTime}`,
          hide_student: dataToDuplicate.hide_student,
        });
      }

      await this.timetableDao.bulkCreate(dataToCreate);

      return responseHandler.returnSuccess(
        httpStatus.OK,
        message,
        dataToCreate
      );
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

  showTimetableByClass = async (filters) => {
    const message = "Timetable successfully retrieved!";

    let data = await this.timetableDao.findByClass(filters);

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

const httpStatus = require("http-status");
const TimetableDetailDao = require("../dao/TimetableDetailDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

const dayEnum = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
};

class TimetableDetailService {
  constructor() {
    this.timetabledetailDao = new TimetableDetailDao();
  }

  createTimetableDetail = async (reqBody) => {
    try {
      let message = "Timetable Detail successfully added.";

      const dateObject = new Date(reqBody.date_at);

      const dayOfWeek = dateObject.getDay() + 1;

      const bodyReq = {
        timetable_id: reqBody.timetable_id,
        day_id: dayOfWeek,
        date_at: reqBody.date_at,
        desc: reqBody.desc,
      };

      let data = await this.timetabledetailDao.create(bodyReq);

      if (!data) {
        message = "Failed to create timetable detail.";
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

  updateTimetableDetail = async (id, body) => {
    const message = "Timetable Detail successfully updated!";

    let rel = await this.timetabledetailDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Detail not found!",
        {}
      );
    }

    const dateObject = new Date(body.date_at);

    const dayOfWeek = dateObject.getDay() + 1;

    const updateData = await this.timetabledetailDao.updateWhere(
      {
        timetable_id: body.timetable_id,
        day_id: dayOfWeek,
        date_at: body.date_at,
        desc: body.desc,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTimetableDetail = async (id) => {
    const message = "Timetable Detail successfully retrieved!";

    let rel = await this.timetabledetailDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.timetabledetailDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.timetabledetailDao.getTimetableDetailPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Timetable Detail successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTimetableDetail = async (id) => {
    const message = "Timetable Detail successfully deleted!";

    let rel = await this.timetabledetailDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Timetable Detail not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TimetableDetailService;

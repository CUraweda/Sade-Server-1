const httpStatus = require("http-status");
const EduCalendarDao = require("../dao/EduCalendarDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class EduCalendarService {
  constructor() {
    this.eduCalendarDao = new EduCalendarDao();
  }

  createEduCalendar = async (reqBody) => {
    try {
      let message = "Edu Calendar successfully added.";

      let data = await this.eduCalendarDao.create(reqBody);

      if (!data) {
        message = "Failed to create Edu Calendar.";
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

  updateEduCalendar = async (id, body) => {
    const message = "Edu Calendar successfully updated!";

    let rel = await this.eduCalendarDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar not found!",
        {}
      );
    }

    const updateData = await this.eduCalendarDao.updateWhere(
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

  showEduCalendar = async (id) => {
    const message = "Edu Calendar successfully retrieved!";

    let rel = await this.eduCalendarDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showEduCalendarByOnGoingWeek = async (level, semester, academic) => {
    const message = "Edu Calendar successfully retrieved!";

    let rel = await this.eduCalendarDao.getByOngoingWeek(level, semester, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filter) {
    const totalRows = await this.eduCalendarDao.getCount(search, filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.eduCalendarDao.getEduCalendarPage(
      search,
      offset,
      limit,
      filter
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Edu Calendar successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteEduCalendar = async (id) => {
    const message = "Edu Calendar successfully deleted!";

    let rel = await this.eduCalendarDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = EduCalendarService;

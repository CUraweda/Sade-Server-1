const httpStatus = require("http-status");
const EduCalendarDetailDao = require("../dao/EduCalendarDetailDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");
const xlsx = require("xlsx");
const { start } = require("repl");

class EduCalendarDetailService {
  constructor() {
    this.eduCalendarDetailDao = new EduCalendarDetailDao();
  }

  addLocalOffset = (data) => {
    let { start_date, end_date, ...rest } = data;

    const adjustTimezone = (date) => {
        const d = new Date(date);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    };

    return {
      ...(start_date && { start_date: adjustTimezone(start_date) }),
      ...(end_date && { end_date: adjustTimezone(end_date) }),
        ...rest,
    };
  }

  createEduCalendarDetail = async (reqBody) => {
    try {
      let message = "Edu Calendar Detail successfully added.";

      reqBody = this.addLocalOffset(reqBody)
      let data = await this.eduCalendarDetailDao.create(reqBody);
      
      if (!data) {
        message = "Failed to create Edu Calendar Detail.";
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

  updateEduCalendarDetail = async (id, body) => {
    const message = "Edu Calendar Detail successfully updated!";
    
    let rel = await this.eduCalendarDetailDao.findById(id);
    
    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar Detail not found!",
        {}
      );
    }
    
    body = this.addLocalOffset(body)
    const updateData = await this.eduCalendarDetailDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showEduCalendarDetail = async (id) => {
    const message = "Edu Calendar Detail successfully retrieved!";

    let rel = await this.eduCalendarDetailDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar Detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showEduCalendarDetailByEduId = async (id, teacher_id, academic) => {
    const message = "Edu Calendar Detail successfully retrieved!";

    let rel = await this.eduCalendarDetailDao.getByEduId(id, teacher_id, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar Detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showEduCalendarDetailByTeacherId = async (id, academic) => {
    const message = "Edu Calendar Detail successfully retrieved!";

    let rel = await this.eduCalendarDetailDao.getByTeacherId(id, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar Detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filter) {
    const totalRows = await this.eduCalendarDetailDao.getCount(search, filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.eduCalendarDetailDao.getEduCalendarDetailPage(
      search,
      offset,
      limit,
      filter
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Edu Calendar Detail successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteEduCalendarDetail = async (id) => {
    const message = "Edu Calendar Detail successfully deleted!";

    let rel = await this.eduCalendarDetailDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Edu Calendar Detail not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Edu calendar detail successfully imported.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      // console.log(jsonData);
      let data = await this.eduCalendarDetailDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add edu calendar detail.";
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
}

module.exports = EduCalendarDetailService;

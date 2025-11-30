const httpStatus = require("http-status");
const WasteOfficerDao = require("../dao/WasteOfficerDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class ReligionService {
  constructor() {
    this.wasteOfficerDao = new WasteOfficerDao();
  }

  createWasteOfficer = async (reqBody) => {
    try {
      let message = "Waste officer successfully added.";

      let data = await this.wasteOfficerDao.create(reqBody);

      if (!data) {
        message = "Failed to create waste officer.";
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

  updateWasteOfficer = async (id, body) => {
    const message = "Waste officer successfully updated!";
  
    let rel = await this.wasteOfficerDao.findById(id);
  
    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.NOT_FOUND,
        "Waste officer not found!",
        {}
      );
    }
  
    const updateData = await this.wasteOfficerDao.updateWhere(body, { id });
  
    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  
    return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update waste officer.");
  };

  showWasteOfficersByDate = async (date,page, limit, search, offset) => {
  try {
    const totalRows = await this.wasteOfficerDao.getCountByDate(date);
    const totalPage = Math.ceil(totalRows / limit);
    const result = await this.wasteOfficerDao.findByAssignmentDate(date, page, limit, search, offset);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste officer successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  } catch (error) {
    return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};  

  showWasteOfficer = async (id) => {
    const message = "Waste officer successfully retrieved!";

    let rel = await this.wasteOfficerDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste officer not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, filter, offset) {
    const { date, iteration } = filter
    if (iteration && date) {
      let start_date = new Date(date)
      let end_date = new Date(date)
      switch (iteration) {
        case "week":
          const dayOfWeek = start_date.getDay();
          const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
          start_date.setDate(start_date.getDate() + diffToMonday);
          start_date.setHours(0, 0, 0, 0);
          end_date = new Date(start_date);
          end_date.setDate(start_date.getDate() + 6);
          end_date.setHours(23, 59, 59, 999);
          break;

        case "month":
          start_date.setDate(1);
          start_date.setHours(0, 0, 0, 0);
          end_date = new Date(start_date);
          end_date.setMonth(start_date.getMonth() + 1);
          end_date.setDate(0);
          end_date.setHours(23, 59, 59, 999);
          break;

        case "year":
          start_date.setMonth(0);
          start_date.setDate(1);
          start_date.setHours(0, 0, 0, 0);
          end_date = new Date(start_date);
          end_date.setFullYear(start_date.getFullYear() + 1);
          end_date.setDate(0); 
          end_date.setHours(23, 59, 59, 999);
          break
          
        default:
          start_date.setHours(0, 0, 0, 0);
          end_date.setHours(23, 59, 59, 999);
          break
      }
      filter.date = { start_date, end_date }
    }

    const totalRows = await this.wasteOfficerDao.getCount(filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.wasteOfficerDao.getWasteOfficerPage(
      filter,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste officer successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteWasteOfficer = async (id) => {
    const message = "Waste officer successfully deleted!";

    let rel = await this.wasteOfficerDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste officer not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ReligionService;

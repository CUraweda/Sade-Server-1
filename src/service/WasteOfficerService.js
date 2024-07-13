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

  showWasteOfficersByDate = async (date) => {
  try {
    const officers = await this.wasteOfficerDao.findByAssignmentDate(date);

    return responseHandler.returnSuccess(httpStatus.OK, "Waste officers retrieved successfully.", officers);
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

  async showPage(page, limit, search, offset) {
    const totalRows = await this.wasteOfficerDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.wasteOfficerDao.getWasteOfficerPage(
      search,
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

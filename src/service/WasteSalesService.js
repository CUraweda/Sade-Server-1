const httpStatus = require("http-status");
const WasteSalesDao = require("../dao/WasteSalesDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");

class WasteSalesService {
  constructor() {
    this.wasteSalesDao = new WasteSalesDao();
  }

  async getWasteSummary(wastetypeId, startDate, endDate, page, limit, search, offset) {
    // Get the paginated result
    const result = await this.wasteSalesDao.getWasteSummary(
      wastetypeId,
      startDate,
      endDate,
      offset,
      limit
    );

    // Count the total number of rows based on the returned result
    const totalRows = result.length;

    const totalPage = Math.ceil(totalRows / limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste summary successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }
}

module.exports = WasteSalesService;

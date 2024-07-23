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
  async getDetailChartData(wastetypeId, startDate, endDate) {
    const offset = 0;
    const limit = null; // No limit

    const results = await this.wasteSalesDao.getDetailChart(wastetypeId, startDate, endDate, offset, limit);

    // Transform data into chart format
    const chartData = results.map(item => ({
      date: item.collection_date,
      waste_type_id: item.id,
      weight: item.total_weight,
      price: item.total_price
    }));

    return chartData;
  }
  async getChartData(startDate, endDate) {
    return await this.wasteSalesDao.getChartData(startDate, endDate);
  }
  
}

module.exports = WasteSalesService;

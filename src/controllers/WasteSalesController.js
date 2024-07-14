const httpStatus = require("http-status")
const WasteSalesService = require("../service/WasteSalesService")
const logger = require("../config/logger")

class WasteSalesController {
    constructor() {
        this.wasteSalesService = new WasteSalesService
    }
    showWasteSummary = async (req, res) => {
      try {
        const wastetypeId = req.query.wastetype_id || null;
        const startDate = req.query.start_date || null;
        const endDate = req.query.end_date || null;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * page;
  
        const resData = await this.wasteSalesService.getWasteSummary(
          wastetypeId,
          startDate,
          endDate,
          page,
          limit,
          offset
        );
  
        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
}

module.exports = WasteSalesController
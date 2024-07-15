const moment = require("moment");
const StudentBillsService = require("../service/StudentBillsService");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const WasteCollectionService = require("../service/WasteCollectionService");

class DashboardController {
  constructor() {
    this.studentBillsService = new StudentBillsService();
    this.wasteCollectionService = new WasteCollectionService()
  }

  adminKeuangan = async (req, res) => {
    try {
      // time
      const now = new Date(),
        monthAgo = new Date();

      monthAgo.setDate(now.getDate() - 30);

      const thisMonth = await this.studentBillsService.getIncome({
        start_date: monthAgo,
        end_date: now,
      });
      const thisDay = await this.studentBillsService.getIncome({
        start_date: now,
      });
      const total = await this.studentBillsService.getIncome();

      return res.status(httpStatus.OK).send({
        income: {
          this_month: thisMonth,
          this_day: thisDay,
          total,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  adminTimbangan = async (req, res) => {
    try {
      // time
      const now = new Date(),
        monthAgo = new Date();

      monthAgo.setDate(now.getDate() - 30);

      const trashThisDay = await this.wasteCollectionService.getWasteCollectionByFilter(null, null, now);
      const trashThisMonth = await this.wasteCollectionService.getWasteCollectionByFilter(null, null, monthAgo, now)

      const totalSales = null;

      return res.status(httpStatus.OK).send({
        trash: {
          this_day: trashThisDay,
          this_month: trashThisMonth,
        },
        sales: {
          total: totalSales,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

module.exports = DashboardController;

const moment = require("moment");
const logger = require("../config/logger");
const httpStatus = require("http-status");
const StudentBillsService = require("../service/StudentBillsService");
const WasteCollectionService = require("../service/WasteCollectionService");
const WasteSalesService = require("../service/WasteSalesService");
const StudentArrearsService = require("../service/StudentArrearsService");
const StudentPaymentReportService = require("../service/StudentPaymentReportService");

class DashboardController {
  constructor() {
    this.studentBillsService = new StudentBillsService();
    this.studentArrearsService = new StudentArrearsService();
    this.studentPaymentReportService = new StudentPaymentReportService()
    this.wasteCollectionService = new WasteCollectionService();
    this.wasteSalesService = new WasteSalesService();
  }

  adminKeuangan = async (req, res) => {
    const {start_date, end_date, post_payment_id} = req.query

    try {
      // time
      const now = moment().toDate();

      // income
      const thisMonth = await this.studentBillsService.getIncome({
        start_date: moment(now).startOf('month').toDate(),
        end_date: now,
        post_payment_id
      });
      const thisDay = await this.studentBillsService.getIncome({
        start_date: now,
        post_payment_id
      });
      const total = await this.studentBillsService.getIncome({
        post_payment_id,
        start_date: moment(start_date).toDate(),
        end_date: moment(end_date).toDate()
      });

      // in arrears
      const inArrears = await this.studentArrearsService.showPage(0, 1, '', 0, '', { post_payment_id });
      const countInArrears = inArrears?.response?.data?.totalRows ?? 0;

      // lunas percentage
      const totalBills = await this.studentPaymentReportService.showPage(0, 1, '', 0, { post_payment_id })
      const totalLunasBills = await this.studentPaymentReportService.showPage(0, 1, '', 0, {status: 'lunas', post_payment_id})
      const percentageLunas = (totalLunasBills?.response?.data?.totalRows ?? 0) / (totalBills?.response?.data?.totalRows ?? 0) * 100
      
      // bills
      const recentBills = await this.studentBillsService.getRecentPaidOffBills(
        moment().subtract(7, "days").toDate(),
        7,
        post_payment_id
      );      

      return res.status(httpStatus.OK).send({
        income: {
          this_month: thisMonth,
          this_day: thisDay,
          total,
        },
        bills: {
          success_percentage: percentageLunas,
          in_arrears: countInArrears,
          recent_paidoff: recentBills,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  keuanganChart = async (req, res) => {
    try {
      const {start_date, end_date, post_payment_id} = req.query

      const chart = await this.studentBillsService.getIncomeGroupDate({start_date, end_date, post_payment_id})
      return res.status(httpStatus.OK).send(chart)
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);      
    }
  }

  adminTimbangan = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const nowDateOnly = formatDateToYYYYMMDD(now);
      const startOfMonthDateOnly = formatDateToYYYYMMDD(startOfMonth);
      const startOfDayDateOnly = formatDateToYYYYMMDD(startOfDay);

      const totalWeightToday = await this.wasteCollectionService.getTotalWeight(
        startOfDay,
        now
      );
      const totalWeightThisMonth =
        await this.wasteCollectionService.getTotalWeight(startOfMonth, now);

      const wasteSummaryResult = await this.wasteSalesService.getWasteSummary(
        null,
        startOfMonthDateOnly,
        nowDateOnly
      );

      let salesData = [];
      let totalSalesAmount = 0;
      if (
        wasteSummaryResult.response &&
        wasteSummaryResult.response.data &&
        wasteSummaryResult.response.data.result
      ) {
        salesData = wasteSummaryResult.response.data.result;
        totalSalesAmount = salesData.reduce(
          (sum, item) => sum + item.total_price,
          0
        );
      } else {
        console.log(
          "Waste summary result structure is not as expected:",
          wasteSummaryResult
        );
      }

      return res.status(httpStatus.OK).send({
        trash: {
          today: totalWeightToday,
          this_month: totalWeightThisMonth,
        },
        sales: {
          total: totalSalesAmount,
          details: salesData,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  getDetailChartData = async (req, res) => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const formattedNow = formatDateToYYYYMMDD(now);
      const formattedOneMonthAgo = formatDateToYYYYMMDD(oneMonthAgo);

      const { waste_type_id, start_date, end_date, class_id } = req.query;

      // Use provided dates or defaults
      const startDate = start_date ? start_date : formattedOneMonthAgo;
      const endDate = end_date ? end_date : formattedNow;

      const chartData = await this.wasteSalesService.getDetailChartData(
        waste_type_id,
        startDate,
        endDate,
        class_id
      );

      return res.status(httpStatus.OK).send(chartData);
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  getChartData = async (req, res) => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const formattedNow = formatDateToYYYYMMDD(now);
      const formattedOneMonthAgo = formatDateToYYYYMMDD(oneMonthAgo);

      const { start_date, end_date, class_id } = req.query;

      const startDate = start_date ? start_date : formattedOneMonthAgo;
      const endDate = end_date ? end_date : formattedNow;

      const chartData = await this.wasteSalesService.getChartData(
        startDate,
        endDate,
        class_id
      );

      return res.status(httpStatus.OK).send(chartData);
    } catch (error) {
      logger.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

module.exports = DashboardController;

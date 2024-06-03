const httpStatus = require("http-status");
const MonthlyDao = require("../dao/MonthlyDao");
const StudentClassDao = require("../dao/StudentClassDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");
const InvoiceService = require("./InvoiceService");
const TransactionJournalService = require("./TransactionJournalService");

const dir = "./files/invoices/";

class MonthlyService {
  constructor() {
    this.monthlyDao = new MonthlyDao();
    this.studentClassDao = new StudentClassDao();
    this.invoiceService = new InvoiceService();
    this.transactionJournalService = new TransactionJournalService();
  }

  createMonthly = async (reqBody) => {
    try {
      let message = "Monthly successfully added.";

      let data = await this.monthlyDao.create(reqBody);

      if (!data) {
        message = "Failed to create monthly.";
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

  generateMonthlyByClass = async (reqBody) => {
    try {
      let message = "Monthly billing successfully generated.";

      let jsonArr = [];
      // info bugs ketika menggunakan await jangan menggunakan .then, karena hasilnya hanya akan menampilkan data terakhir saja yaitu bulan 12
      const results = await this.studentClassDao.getByClasses(reqBody);

      results.forEach((result) => {
        for (let i = 0; i < 12; i++) {
          const jsonObj = {
            student_class_id: result.id,
            month_id: i + 1,
            payment_category_id: reqBody.payment_category_id,
            academic_year: reqBody.academic_year,
            bill_amount: reqBody.bill_amount,
            payment_status: "Unpaid",
          };
          jsonArr.push(jsonObj);
        }
      });

      if (!jsonArr) {
        message = "No data exist.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      const data = await this.monthlyDao.bulkCreate(jsonArr);

      if (!data) {
        message = "Failed to create monthly billing.";
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

  updateMonthly = async (id) => {
    const message = "Monthly billing successfully updated!";

    let data = await this.monthlyDao.getMonthlyById(id);

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Monthly billing not found!",
        {}
      );
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const invoiceNo = await this.invoiceService.getInvoiceNo();

    const invoicePath = dir + invoiceNo + ".pdf";

    const updateData = await this.monthlyDao.updateWhere(
      {
        payment_status: "Paid",
        payment_date: Date.now(),
        invoice: invoicePath,
      },
      { id }
    );

    const jsonStr = data[0].toJSON();

    jsonStr["invoice_no"] = invoiceNo;
    jsonStr["desc"] =
      jsonStr.paymentcategory.paymentpost.desc +
      " " +
      jsonStr.month.name +
      " T.A " +
      jsonStr.academic_year;
    this.invoiceService.createInvoice(jsonStr, invoicePath);

    const journalBody = {
      financial_post_id: 1, //pemasukan dari spp bulanan
      student_class_id: jsonStr.student_class_id,
      operator_id: 1,
      ref_no: jsonStr.invoice_no,
      desc:
        jsonStr.paymentcategory.paymentpost.desc +
        " " +
        jsonStr.month.name +
        " T.A " +
        jsonStr.academic_year,
      amount: jsonStr.bill_amount,
    };

    this.transactionJournalService.createTransactionJournal(journalBody);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, jsonStr);
    }
  };

  showMonthly = async (id) => {
    const message = "Monthly billing successfully retrieved!";

    let rel = await this.monthlyDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Monthly billing not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showMonthlyByStudent = async (id) => {
    const message = "Monthly billing successfully retrieved!";

    let rel = await this.monthlyDao.getMonthlyByStudent(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Monthly billing not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.monthlyDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.monthlyDao.getMonthlyPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Monthly successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteMonthly = async (id) => {
    const message = "Monthly successfully deleted!";

    let rel = await this.monthlyDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Monthly not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = MonthlyService;

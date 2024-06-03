const httpStatus = require("http-status");
const NonMonthlyDao = require("../dao/NonMonthlyDao");
const StudentClassDao = require("../dao/StudentClassDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");
const InvoiceService = require("./InvoiceService");
const TransactionJournalService = require("./TransactionJournalService");

const dir = "./files/invoices/";

class NonMonthlyService {
  constructor() {
    this.nonMonthlyDao = new NonMonthlyDao();
    this.studentClassDao = new StudentClassDao();
    this.invoiceService = new InvoiceService();
    this.transactionJournalService = new TransactionJournalService();
  }

  createNonMonthly = async (reqBody) => {
    try {
      let message = "Non monthly successfully added.";

      let data = await this.nonMonthlyDao.create(reqBody);

      if (!data) {
        message = "Failed to create non monthly.";
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

  generateNonMonthlyByClass = async (reqBody) => {
    try {
      let message = "Non monthly billing successfully generated.";

      let jsonArr = [];
      // info bugs ketika menggunakan await jangan menggunakan .then, karena hasilnya hanya akan menampilkan data terakhir saja yaitu bulan 12
      const results = await this.studentClassDao.getByClasses(reqBody);

      results.forEach((result) => {
        const jsonObj = {
          student_class_id: result.id,
          payment_category_id: reqBody.payment_category_id,
          academic_year: reqBody.academic_year,
          bill_amount: reqBody.bill_amount,
          payment_status: "Unpaid",
        };
        jsonArr.push(jsonObj);
      });

      if (!jsonArr) {
        message = "No data exist.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      const data = await this.nonMonthlyDao.bulkCreate(jsonArr);

      if (!data) {
        message = "Failed to create non monthly billing.";
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

  updateNonMonthly = async (id) => {
    const message = "Non monthly billing successfully updated!";

    let data = await this.nonMonthlyDao.getNonMonthlyById(id);

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Non monthly billing not found!",
        {}
      );
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const invoiceNo = await this.invoiceService.getInvoiceNo();

    const invoicePath = dir + invoiceNo + ".pdf";

    const updateData = await this.nonMonthlyDao.updateWhere(
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
      " T.A " +
      jsonStr.academic_year;
    this.invoiceService.createInvoice(jsonStr, invoicePath);

    const journalBody = {
      financial_post_id: 1, //pemasukan dari iuran siswa
      student_class_id: jsonStr.student_class_id,
      operator_id: 1,
      ref_no: jsonStr.invoice_no,
      desc:
        jsonStr.paymentcategory.paymentpost.desc +
        " " +
        " T.A " +
        jsonStr.academic_year,
      amount: jsonStr.bill_amount,
    };

    this.transactionJournalService.createTransactionJournal(journalBody);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, jsonStr);
    }
  };

  showNonMonthly = async (id) => {
    const message = "Non monthly billing successfully retrieved!";

    let rel = await this.nonMonthlyDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Non monthly billing not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showNonMonthlyByStudent = async (id) => {
    const message = "Non monthly billing successfully retrieved!";

    let rel = await this.nonMonthlyDao.getNonMonthlyByStudent(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Non monthly billing not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.nonMonthlyDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.nonMonthlyDao.getNonMonthlyPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Non monthly successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNonMonthly = async (id) => {
    const message = "Non monthly successfully deleted!";

    let rel = await this.nonMonthlyDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Non monthly not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = NonMonthlyService;

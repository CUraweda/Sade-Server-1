const httpStatus = require("http-status")
const StudentArrearsDao = require("../dao/StudentArrearsDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")
const moment = require("moment")
const xlsx = require("xlsx")

class StudentArrearsService {
  constructor() {
    this.studentArrearsDao = new StudentArrearsDao()
  }
  showStudentArrearsById = async (id) => {
    const message = "Student Arrears successfully retrieved!";

    let rel = await this.studentArrearsDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Arrears not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
  showStudentArrearsByStudentId = async (id) => {
    const message = "Student Arrears successfully retrieved!";

    let cl = await this.studentArrearsDao.getByStudentId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Arrears not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
  showStudentArrearsByClassId = async (id) => {
    const message = "Student Arrears successfully retrieved!";

    let cl = await this.studentArrearsDao.getByClassId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Arrears not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
  
  async showPage(page, limit, search, offset, classId, filters) {
    const totalRows = await this.studentArrearsDao.getCount(search, classId, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentArrearsDao.getStudentBillsPage(
      search,
      offset,
      limit,
      classId,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student Arrears successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  async getReportBill() {
    const result = await this.studentArrearsDao.getReport()
    if (!result) return responseHandler.returnSuccess(httpStatus.OK, "Student Arrears not found!", {});
    return responseHandler.returnSuccess(httpStatus.OK, "Recap successfully received", result);
  }

  async exportPage(search, classId) {
    const result = await this.studentArrearsDao.getStudentBillsPage(search, undefined, undefined, classId)

    const sheetData = result.map((dat, i) => ({
      "No": i + 1,
      "Name": dat.student?.full_name ?? "",
      "NIS": dat.student?.nis ?? "",
      "Pembayaran": dat.studentpaymentbill?.name ?? "",
      "POS": dat.studentpaymentbill?.paymentpost?.name ?? "",
      "Tipe": dat.studentpaymentbill?.paymentpost?.billing_cycle ?? "",
      "Status": dat.status.toUpperCase(),
      "Jatuh Tempo": dat.studentpaymentbill.due_date ? moment(dat.studentpaymentbill.due_date).format("YYYY-MM-DD") : ""
    }));

    const worksheet = xlsx.utils.json_to_sheet(sheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Daftar Tunggakan Pembayaran');

    return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  }
}

module.exports = StudentArrearsService
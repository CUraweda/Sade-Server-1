const httpStatus = require("http-status")
const StudentPaymentReportDao = require("../dao/StudentPaymentReportDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")

class StudentPaymentReportService {
    constructor() {
        this.studentPaymentReportDao = new StudentPaymentReportDao()
    }
    showStudentPaymentReportById = async (id) => {
      const message = "Student Payment Report successfully retrieved!";
  
      let rel = await this.studentPaymentReportDao.getById(id);
  
      if (!rel) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Payment Report not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
    showStudentPaymentReportByStudentId = async (id) => {
      const message = "Student Payment Report successfully retrieved!";
  
      let cl = await this.studentPaymentReportDao.getByStudentId(id);
  
      if (!cl) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Payment Report not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };
    showStudentPaymentReportByClassId = async (id) => {
      const message = "Student Payment Report successfully retrieved!";
  
      let cl = await this.studentPaymentReportDao.getByClassId(id);
  
      if (!cl) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Payment Report not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };
    showStudentPaymentReportByFilter = async (classes, student, start_date, end_date, payment_category, status) => {
      const message = "Student Payment Report successfully retrieved!";
  
      let cl = await this.studentPaymentReportDao.getByFilter(classes, student, start_date, end_date, payment_category, status);
      
      if (!cl) {
          return responseHandler.returnSuccess(
              httpStatus.OK,
              "Student Payment Report not found!",
              {}
          );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    async showPage(page, limit, search, offset, filters) {
        const totalRows = await this.studentPaymentReportDao.getCount(search, filters);
        const totalPage = Math.ceil(totalRows / limit);
    
        const result = await this.studentPaymentReportDao.getStudentBillsPage(
          search,
          offset,
          limit,
          filters
        );
    
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Payment Report successfully retrieved.",
          {
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          }
        );
    }
    async exportPage(search, offset, limit) {
      const filePath = await this.studentPaymentReportDao.exportToExcel(search, offset, limit);
      return filePath;
    }
}

module.exports = StudentPaymentReportService
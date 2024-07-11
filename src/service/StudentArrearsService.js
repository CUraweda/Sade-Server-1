const httpStatus = require("http-status")
const StudentArrearsDao = require("../dao/StudentArrearsDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")

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

    async showPage(page, limit, search, offset) {
        const totalRows = await this.studentArrearsDao.getCount(search);
        const totalPage = Math.ceil(totalRows / limit);
    
        const result = await this.studentArrearsDao.getStudentBillsPage(
          search,
          offset,
          limit
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
    async exportPage(search, offset, limit) {
      const filePath = await this.studentArrearsDao.exportToExcel(search, offset, limit);
      return filePath;
    }
}

module.exports = StudentArrearsService
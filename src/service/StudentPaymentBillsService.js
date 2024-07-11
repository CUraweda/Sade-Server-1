const httpStatus = require("http-status")
const StudentPaymentBillsDao = require("../dao/StudentPaymentBillsDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")
const { userConstant } = require("../config/constant");
const { http } = require("winston");

class StudentPaymentBillsService {
    constructor() {
        this.studentPaymentBillsDao = new StudentPaymentBillsDao()
    }

    createStudentPaymentBills = async (reqBody) => {
        try {
            let message = "Student Payment Bills successfully added."
            let data = await this.studentPaymentBillsDao.create(reqBody);

            if (!data) {
                message = "Failed to create payment bills"
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message)
            }
            return responseHandler.returnSuccess(httpStatus.CREATED, message, data)
        } catch (e) {
            logger.error(e)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Something went wrong!"
            )
        }
    }
    showStudentPaymentBillsByStudentId = async (id) => {
        const message = "Student Payment Bills successfully retrieved!";
    
        let cl = await this.studentPaymentBillsDao.getByStudentId(id);
    
        if (!cl) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Payment Bills not found!",
            {}
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };
    showStudentPaymentBillsById = async (id) => {
      const message = "Student Payment Bills successfully retrieved!";
  
      let rel = await this.studentPaymentBillsDao.findOneByWhere({id});
  
      if (!rel) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Payment Bill not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    showStudentPaymentBillsByClass = async (class_id) => {
        const message = "Student Payment Bills successfully retrieved!";
    
        let rel = await this.studentPaymentBillsDao.findByClass(class_id);
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Payment Bill not found!",
            {}
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
      };

    updateStudentPaymentBills = async (id ,body) => {
        const message = "Student Payment Bills successfully updated";

        let rel = await this.studentPaymentBillsDao.findById(id)

        if(!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Student Payment Bills not found!",
                {}
            )
        }
        const updateData = await this.studentPaymentBillsDao.updateById(body, id)
        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {})
        }
    }
    async showPage(page, limit, search, offset) {
      const totalRows = await this.studentPaymentBillsDao.getCount(search);
      const totalPage = Math.ceil(totalRows / limit);
  
      const result = await this.studentPaymentBillsDao.getStudentPaymentBillsPage(
        search,
        offset,
        limit
      );
  
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Payment Bills successfully retrieved.",
        {
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        }
      );
    }
    deleteStudentPaymentBills = async (id) => {
        const message = "Student Payment Bills successfully deleted!";
    
        let rel = await this.studentPaymentBillsDao.deleteByWhere({ id });
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Payment Bills not found!"
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = StudentPaymentBillsService;
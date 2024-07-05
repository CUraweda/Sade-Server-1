const httpStatus = require("http-status")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")
const StudentPaymentCategoryDao = require("../dao/StudentPaymentCategoryDao")

class StudentPaymentCategoryService {
    constructor() {
        this.studentpaymentcategory = new StudentPaymentCategoryDao()
    }
    createStudentPaymentCategory = async (reqBody) => {
        try {
            let message = "Student Payment Category successfully added."
            let data = await this.studentpaymentcategory.create(reqBody);

            if (!data) {
                message = "Failed to create payment student category"
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
    updatePaymentStudentCategory = async (id ,body) => {
        const message = "Student Payment Category successfully updated";

        let rel = await this.studentpaymentcategory.findById(id)

        if(!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Student Payment Category not found!",
                {}
            )
        }
        const updateData = await this.studentpaymentcategory.updateById(body, id)
        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {})
        }
    }
    async showPage(page, limit, search, offset) {
      const totalRows = await this.studentpaymentcategory.getCount(search);
      const totalPage = Math.ceil(totalRows / limit);
  
      const result = await this.studentpaymentcategory.getStudentPaymentCategoryPage(
        search,
        offset,
        limit
      );
  
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Payment Category successfully retrieved.",
        {
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        }
      );
    }
    deleteStudentPaymentCategory = async (id) => {
        const message = "Student Payment Category successfully deleted!";
    
        let rel = await this.studentpaymentcategory.deleteByWhere({ id });
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Payment Category not found!"
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
      };
}
module.exports = StudentPaymentCategoryService
const httpStatus = require("http-status")
const StudentPaymentPostDao = require("../dao/StudentPaymentPostDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")

class StudentPaymentPostService {
    constructor() {
        this.studentpaymentpostdao = new StudentPaymentPostDao()
    }
    createStudentPaymentPost = async (reqBody) => {
        try {
            let message = "Student Payment Post successfully added."
            let data = await this.studentpaymentpostdao.create(reqBody);

            if (!data) {
                message = "Failed to create payment student post"
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
    updatePaymentStudentPost = async (id ,body) => {
        const message = "Student Payment Post successfully updated";

        let rel = await this.studentpaymentpostdao.findById(id)

        if(!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Student Payment Post not found!",
                {}
            )
        }
        const updateData = await this.studentpaymentpostdao.updateById(body, id)
        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {})
        }
    }
    async showPage(page, limit, search, offset) {
      const totalRows = await this.studentpaymentpostdao.getCount(search);
      const totalPage = Math.ceil(totalRows / limit);
  
      const result = await this.studentpaymentpostdao.getStudentPaymentPostPage(
        search,
        offset,
        limit
      );
  
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Payment Post successfully retrieved.",
        {
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        }
      );
    }
    deleteStudentPaymentPost = async (id) => {
        const message = "Student Payment Post successfully deleted!";
    
        let rel = await this.studentpaymentpostdao.deleteByWhere({ id });
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Payment Post not found!"
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
      };
}
module.exports = StudentPaymentPostService
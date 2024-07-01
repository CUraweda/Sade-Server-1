const httpStatus = require("http-status")
const StudentDataDao = require("../dao/StudentDataDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")
const { userConstant } = require("../config/constant");
const { http } = require("winston");

class StudenDataService {
    constructor() {
        this.studentDataDao = new StudentDataDao()
    }

    createStudentData = async (reqBody) => {
        try {
            let message = "Student Data successfully added."
            let data = await this.studentDataDao.create(reqBody);

            if (!data) {
                message = "Failed to create student data"
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
    showStudentDataByStudentId = async (id) => {
        const message = "Student Data successfully retrieved!";
    
        let cl = await this.studentDataDao.getByStudentId(id);
    
        if (!cl) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Data not found!",
            {}
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    showStudentDataByClass = async (classes) => {
        const message = "Student Data successfully retrieved!";
    
        let rel = await this.studentDataDao.findByClass(classes);
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Data not found!",
            {}
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
      };

    updateStudentData = async (id ,body) => {
        const message = "Student Data successfully updated";

        let rel = await this.studentDataDao.findById(id)

        if(!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Student Data not found!",
                {}
            )
        }
        const updateData = await this.studentDataDao.updateById(body, id)
        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {})
        }
    }
    async showPage(page, limit, search, offset) {
      const totalRows = await this.studentDataDao.getCount(search);
      const totalPage = Math.ceil(totalRows / limit);
  
      const result = await this.studentDataDao.getStudentDataPage(
        search,
        offset,
        limit
      );
  
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Data successfully retrieved.",
        {
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        }
      );
    }
    deleteStudentData = async (id) => {
        const message = "Student Data successfully deleted!";
    
        let rel = await this.studentDataDao.deleteByWhere({ id });
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Data not found!"
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
      };
}

module.exports = StudenDataService;
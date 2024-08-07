const httpStatus = require("http-status")
const StudentPaymentCategoryService = require("../service/StudentPaymentCategoryService")
const logger = require("../config/logger")

class StudentPaymentCategoryController {
    constructor() {
        this.studentPaymentCategoryService = new StudentPaymentCategoryService()
    }
    create = async (req, res) => {
        try {
            const resData = await this.studentPaymentCategoryService.createStudentPaymentCategory(req.body)
            res.status(resData.statusCode).send(resData.response)
        } catch (e) {
            logger.error(e)
            res.status(httpStatus.BAD_GATEWAY).send(e)            
        }
    }
    update = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData =
            await this.studentPaymentCategoryService.updatePaymentStudentCategory(
              id,
              req.body
            );
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    showAll = async (req, res) => {
        try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search_query || "";
        const offset = limit * page;

        const resData = await this.studentPaymentCategoryService.showPage(
            page,
            limit,
            search,
            offset
        );

        res.status(resData.statusCode).send(resData.response);
        } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    showById = async (req, res) => {
      try {
        var id = req.params.id;
  
        const resData = await this.studentPaymentCategoryService.showStudentPaymentCategoryById(
          id
        );
  
        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
    delete = async (req, res) => {
        try {
          var id = req.params.id;
          
          const resData =
            await this.studentPaymentCategoryService.deleteStudentPaymentCategory(id);
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}
module.exports = StudentPaymentCategoryController
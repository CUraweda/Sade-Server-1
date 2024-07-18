const httpStatus = require("http-status")
const StudentPaymentBillsService = require("../service/StudentPaymentBillsService")
const logger = require("../config/logger")

class StudentPaymentBillsController {
    constructor() {
        this.studentPaymentBillsService = new StudentPaymentBillsService()
    }

    create = async (req, res) => {
        try {
            const resData = await this.studentPaymentBillsService.createStudentPaymentBills(req.body)
            res.status(resData.statusCode).send(resData.response)
        } catch (e) {
            logger.error(e)
            res.status(httpStatus.BAD_GATEWAY).send(e)            
        }
    }
    bulkCreate = async (req, res) => {
      try {
          const resData = await this.studentPaymentBillsService.bulkCreateStudentPaymentBills(req.body)
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
            await this.studentPaymentBillsService.updateStudentPaymentBills(
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

        const resData = await this.studentPaymentBillsService.showPage(
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
  
        const resData = await this.studentPaymentBillsService.showStudentPaymentBillsById(
          id
        );
  
        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };

    showByStudentId = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData = await this.studentPaymentBillsService.showStudentPaymentBillsByStudentId(
            id
          );
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    showByClass = async (req, res) => {
        try {
          var class_id = req.params.class_id;
    
          const resData =
            await this.studentPaymentBillsService.showStudentPaymentBillsByClass(
              class_id
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
            await this.studentPaymentBillsService.deleteStudentPaymentBills(id);
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = StudentPaymentBillsController
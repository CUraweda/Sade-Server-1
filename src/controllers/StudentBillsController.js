const httpStatus = require("http-status")
const StudentBillsService = require("../service/StudentBillsService")
const logger = require("../config/logger")
const uploadPaymentEvidence = require("../middlewares/uploadPaymentEvidence")

class StudentBillsController {
    constructor() {
        this.studentBillsService = new StudentBillsService()
    }

    create = async (req, res) => {
        try {
            const resData = await this.studentBillsService.createStudentBills(req.body)
            res.status(resData.statusCode).send(resData.response)
        } catch (e) {
            logger.error(e)
            res.status(httpStatus.BAD_GATEWAY).send(e)            
        }
    }

    bulkCreate = async (req, res) => {
        try {
            const resData = await this.studentBillsService.bulkCreateStudentBills(req.body)
            res.status(resData.statusCode).send(resData.response)
        } catch (e) {
            logger.error(e)
            res.status(httpStatus.BAD_GATEWAY).send(e)            
        }
    }

    upEvidence = async (req, res) => {
      try {
        await uploadPaymentEvidence(req, res)
        
        const ids = req.params.ids?.split('-')
        const body = { evidence_path: req.file?.path ?? null };

				const resData = await this.studentBillsService.upEvidenceStudentBills(ids, body);
				res.status(resData.statusCode).send(resData.response);
			} catch (e) {
				logger.error(e);
				res.status(httpStatus.BAD_GATEWAY).send(e);
			}
    } 

    update = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData =
            await this.studentBillsService.updateStudentBills(
              id,
              req.body
            );
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    confirmEvidence = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData =
            await this.studentBillsService.updateStudentBills(
              id,
              { status: 'Lunas' }
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
        const billId = req.query.bill_id || ""
        const classId = req.query.class_id || ""

        const resData = await this.studentBillsService.showPage(
            page,
            limit,
            search,
            offset,
            billId,
            classId
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
    
          const resData = await this.studentBillsService.showStudentBillsById(
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
    
          const resData = await this.studentBillsService.showStudentBillsByStudentId(
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
            await this.studentBillsService.deleteStudentBills(id);
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = StudentBillsController
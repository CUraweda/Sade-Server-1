const httpStatus = require("http-status")
const StudentPaymentReportService = require("../service/StudentPaymentReportService")
const logger = require("../config/logger")
const fs = require('fs-extra');

class StudentPaymentReportController {
    constructor() {
        this.studentPaymentReportService = new StudentPaymentReportService
    }
    showById = async (req, res) => {
      try {
        var id = req.params.id;
  
        const resData = await this.studentPaymentReportService.showStudentPaymentReportById(
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
  
        const resData = await this.studentPaymentReportService.showStudentPaymentReportByStudentId(
          id
        );
  
        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
    showByClassId = async (req, res) => {
      try {
        var id = req.params.id;
  
        const resData = await this.studentPaymentReportService.showStudentPaymentReportByClassId(
          id
        );
  
        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
    showByFilter = async (req, res) => {
      try {
          const { classes, student, start_date, end_date, payment_category, status, nis_prefix } = req.query;
  
          const resData = await this.studentPaymentReportService.showStudentPaymentReportByFilter(
              classes, student, start_date, end_date, payment_category, status, nis_prefix
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
        const { payment_category_id, class_id, student_id, start_paid, end_paid, status, nis_prefix } = req.query;

        const resData = await this.studentPaymentReportService.showPage(
            page,
            limit,
            search,
            offset,
            {
              payment_category_id,
              class_id,
              student_id,
              start_paid,
              end_paid,
              status,
              nis_prefix
            }
        );

        res.status(resData.statusCode).send(resData.response);
        } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    exportAll = async (req, res) => {
      try {
          const search = req.query.search_query || "";
          const { payment_category_id, class_id, student_id, start_paid, end_paid, status, nis_prefix } = req.query;
  
          const buffer = await this.studentPaymentReportService.exportPage(
            search, 
            {
              payment_category_id,
              class_id,
              student_id,
              start_paid,
              end_paid,
              status,
              nis_prefix
            }
          );

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=laporan.xlsx');

          res.status(httpStatus.OK).send(buffer);
      } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
}

module.exports = StudentPaymentReportController 
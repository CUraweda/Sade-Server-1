const httpStatus = require("http-status")
const StudentArrearsService = require("../service/StudentArrearsService")
const logger = require("../config/logger")
const fs = require('fs-extra');

class StudentArrearsController {
    constructor() {
        this.studentArrearsService = new StudentArrearsService
    }
    showById = async (req, res) => {
      try {
        var id = req.params.id;
  
        const resData = await this.studentArrearsService.showStudentArrearsById(
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
  
        const resData = await this.studentArrearsService.showStudentArrearsByStudentId(
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
  
        const resData = await this.studentArrearsService.showStudentArrearsByClassId(
          id
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
        const classId = req.query.class_id || ""

        const resData = await this.studentArrearsService.showPage(
            page,
            limit,
            search,
            offset,
            classId
        );

        res.status(resData.statusCode).send(resData.response);
      } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
    
    showReport = async (req, res) => {
      try{
        const resData = await this.studentArrearsService.getReportBill()
        res.status(resData.statusCode).send(resData.response);
      }catch(e){
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    }
    exportAll = async (req, res) => {
      try {
          const search = req.query.search_query || "";
          const classId = req.query.class_id || "";
  
          const buffer = await this.studentArrearsService.exportPage(
            search, 
            classId
          );

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=Daftar Tunggakan Pembayaran Siswa.xlsx');

          res.status(httpStatus.OK).send(buffer);
      } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
}

module.exports = StudentArrearsController
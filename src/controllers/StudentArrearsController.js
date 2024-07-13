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
    exportAll = async (req, res) => {
      try {
          const search = req.query.search_query || "";
          const limit = parseInt(req.query.limit) || 10;
          const offset = parseInt(req.query.offset) || 0;
  
          const filePath = await this.studentArrearsService.exportPage(search, offset, limit);
  
          res.download(filePath, 'daftar_tunggakan.xlsx', (err) => {
              if (err) {
                  console.error('Error downloading the file:', err);
                  res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error downloading the file');
              } else {
                  // Clean up the file after download
                  fs.unlink(filePath, (unlinkErr) => {
                      if (unlinkErr) console.error('Error deleting the file:', unlinkErr);
                  });
              }
          });
      } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
      }
    };
}

module.exports = StudentArrearsController
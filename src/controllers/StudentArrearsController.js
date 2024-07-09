const httpStatus = require("http-status")
const StudentArrearsService = require("../service/StudentArrearsService")
const logger = require("../config/logger")

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

        const resData = await this.studentArrearsService.showPage(
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
    exportAll = async (req, res) => {
        try {
            const search = req.query.search_query || "";
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;

            const filePath = await this.studentArrearsService.exportPage(search, offset, limit);

            res.download(filePath, 'arrears_data.xlsx', (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error downloading the file');
                }
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = StudentArrearsController
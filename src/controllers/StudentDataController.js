const httpStatus = require("http-status")
const StudenDataService = require("../service/StudentDataService")
const logger = require("../config/logger")

class StudentDataController {
    constructor() {
        this.studentDataService = new StudenDataService()
    }

    create = async (req, res) => {
        try {
            const resData = await this.studentDataService.createStudentData(req.body)
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
            await this.studentDataService.updateStudentData(
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

        const resData = await this.studentDataService.showPage(
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

    showByStudentId = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData = await this.studentDataService.showStudentDataByStudentId(
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
          var classes = req.params.class;
    
          const resData =
            await this.studentDataService.showStudentDataByClass(
              classes
            );
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
      };
    
  
    async showPage(page, limit, search, offset) {
        const totalRows = await this.studentPersonalityDao.getCount(search);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.studentPersonalityDao.getStudentPersonalityPage(
        search,
        offset,
        limit
        );

        return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Personality successfully retrieved.",
        {
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
        }
        );
    }

    delete = async (req, res) => {
        try {
          var id = req.params.id;
    
          const resData =
            await this.studentDataService.deleteStudentData(id);
    
          res.status(resData.statusCode).send(resData.response);
        } catch (e) {
          logger.error(e);
          res.status(httpStatus.BAD_GATEWAY).send(e);
        }
      };
}

module.exports = StudentDataController
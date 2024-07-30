const httpStatus = require("http-status");
const StudentClassService = require("../service/StudentClassService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class StudentClassController {
  constructor() {
    this.studentClassService = new StudentClassService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.studentClassService.createStudentClass(
        req.body
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentClassService.updateStudentClass(
        id,
        req.body
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentClassService.showStudentClass(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  
  showByStudent = async (req, res) => {
    try {
      const id = req.params.id;
      const resData = await this.studentClassService.showClassByStudent(id);
      res.status(resData.statusCode).send(resData.response);
    } catch (err) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  showByClass = async (req, res) => {
    try {
      const id = req.params.id;
      const academic = req.query.academic || "";

      const resData = await this.studentClassService.showStudentByClass(
        id,
        academic
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
      const classId = req.query.class_id || "";
      const academicYear = req.query.academic || "";
      const offset = limit * page;

      const resData = await this.studentClassService.showPage(
        page,
        limit,
        search,
        offset,
        classId,
        academicYear
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

      const resData = await this.studentClassService.deleteStudentClass(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showLevel = async (req, res) => {
    try {
      const level = req.params.level;
      const academic = req.query.academic || '';

      const resData = await this.studentClassService.showStudentClassByLevel(
        level,
        academic
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.studentClassService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = StudentClassController;

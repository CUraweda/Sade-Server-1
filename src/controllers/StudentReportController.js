const httpStatus = require("http-status");
const StudentReportService = require("../service/StudentReportService");
const logger = require("../config/logger");

class StudentReportController {
  constructor() {
    this.studentReportService = new StudentReportService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.studentReportService.createStudentReport(
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

      const resData = await this.studentReportService.updateStudentReport(
        id,
        req.body
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  updateAccess = async (req, res) => {
    try {
			var id = req.params.id;

			const resData = await this.studentReportService.updateStudentReportAccess(id);

			res.status(resData.statusCode).send(resData.response);
		} catch (e) {
			logger.error(e);
			res.status(httpStatus.BAD_GATEWAY).send(e);
		}
  }

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentReportService.showStudentReport(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClassId = async (req, res) => {
    try {
      const id = req.params.id;
      const student_access = req.query.student_access || undefined

      const resData =
        await this.studentReportService.showStudentReportByClassId(id, student_access);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentId = async (req, res) => {
    try {
      const id = req.query.id || 0;
      const semester = req.query.semester || 0;

      const resData =
        await this.studentReportService.showStudentReportByStudentId(
          id,
          semester
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentIdDetails = async (req, res) => {
    try {
      const id = req.query.id || 0;
      const semester = req.query.semester || 0;

      const resData =
        await this.studentReportService.showStudentReportByStudentIdDetails(
          id,
          semester
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

      const resData = await this.studentReportService.showPage(
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

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentReportService.deleteStudentReport(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  merge = async (req, res) => {
    var id = req.params.id;

    try {
      const resData = await this.studentReportService.mergeReports(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  exportData = async (req, res) => {
    try {
      // var id = req.params.id;
      // const semester = req.query.semester;

      const resData = await this.studentReportService.generatePdf("", "");
      res.status(200).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  filtered = async (req, res) => {
    try {
      const academic = req.query.academic || "";
      const semester = req.query.semester || "";
      const classId = req.query.class_id || "";

      const resData = await this.studentReportService.filteredStudentReport(
        academic,
        semester,
        classId
      );
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = StudentReportController;

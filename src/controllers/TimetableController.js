const httpStatus = require("http-status");
const TimetableService = require("../service/TimetableService");
const logger = require("../config/logger");
const ClassesService = require("../service/ClassesService");

class TimetableController {
  constructor() {
    this.timetableService = new TimetableService();
    this.classService = new ClassesService()
  }

  create = async (req, res) => {
    try {
      const resData = await this.timetableService.createTimetable(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.timetableService.updateTimetable(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.timetableService.showTimetable(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClassId = async (req, res) => {
    try {
      var id = req.params.id;
      const semester = req.query.semester;
      const academic = req.query.academic;

      const resData = await this.timetableService.showTimetableByClassId(
        id,
        semester,
        academic
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClass = async (req, res) => {
    try {
      var { employee } = req.user;
      const { class_id, semester, academic, with_assign } = req.query

      let class_ids = []
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(0, undefined, { search: "", employee_id: employee.id }, 0)
        class_ids = empClasses.response?.data?.result?.map(c => c.id ?? "").filter(c => c != "") ?? []
      }

      const resData = await this.timetableService.showTimetableByClass({
        class_id,
        semester,
        academic,
        class_ids
      });

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  showAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      const resData = await this.timetableService.showPage(
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

      const resData = await this.timetableService.deleteTimetable(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = TimetableController;

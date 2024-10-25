const httpStatus = require("http-status");
const FormSubjectService = require("../service/FormSubjectService");
const logger = require("../config/logger");

class FormSubjectController {
  constructor() {
    this.FormSubjectService = new FormSubjectService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.FormSubjectService.createFormSubject(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;
      const resData = await this.FormSubjectService.updateFormSubject(
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

      const resData = await this.FormSubjectService.showFormSubject(id);

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
      const academic_year = req.query.academic_year 
      const is_active = req.query.is_active 
      const offset = limit * page;

      const resData = await this.FormSubjectService.showPage(
        page,
        limit,
        search,
        offset,
        academic_year,
        is_active
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

      const resData = await this.FormSubjectService.deleteFormSubject(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = FormSubjectController;

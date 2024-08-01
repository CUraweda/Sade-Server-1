const httpStatus = require("http-status");
const ClassesService = require("../service/ClassesService");
const SubjectService = require("../service/SubjectService");
const logger = require("../config/logger");
const FormSubjectService = require("../service/FormSubjectService");
const { level } = require("winston");

class ClassesController {
  constructor() {
    this.classesService = new ClassesService();
    this.subjectService = new SubjectService()
    this.formSubjectService = new FormSubjectService()
  }

  create = async (req, res) => {
    try {
      const resData = await this.classesService.createClasses(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.classesService.updateClasses(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.classesService.showClasses(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const { employee } = req.user
      const { with_assign, with_subject = "Y", with_form_class = "Y" } = req.query
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const is_active = req.query.is_active || "Y";

      console.log(with_assign)
      
      const resData = await this.classesService.showPage(
        page,
        limit,
        { search, employee_id: with_assign == "Y" && employee ? employee.id : null, is_active, with_subject, with_form_class },
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

      const resData = await this.classesService.deleteClasses(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = ClassesController;

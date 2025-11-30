const httpStatus = require("http-status");
const SubjectService = require("../service/SubjectService");
const logger = require("../config/logger");

class SubjectController {
  constructor() {
    this.subjectService = new SubjectService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.subjectService.createSubject(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      console.log("req.body", req.body);
      const resData = await this.subjectService.updateSubject(id, req.body);
      
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.subjectService.showSubject(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const { employee } = req.user
      const { with_assign } = req.query
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let subjectIds = []

      if (employee && with_assign == "Y") {
        // subject ids 
        subjectIds = employee.formsubjects?.map(fs => fs.subject?.id ?? "").filter(l => l != "") ?? []
      }

      const resData = await this.subjectService.showPage(
        page,
        limit,
        { search, subjectIds },
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

      const resData = await this.subjectService.deleteSubject(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = SubjectController;

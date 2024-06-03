const httpStatus = require("http-status");
const NarrativeCommentService = require("../service/NarrativeCommentService");
const logger = require("../config/logger");

class NarrativeCommentController {
  constructor() {
    this.narrativeCommentService = new NarrativeCommentService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.narrativeCommentService.createNarrativeComment(
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

      const resData = await this.narrativeCommentService.updateNarrativeComment(
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

      const resData = await this.narrativeCommentService.showNarrativeComment(
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
      const id = req.params.id;
      const semester = req.query.semester;
      const academic = req.query.academic;

      const resData =
        await this.narrativeCommentService.showNarrativeCommentByStudentId(
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

  showByStudentReportId = async (req, res) => {
    try {
      const id = req.params.id;

      const resData =
        await this.narrativeCommentService.showNarrativeCommentByStudentReportId(
          id
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

      const resData = await this.narrativeCommentService.deleteNarrativeComment(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = NarrativeCommentController;

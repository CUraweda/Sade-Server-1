const httpStatus = require("http-status");
const EduCalendarDetailService = require("../service/EduCalendarDetailService");
const logger = require("../config/logger");

class EduCalendarDetailController {
  constructor() {
    this.eduCalendarDetailService = new EduCalendarDetailService();
  }

  create = async (req, res) => {
    try {
      const resData =
        await this.eduCalendarDetailService.createEduCalendarDetail(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData =
        await this.eduCalendarDetailService.updateEduCalendarDetail(
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

      const resData = await this.eduCalendarDetailService.showEduCalendarDetail(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByTeacherId = async (req, res) => {
    try {
      var id = req.params.id;
      const academic = req.query.academic

      const resData = await this.eduCalendarDetailService.showEduCalendarDetailByTeacherId(id, academic);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByEduId = async (req, res) => {
    try {
      var id = req.params.id;
      const academic = req.query.academic
      const teacher_id = req.query.teacher_id

      const resData = await this.eduCalendarDetailService.showEduCalendarDetailByEduId(id, teacher_id, academic);

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
      const { academic } = req.query

      const resData = await this.eduCalendarDetailService.showPage(
        page,
        limit,
        search,
        offset,
        {
          academic
        }
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

      const resData =
        await this.eduCalendarDetailService.deleteEduCalendarDetail(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.eduCalendarDetailService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = EduCalendarDetailController;

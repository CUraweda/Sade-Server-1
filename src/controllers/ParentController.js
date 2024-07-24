const httpStatus = require("http-status");
const ParentService = require("../service/ParentService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class ParentController {
  constructor() {
    this.parentService = new ParentService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.parentService.createParent(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.parentService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.parentService.updateParent(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  updateMe = async (req, res) => {
    try {
      const { id } = req.user

      const parent = await this.parentService.showByUserId(id)
      if (parent.statusCode !== 200) return res.status(parent.statusCode).send(parent.response);

      const resData = await this.parentService.updateParent(parent.response.data.id, req.body)

      res.status(resData.statusCode).send(resData.response);
    } catch (error) {
      logger.error(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    }
  }

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.parentService.showParent(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.parentService.showParentByStudentId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByUserId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.parentService.showByUserId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByName = async (req, res) => {
    try {
      var name = req.params.name;

      const resData = await this.parentService.showByName(name);

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

      const resData = await this.parentService.showPage(
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

      const resData = await this.parentService.deleteParent(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = ParentController;

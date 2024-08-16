const httpStatus = require("http-status");
const UserAccessService = require("../service/UserAccessService");
const logger = require("../config/logger");

class UserAccessController {
  constructor() {
    this.userAccessService = new UserAccessService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.userAccessService.createUserAccess(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userAccessService.updateUserAccess(
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

      const resData = await this.userAccessService.showUserAccess(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByUserId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userAccessService.showByUserId(id);

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
      const { ortu_only, level, class_name } = req.query  
      const offset = limit * page;

      const resData = await this.userAccessService.showPage(
        page,
        limit,
        search,
        offset,
        { ortu_only, level, class_name }
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

      const resData = await this.userAccessService.deleteUserAccess(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = UserAccessController;

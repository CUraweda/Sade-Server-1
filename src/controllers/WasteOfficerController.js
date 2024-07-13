const httpStatus = require("http-status");
const WasteOfficerService = require("../service/WasteOfficerService");
const logger = require("../config/logger");

class WasteOfficerController {
  constructor() {
    this.wasteOfficerService = new WasteOfficerService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.wasteOfficerService.createWasteOfficer(req.body);
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      const id = req.params.id;
      const resData = await this.wasteOfficerService.updateWasteOfficer(id, req.body);
  
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.wasteOfficerService.showWasteOfficer(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
  showByDate = async (req, res) => {
    try {
      const { date } = req.params;
      const resData = await this.wasteOfficerService.showWasteOfficersByDate(date);
  
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  };

  showAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      const resData = await this.wasteOfficerService.showPage(
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

      const resData = await this.wasteOfficerService.deleteWasteOfficer(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = WasteOfficerController
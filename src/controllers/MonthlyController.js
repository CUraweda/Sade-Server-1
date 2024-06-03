const httpStatus = require("http-status");
const MonthlyService = require("../service/MonthlyService");
const logger = require("../config/logger");

class MonthlyController {
  constructor() {
    this.monthlyService = new MonthlyService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.monthlyService.createMonthly(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  generateClass = async (req, res) => {
    try {
      const resData = await this.monthlyService.generateMonthlyByClass(
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

      const resData = await this.monthlyService.updateMonthly(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.monthlyService.showMonthlyByStudent(id);

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

      const resData = await this.monthlyService.showPage(
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

      const resData = await this.monthlyService.deleteMonthly(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  fileDownload = async (req, res) => {
    try {
      const id = req.params.id;

      const paymentData = await this.monthlyService.showMonthly(id);

      if (paymentData.statusCode === httpStatus.NOT_FOUND) {
        res.status(httpStatus.OK).send({
          status: true,
          code: httpStatus.OK,
          message: "Payment data not found.",
        });
      } else {
        var resPath = paymentData.response.data.invoice;

        res.download(resPath, function (err) {
          console.log(err);
        });
      }
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = MonthlyController;

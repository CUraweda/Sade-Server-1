const httpStatus = require("http-status");
const NonMonthlyService = require("../service/NonMonthlyService");
const logger = require("../config/logger");

class NonMonthlyController {
  constructor() {
    this.nonMonthlyService = new NonMonthlyService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.nonMonthlyService.createNonMonthly(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  generateClass = async (req, res) => {
    try {
      const resData = await this.nonMonthlyService.generateNonMonthlyByClass(
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

      const resData = await this.nonMonthlyService.updateNonMonthly(
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

      const resData = await this.nonMonthlyService.showNonMonthlyByStudent(id);

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

      const resData = await this.nonMonthlyService.showPage(
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

      const resData = await this.nonMonthlyService.deleteNonMonthly(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  fileDownload = async (req, res) => {
    try {
      const id = req.params.id;

      const paymentData = await this.nonMonthlyService.showNonMonthly(id);

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

module.exports = NonMonthlyController;

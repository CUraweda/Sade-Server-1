const httpStatus = require("http-status");
const PaymentPostService = require("../service/PaymentPostService");
const logger = require("../config/logger");

class PaymentPostController {
  constructor() {
    this.paymentPostService = new PaymentPostService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.paymentPostService.createPaymentPost(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.paymentPostService.updatePaymentPost(
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

      const resData = await this.paymentPostService.showPaymentPost(id);

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
      let startDate = req.query.startDate || null;
      let endDate = req.query.endDate || null;

      // if (startDate && endDate) {
      //   startDate = new Date(startDate);
      //   endDate = new Date(endDate);
      // }

      const resData = await this.paymentPostService.showPage(
        page,
        limit,
        search,
        offset,
        startDate,
        endDate
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showTotal = async (req, res) => {
    try {
      const resData = await this.paymentPostService.showPaymentTotalPOS();
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.paymentPostService.deletePaymentPost(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = PaymentPostController;

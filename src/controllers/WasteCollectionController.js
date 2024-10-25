const httpStatus = require("http-status");
const WasteCollectionService = require("../service/WasteCollectionService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class WasteCollectionController {
  constructor() {
    this.wasteCollectionService = new WasteCollectionService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.wasteCollectionService.createWasteCollection(
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

      const resData = await this.wasteCollectionService.updateWasteCollection(
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

      const resData = await this.wasteCollectionService.showWasteCollection(id);

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

      const resData = await this.wasteCollectionService.showPage(
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
  
  showByFilter = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      
        const { waste_type_id, class_id, start_date, end_date, weight } = req.query;

        const resData = await this.wasteCollectionService.getWasteCollectionByFilter(
            waste_type_id, class_id, start_date, end_date, weight,
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

      const resData = await this.wasteCollectionService.deleteWasteCollection(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapHistory = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.wasteCollectionService.showRecapHistory(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapStudentInClass = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.wasteCollectionService.showRecapStudentInClass(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showCollectionPerWeekbyStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData =
        await this.wasteCollectionService.showCollectionPerWeekbyStudentId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapPerWeekbyStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.wasteCollectionService.showRecapPerWeekByStudentId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.wasteCollectionService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showTargetAchievementByStudentId = async (req, res) => {
    try {
      var id = req.params.id;
      const is_current = req.query.is_current || true;

      const resData =
        await this.wasteCollectionService.showTargetAchievementByStudentId(
          id,
          is_current
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = WasteCollectionController;

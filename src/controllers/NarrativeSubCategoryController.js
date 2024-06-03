const httpStatus = require("http-status");
const NarrativeSubCategoryService = require("../service/NarrativeSubCategoryService");
const logger = require("../config/logger");

class NarrativeSubCategoryController {
  constructor() {
    this.narrativeSubCategoryService = new NarrativeSubCategoryService();
  }

  create = async (req, res) => {
    try {
      const resData =
        await this.narrativeSubCategoryService.createNarrativeSubCategory(
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

      const resData =
        await this.narrativeSubCategoryService.updateNarrativeSubCategory(
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

      const resData =
        await this.narrativeSubCategoryService.showNarrativeSubCategory(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByCategoryId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData =
        await this.narrativeSubCategoryService.showNarrativeSubCategoryByCatId(
          id
        );

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

      const resData = await this.narrativeSubCategoryService.showPage(
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

      const resData =
        await this.narrativeSubCategoryService.deleteNarrativeSubCategory(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = NarrativeSubCategoryController;

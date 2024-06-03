const httpStatus = require("http-status");
const AchievementService = require("../service/AchievementService");
const logger = require("../config/logger");
const uploadAchievement = require("../middlewares/uploadAchievement");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const schema = Joi.object({
  student_id: Joi.number().required(),
  achievement_desc: Joi.string().allow("", null),
  issued_at: Joi.date().allow("", null),
  certificate_path: Joi.string().allow("", null),
});

class AchievementController {
  constructor() {
    this.achievementService = new AchievementService();
  }

  create = async (req, res) => {
    try {
      await uploadAchievement(req, res);

      var certificate_path = req.file ? req.file.path : null;

      const formData = { ...req.body, certificate_path };

      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
      }

      const resData = await this.achievementService.createAchievement(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadAchievement(req, res);

      var certificate_path = req.file ? req.file.path : null;
      let formData;

      if (certificate_path) formData = { ...req.body, certificate_path };
      else formData = { ...req.body };

      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
      }

      var id = req.params.id;

      const resData = await this.achievementService.updateAchievement(
        id,
        formData
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

      const resData = await this.achievementService.showAchievement(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.achievementService.showAchievementByStudentId(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showTopOneByStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData =
        await this.achievementService.showAchievementTopOneByStudentId(id);

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

      const resData = await this.achievementService.showPage(
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

      const resData = await this.achievementService.deleteAchievement(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = AchievementController;

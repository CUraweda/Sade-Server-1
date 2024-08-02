const httpStatus = require("http-status");
const AchievementService = require("../service/AchievementService");
const logger = require("../config/logger");
const uploadAchievement = require("../middlewares/uploadAchievement");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");
const ClassesService = require("../service/ClassesService");

const schema = Joi.object({
  student_id: Joi.number().required(),
  achievement_desc: Joi.string().allow("", null),
  issued_at: Joi.date().allow("", null),
  certificate_path: Joi.string().allow("", null),
});

class AchievementController {
  constructor() {
    this.achievementService = new AchievementService();
    this.classService = new ClassesService();
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
      const academic = req.query.academic

      const resData = await this.achievementService.showAchievementByStudentId(
        id, academic
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
      const academic = req.query.academic

      const resData =
        await this.achievementService.showAchievementTopOneByStudentId(id, academic);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const { employee } = req.user
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const { class_id, with_assign, academic } = req.query

      let class_ids = []
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(0, undefined, { search: "", employee_id: employee.id }, 0)
        class_ids = empClasses.response?.data?.result?.map(c => c.id ?? "").filter(c => c != "") ?? []
      }

      const resData = await this.achievementService.showPage(
        page,
        limit,
        search,
        offset,
        {
          class_id,
          class_ids,
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

      const resData = await this.achievementService.deleteAchievement(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  downloadCertificate = async (req, res) => {
    try {
      const filePath = req.query.filepath; // Assuming the full file path is provided in the query parameter

      // Check if file path is provided
      if (!filePath) {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: "File path not provided.",
        });
      }

      // Check if file exists
      if (fs.existsSync(filePath)) {
        // Set appropriate headers
        const filename = path.basename(filePath);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );

        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.status(httpStatus.NOT_FOUND).send({
          status: false,
          code: httpStatus.NOT_FOUND,
          message: "File not found.",
        });
      }
    } catch (e) {
      console.error(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }
}

module.exports = AchievementController;

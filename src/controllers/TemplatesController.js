const httpStatus = require("http-status");
const TemplatesService = require("../service/TemplatesService");
const logger = require("../config/logger");

const uploadTemplates = require("../middlewares/uploadTemplates");
const Joi = require("joi");

const schema = Joi.object({
  code: Joi.string().required(),
  desc: Joi.string().required(),
  file_path: Joi.string().required(),
});

class TemplatesController {
  constructor() {
    this.templatesService = new TemplatesService();
  }

  create = async (req, res) => {
    try {
      await uploadTemplates(req, res);

      var file_path = req.file ? req.file.path : null;

      const formData = { ...req.body, file_path };

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

      const resData = await this.templatesService.createTemplates(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadTemplates(req, res);

      var file_path = req.file ? req.file.path : null;
      let formData;

      if (file_path) formData = { ...req.body, file_path };
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

      const resData = await this.templatesService.updateTemplates(id, formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.templatesService.showTemplates(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByCode = async (req, res) => {
    try {
      const code = req.params.code;

      const resData = await this.templatesService.showTemplatesByCode(code);

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

      const resData = await this.templatesService.showPage(
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

      const resData = await this.templatesService.deleteTemplates(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = TemplatesController;

const httpStatus = require("http-status");
const TaskService = require("../service/TaskService");
const logger = require("../config/logger");
const uploadTask = require("../middlewares/uploadTask");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const schema = Joi.object({
  class_id: Joi.number().required(),
  subject_id: Joi.number().required(),
  task_category_id: Joi.number().required(),
  topic: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().allow("", null),
  end_date: Joi.date().allow("", null),
  category: Joi.string().allow("", null),
  status: Joi.string().allow("", null),
  task_file: Joi.string().allow("", null),
});

class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req, res) => {
    try {
      await uploadTask(req, res);

      var task_file = req.file ? req.file.path : null;

      const formData = { ...req.body, task_file };

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

      const resData = await this.taskService.createTask(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadTask(req, res);

      var task_file = req.file ? req.file.path : null;
      let formData;

      if (task_file) formData = { ...req.body, task_file };
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

      const resData = await this.taskService.updateTask(id, formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.taskService.showTask(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClassId = async (req, res) => {
    try {
      const id = req.params.id;
      const cat_id = req.query.cat || "";

      const resData = await this.taskService.showTaskByClassId(id, cat_id);

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

      const resData = await this.taskService.showPage(
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

      const resData = await this.taskService.deleteTask(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = TaskController;

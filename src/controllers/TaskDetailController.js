const httpStatus = require("http-status");
const TaskDetailService = require("../service/TaskDetailService");
const logger = require("../config/logger");
const uploadTask = require("../middlewares/uploadTask");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const schema = Joi.object({
  task_id: Joi.number().required(),
  student_id: Joi.number().required(),
  work_date: Joi.date().allow("", null),
  task_file: Joi.string().allow("", null),
  feedback: Joi.string().allow("", null),
});

class TaskDetailController {
  constructor() {
    this.taskDetailService = new TaskDetailService();
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

      const resData = await this.taskDetailService.createTaskDetail(formData);

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

      const resData = await this.taskDetailService.updateTaskDetail(
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

      const resData = await this.taskDetailService.showTaskDetail(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByTaskId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.taskDetailService.showTaskDetailByTaskId(id);

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

      const resData = await this.taskDetailService.showPage(
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

      const resData = await this.taskDetailService.deleteTaskDetail(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = TaskDetailController;

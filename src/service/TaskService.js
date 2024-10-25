const httpStatus = require("http-status");
const TaskDao = require("../dao/TaskDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");

class TaskService {
  constructor() {
    this.taskDao = new TaskDao();
  }

  createTask = async (reqBody) => {
    try {
      let message = "Task successfully added.";

      let data = await this.taskDao.create(reqBody);

      if (!data) {
        message = "Failed to create task.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateTask = async (id, body) => {
    const message = "Task successfully updated!";

    let rel = await this.taskDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task not found!",
        {}
      );
    }

    const updateData = await this.taskDao.updateById(body, id);

    //delete file if exist
    const rData = rel.dataValues;

    if (rData.task_file) {
      // console.log(rData.cover);
      if (body.task_file) {
        fs.unlink(rData.task_file, (err) => {
          if (err) {
            return responseHandler.returnError(
              httpStatus.NOT_FOUND,
              "Cannot delete attachment!"
            );
          }
          console.log("Delete File successfully.");
        });
      }
    }

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, body);
    }
  };

  showTask = async (id) => {
    const message = "Task successfully retrieved!";

    let rel = await this.taskDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showTaskByClassId = async (id, cat_id, studentId) => {
    const message = "Task successfully retrieved!";

    let rel = await this.taskDao.getTaskByClassId(id, cat_id, studentId);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.taskDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.taskDao.getTaskPage(search, offset, limit, filters);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Task successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTask = async (id) => {
    const message = "Task successfully deleted!";

    let rel = await this.taskDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Task not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TaskService;

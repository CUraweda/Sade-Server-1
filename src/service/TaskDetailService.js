const httpStatus = require("http-status");
const TaskDetailDao = require("../dao/TaskDetailDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");

class TaskDetailService {
  constructor() {
    this.taskDetailDao = new TaskDetailDao();
  }

  createTaskDetail = async (reqBody) => {
    try {
      let message = "Task detail successfully added.";

      let data = await this.taskDetailDao.create(reqBody);

      if (!data) {
        message = "Failed to create task detail.";
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

  updateTaskDetail = async (id, body) => {
    const message = "Task detail successfully updated!";

    let rel = await this.taskDetailDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task detail not found!",
        {}
      );
    }

    const updateData = await this.taskDetailDao.updateById(body, id);

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
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTaskDetail = async (id) => {
    const message = "Task detail successfully retrieved!";

    let rel = await this.taskDetailDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showTaskDetailByTaskId = async (id) => {
    const message = "Task detail successfully retrieved!";

    let rel = await this.taskDetailDao.getByTaskId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task detail not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.taskDetailDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.taskDetailDao.getTaskDetailPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Task detail successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTaskDetail = async (id) => {
    const message = "Task detail successfully deleted!";

    let rel = await this.taskDetailDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task detail not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TaskDetailService;

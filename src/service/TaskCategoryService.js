const httpStatus = require("http-status");
const TaskCategoryDao = require("../dao/TaskCategoryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class TaskCategoryService {
  constructor() {
    this.taskCategoryDao = new TaskCategoryDao();
  }

  createTaskCategory = async (reqBody) => {
    try {
      let message = "Task Category successfully added.";

      let data = await this.taskCategoryDao.create(reqBody);

      if (!data) {
        message = "Failed to create task category.";
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

  updateTaskCategory = async (id, body) => {
    const message = "Task Category successfully updated!";

    let rel = await this.taskCategoryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task Category not found!",
        {}
      );
    }

    const updateData = await this.taskCategoryDao.updateWhere(
      {
        desc: body.desc,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTaskCategory = async (id) => {
    const message = "Task Category successfully retrieved!";

    let rel = await this.taskCategoryDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task Category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.taskCategoryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.taskCategoryDao.getTaskCategoryPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Task Category successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTaskCategory = async (id) => {
    const message = "TaskCategory successfully deleted!";

    let rel = await this.taskCategoryDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Task Category not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TaskCategoryService;

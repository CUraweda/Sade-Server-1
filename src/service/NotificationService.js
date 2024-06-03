const httpStatus = require("http-status");
const NotificationDao = require("../dao/NotificationDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class NotificationService {
  constructor() {
    this.notificationDao = new NotificationDao();
  }

  createNotification = async (reqBody) => {
    try {
      let message = "Notification successfully added.";

      let data = await this.notificationDao.create(reqBody);

      if (!data) {
        message = "Failed to create notification.";
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

  updateNotification = async (id, body) => {
    const message = "Notification successfully updated!";

    let rel = await this.notificationDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Notification not found!",
        {}
      );
    }

    const updateData = await this.notificationDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNotification = async (id) => {
    const message = "Notification successfully retrieved!";

    let rel = await this.notificationDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Notification not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showNotificationByUserId = async (id) => {
    const message = "Notification successfully retrieved!";

    let rel = await this.notificationDao.getByUserId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Notification not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.notificationDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.notificationDao.getNotificationPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Notification successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNotification = async (id) => {
    const message = "Notification successfully deleted!";

    let rel = await this.notificationDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Notification not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = NotificationService;

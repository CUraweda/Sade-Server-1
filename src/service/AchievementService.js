const httpStatus = require("http-status");
const AchievementDao = require("../dao/AchievementDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

const path = require("path");
const fs = require("fs");

class AchievementService {
  constructor() {
    this.achievementDao = new AchievementDao();
  }

  createAchievement = async (reqBody) => {
    try {
      let message = "Achievement successfully added.";

      let data = await this.achievementDao.create(reqBody);

      if (!data) {
        message = "Failed to create achievement.";
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

  updateAchievement = async (id, body) => {
    const message = "Achievement successfully updated!";

    let cl = await this.achievementDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Achievement not found!",
        {}
      );
    }

    const updateData = await this.achievementDao.updateById(body, id);

    //delete file if exist
    const rData = cl.dataValues;
    console.log(rData);
    if (rData.certificate_path) {
      // console.log(rData.cover);
      if (body.certificate_path) {
        fs.unlink(rData.certificate_path, (err) => {
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

  showAchievement = async (id) => {
    const message = "Achievement successfully retrieved!";

    let cl = await this.achievementDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Achievement not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showAchievementByStudentId = async (id) => {
    const message = "Achievement successfully retrieved!";

    let cl = await this.achievementDao.getByStudentId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Achievement not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showAchievementTopOneByStudentId = async (id) => {
    const message = "Achievement successfully retrieved!";

    let cl = await this.achievementDao.getTopOne(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Achievement not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.achievementDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.achievementDao.getAchievementPage(
      search,
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Achievement successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteAchievement = async (id) => {
    const message = "Achievement successfully deleted!";

    let cl = await this.achievementDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Achievement not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = AchievementService;

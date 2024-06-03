const httpStatus = require("http-status");
const TemplatesDao = require("../dao/TemplatesDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");

class TemplatesService {
  constructor() {
    this.templatesDao = new TemplatesDao();
  }

  createTemplates = async (reqBody) => {
    try {
      let message = "Templates successfully added.";

      let data = await this.templatesDao.create(reqBody);

      if (!data) {
        message = "Failed to create templates.";
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

  updateTemplates = async (id, body) => {
    const message = "File Template successfully updated!";

    let rel = await this.templatesDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "File template not found!",
        {}
      );
    }

    const updateData = await this.templatesDao.updateById(body, id);

    //delete file if exist
    const rData = rel.dataValues;

    if (rData.file_path) {
      // console.log(rData.cover);
      if (body.file_path) {
        fs.unlink(rData.file_path, (err) => {
          if (err) {
            return responseHandler.returnError(
              httpStatus.NOT_FOUND,
              "Cannot delete attachment!"
            );
          }
          console.log(rData.file_path + " successfully deleted.");
        });
      }
    }

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, body);
    }
  };

  showTemplates = async (id) => {
    const message = "Templates successfully retrieved!";

    let rel = await this.templatesDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Templates not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showTemplatesByCode = async (code) => {
    const message = "Templates successfully retrieved!";

    let rel = await this.templatesDao.getByCode(code);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Templates not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.templatesDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.templatesDao.getTemplatesPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Templates successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTemplates = async (id) => {
    const message = "Templates successfully deleted!";

    let rel = await this.templatesDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Templates not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TemplatesService;

const httpStatus = require("http-status");
const RoleDao = require("../dao/RoleDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class RoleService {
  constructor() {
    this.roleDao = new RoleDao();
  }

  createRole = async (reqBody) => {
    try {
      let message = "Role successfully added.";

      let data = await this.roleDao.create(reqBody);

      if (!data) {
        message = "Failed to create role.";
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

  updateRole = async (id, body) => {
    const message = "Role successfully updated!";

    let rel = await this.roleDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Role not found!",
        {}
      );
    }

    const updateData = await this.roleDao.updateWhere(
      {
        code: body.code,
        name: body.name,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showRole = async (id) => {
    const message = "Role successfully retrieved!";

    let rel = await this.roleDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Role not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.roleDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.roleDao.getRolePage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Role successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteRole = async (id) => {
    const message = "Role successfully deleted!";

    let rel = await this.roleDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Role not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = RoleService;

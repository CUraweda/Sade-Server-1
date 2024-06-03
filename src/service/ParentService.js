const httpStatus = require("http-status");
const ParentDao = require("../dao/ParentDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

class ParentService {
  constructor() {
    this.parentDao = new ParentDao();
  }

  createParent = async (reqBody) => {
    try {
      let message = "Parent successfully added.";

      let data = await this.parentDao.create(reqBody);

      if (!data) {
        message = "Failed to add parent.";
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

  importFromExcel = async (req) => {
    try {
      let message = "Parents  successfully added.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      let data = await this.parentDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add parents.";
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

  updateReligion = async (id, body) => {
    const message = "Religion successfully updated!";

    let rel = await this.parentDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Religion year not found!",
        {}
      );
    }

    const updateData = await this.parentDao.updateWhere(
      {
        student_id: body.student_id,
        parent_type: body.parent_type,
        name: body.name,
        nationality: body.nationality,
        religion: body.religion,
        marriage_to: body.marriage_to,
        in_age: body.in_age,
        relationship_to_student: body.relationship_to_student,
        address: body.address,
        phone: body.phone,
        email: body.email,
        com_priority: body.com_priority,
        last_education: body.last_education,
        salary: body.salary,
        field_of_work: body.field_of_work,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showParent = async (id) => {
    const message = "Parent successfully retrieved!";

    let dt = await this.parentDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Parent not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  showParentByStudentId = async (id) => {
    const message = "Parents successfully retrieved!";

    let dt = await this.parentDao.findByStudentId(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Parents not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.parentDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.parentDao.getParentsPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Parent successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteParent = async (id) => {
    const message = "Parent successfully deleted!";

    let dt = await this.parentDao.deleteByWhere({ id });

    if (!dt) {
      return responseHandler.returnSuccess(httpStatus.OK, "Parent not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };
}

module.exports = ParentService;

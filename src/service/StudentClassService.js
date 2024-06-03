const httpStatus = require("http-status");
const StudentClassDao = require("../dao/StudentClassDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");
const { Op } = require("sequelize");

class StudentClassService {
  constructor() {
    this.studentClassDao = new StudentClassDao();
  }

  // createStudentClass = async (reqBody) => {
  //   try {
  //     let message = "Student Class successfully added.";

  //     let data = await this.studentClassDao.create(reqBody);

  //     if (!data) {
  //       message = "Failed to create Student Class.";
  //       return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
  //     }

  //     return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
  //   } catch (e) {
  //     logger.error(e);
  //     return responseHandler.returnError(
  //       httpStatus.BAD_REQUEST,
  //       "Something went wrong!"
  //     );
  //   }
  // };

  createStudentClass = async (reqBody) => {
    try {
      let message = "Student Class successfully added.";

      let data = await this.studentClassDao.create(reqBody);

      if (!data) {
        message = "Failed to create Student Class.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      // Update another record with the same student_id and academic_year not equal to reqBody.academic_year
      await this.studentClassDao.updateWhere(
        { is_active: "Tidak" }, // Update fields
        {
          student_id: reqBody.student_id,
          academic_year: { [Op.ne]: reqBody.academic_year }, // Not equal condition
        }
      );

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateStudentClass = async (id, body) => {
    const message = "Student Class successfully updated!";

    let rel = await this.studentClassDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    const updateData = await this.studentClassDao.updateWhere(
      {
        academic_year: body.academic_year,
        student_id: body.student_id,
        class_id: body.class_id,
        is_active: body.is_active,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showStudentClass = async (id) => {
    const message = "Student Class successfully retrieved!";

    let rel = await this.studentClassDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentClassByLevel = async (lvl) => {
    const message = "Student Class successfully retrieved!";

    let data = await this.studentClassDao.getByLevel(lvl);

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, data);
  };

  showStudentByClass = async (id, academic_year) => {
    const message = "Student Class successfully retrieved!";

    let rel = await this.studentClassDao.getByClasses(id, academic_year);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.studentClassDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentClassDao.getStudentClassPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student Class successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteStudentClass = async (id) => {
    const message = "Student Class successfully deleted!";

    let rel = await this.studentClassDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Student in class successfully imported.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      let data = await this.studentClassDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add student in class.";
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
}

module.exports = StudentClassService;

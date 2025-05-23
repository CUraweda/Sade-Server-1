const httpStatus = require("http-status");
const StudentClassDao = require("../dao/StudentClassDao");
const StudentDao = require("../dao/StudentDao")
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");
const { Op } = require("sequelize");
const ClassesDao = require("../dao/ClassesDao");
class StudentClassService {
  constructor() {
    this.studentClassDao = new StudentClassDao();
    this.studentDao = new StudentDao()
    this.classDao = new ClassesDao()
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

  updateAndSecureStudentClasss = async (secured_id, student_data) => {
    const { student_id, class_id } = student_data
    await this.studentDao.updateClass(student_id, class_id)
    return await this.studentClassDao.updateWhere(
      { is_active: "Tidak" },
      {
        student_id,
        is_active: "Ya",
        id: { [Op.not]: secured_id }
      }
    );

  }

  createStudentClass = async (reqBody) => {
    try {
      let message = "Student Class successfully added.";


      let data = await this.studentClassDao.create(reqBody);

      if (!data) {
        message = "Failed to create Student Class.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      await this.updateAndSecureStudentClasss(data.id, data)
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

    if (!updateData) return responseHandler.returnError(httpStatus.NOT_FOUND, "Failed to udpate student class");
    if (body.is_active === "Ya") await this.updateAndSecureStudentClasss(id, body)
    return responseHandler.returnSuccess(httpStatus.OK, message, {});
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

  showStudentClassByLevel = async (lvl, academic_year) => {
    const message = "Student Class successfully retrieved!";

    let data = await this.studentClassDao.getByLevel(lvl, academic_year);

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, data);
  };

  showStudentByClass = async (id, filter) => {
    const message = "Student Class successfully retrieved!";

    let rel = await this.studentClassDao.getByClasses(id, filter);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Class not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, classId, academicYear) {
    const totalRows = await this.studentClassDao.getCount(search, classId, academicYear);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentClassDao.getStudentClassPage(
      search,
      offset,
      limit,
      classId,
      academicYear
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

  showClassByStudent = async (id) => {
    const rel = await this.studentClassDao.getByStudentId(id)
    return responseHandler.returnSuccess(httpStatus.OK, "Student Class Successfully Retrived", rel);
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

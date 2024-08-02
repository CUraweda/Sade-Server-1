const httpStatus = require("http-status");
const StudentAttendanceDao = require("../dao/StudentAttendanceDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const moment = require("moment");
const xlsx = require("xlsx");

class StudentAttendanceService {
  constructor() {
    this.studentAttendanceDao = new StudentAttendanceDao();
  }

  createStudentAttendance = async (reqBody) => {
    try {
      let message = "Student Attendance successfully added.";
      const timeTreshold = moment(userConstant.ONTIME, "HH:mm");
      let statusDesc = reqBody.status;

      if (reqBody.att_time !== undefined) {
        const timeReal = moment(reqBody.att_time, "HH:mm");

        if (timeReal <= timeTreshold) {
          statusDesc = "Hadir (Ontime)";
        } else {
          statusDesc = "Hadir (Late)";
        }
      }

      let body = {
        student_class_id: reqBody.student_class_id,
        semester: reqBody.semester,
        att_date: reqBody.att_date,
        att_time: reqBody.att_time,
        status: statusDesc,
        remark: reqBody.remark,
      };

      let data = await this.studentAttendanceDao.create(body);

      if (!data) {
        message = "Failed to create Student Attendance.";
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

  createStudentAttendanceBulk = async (reqBody) => {
    try {
      console.log(reqBody);
      let message = "Student Attendance successfully added.";
      const timeTreshold = moment(userConstant.ONTIME, "HH:mm");

      for (let i = 0; i < reqBody.length; i++) {
        if (reqBody.att_time !== undefined) {
          const timeReal = moment(reqBody[i].att_time, "HH:mm");
          if (timeReal <= timeTreshold) {
            reqBody[i].status = "Hadir (Ontime)";
          } else {
            reqBody[i].status = "Hadir (Late)";
          }
        }
      }

      let data = await this.studentAttendanceDao.bulkCreate(reqBody);

      if (!data) {
        message = "Failed to create Student Attendance.";
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

  updateStudentAttendance = async (id, body) => {
    const message = "Student Attendance successfully updated!";

    let rel = await this.studentAttendanceDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    const updateData = await this.studentAttendanceDao.updateWhere(
      {
        student_class_id: body.student_class_id,
        semester: body.semester,
        att_date: body.att_date,
        att_time: body.att_time,
        status: body.status,
        remark: body.remark,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showStudentAttendance = async (id) => {
    const message = "Student Attendance successfully retrieved!";

    let rel = await this.studentAttendanceDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentAttendanceByStudentId = async (id, academic) => {
    const message = "Student Attendance successfully retrieved!";

    let rel = await this.studentAttendanceDao.getByStudentId(id, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentAttendanceByClassIdNDate = async (class_id, att_date, academic) => {
    const message = "Student Attendance successfully retrieved!";

    let rel = await this.studentAttendanceDao.getByClassNDate(
      class_id,
      att_date,
      academic
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentAttendanceByStudentIdMonth = async (id, year, month) => {
    const message = "Student Attendance successfully retrieved!";

    let rel = await this.studentAttendanceDao.getByStudentIdMonth(
      id,
      year,
      month
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showRecapStudentAttendance = async (id, semester, academic) => {
    const message = "Student Attendance successfully retrieved!";

    let rel = await this.studentAttendanceDao.getRecapByStudentId(
      id,
      semester,
      academic
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.studentAttendanceDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentAttendanceDao.getStudentAttendancePage(
      search,
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student Attendance successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteStudentAttendance = async (id) => {
    const message = "Student Attendance successfully deleted!";

    let rel = await this.studentAttendanceDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Attendance not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Student attendance successfully added.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      let data = await this.studentAttendanceDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add student attendance.";
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

module.exports = StudentAttendanceService;

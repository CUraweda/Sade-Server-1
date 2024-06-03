const httpStatus = require("http-status");
const EmployeeDao = require("../dao/EmployeeDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

class EmployeeService {
  constructor() {
    this.employeeDao = new EmployeeDao();
  }

  createEmployee = async (reqBody) => {
    try {
      let message = "Employee successfully added.";

      let data = await this.employeeDao.create(reqBody);

      if (!data) {
        message = "Failed to add employee.";
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

  updateEmployee = async (id, body) => {
    const message = "Employee successfully updated!";

    let dt = await this.employeeDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee year not found!",
        {}
      );
    }

    const updateData = await this.employeeDao.updateWhere(
      {
        employee_no: body.employee_no,
        full_name: body.full_name,
        gender: body.gender,
        pob: body.pob,
        dob: body.dob,
        religion: body.religion,
        marital_status: body.marital_status,
        last_education: body.last_education,
        certificate_year: body.certificate_year,
        is_education: body.is_education,
        major: body.major,
        employee_status: body.employee_status,
        work_start_date: body.work_start_date,
        occupation: body.occupation,
        is_teacher: body.is_teacher,
        duty: body.duty,
        job_desc: body.job_desc,
        grade: body.grade,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showEmployee = async (id) => {
    const message = "Employee successfully retrieved!";

    let dt = await this.employeeDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  showEmployeeIsGuru = async (isGuru) => {
    const message = "Employee successfully retrieved!";

    let dt = await this.employeeDao.getEmployeeByIsTeacher(isGuru);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.employeeDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.employeeDao.getEmployeesPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Employee successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteEmployee = async (id) => {
    const message = "Employee successfully deleted!";

    let dt = await this.employeeDao.deleteByWhere({ id });

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Student successfully added.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      let data = await this.employeeDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add student.";
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

module.exports = EmployeeService;

const httpStatus = require("http-status");
const StudentTaskDao = require("../dao/StudentTaskDao");
const StudentClassDao = require("../dao/StudentClassDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");

class StudentTaskService {
  constructor() {
    this.studentTaskDao = new StudentTaskDao();
    this.studentClassDao = new StudentClassDao();
  }

  createStudentTask = async (reqBody) => {
    try {
      let message = "Student Task successfully added.";

      let data = await this.studentTaskDao.create(reqBody);

      if (!data) {
        message = "Failed to create Student Task.";
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

  generateTaskByClass = async (reqBody) => {
    try {
      let message = "Student Task successfully added.";

      let jsonArr = [];
      // info bugs ketika menggunakan await jangan menggunakan .then, karena hasilnya hanya akan menampilkan data terakhir saja yaitu bulan 12
      const results = await this.studentClassDao.getByClasses(reqBody);

      results.forEach((result) => {
        const jsonObj = {
          student_class_id: result.id,
          task_category_id: reqBody.task_category_id,
          semester: reqBody.semester,
          subject_id: reqBody.subject_id,
          topic: reqBody.topic,
          characteristic: reqBody.characteristic,
          start_date: reqBody.start_date,
          end_date: reqBody.end_date,
          status: reqBody.status,
          up_file: reqBody.up_file,
        };
        jsonArr.push(jsonObj);
      });

      if (!jsonArr) {
        message = "No data exist.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      const data = await this.studentTaskDao.bulkCreate(jsonArr);

      if (!data) {
        message = "Failed to create student task.";
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

  updateStudentTask = async (id, body) => {
    const message = "Student Task successfully updated!";

    let rel = await this.studentTaskDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Task not found!",
        {}
      );
    }

    const updateData = await this.studentTaskDao.updateById(body, id);

    //delete file if exist
    const rData = rel.dataValues;
    // if body.up_file exist, replace old file
    if (rData.up_file) {
      // console.log(rData.cover);
      if (body.up_file) {
        fs.unlink(rData.up_file, (err) => {
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
    // if body.down_file exist, replace old file
    if (rData.down_file) {
      // console.log(rData.cover);
      if (body.down_file) {
        fs.unlink(rData.down_file, (err) => {
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

  showStudentTask = async (id) => {
    const message = "Student Task successfully retrieved!";

    let rel = await this.studentTaskDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Task not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentTaskByStudentId = async (id, category) => {
    const message = "Student Task successfully retrieved!";

    let rel = await this.studentTaskDao.getByStudentId(id, category);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Task not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.studentTaskDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentTaskDao.getStudentTaskPage(
      search,
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student Task successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteStudentTask = async (id) => {
    const message = "Student Task successfully deleted!";

    let rel = await this.studentTaskDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Task not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = StudentTaskService;

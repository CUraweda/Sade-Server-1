const httpStatus = require("http-status");
const StudentTaskService = require("../service/StudentTaskService");
const logger = require("../config/logger");
const uploadTask = require("../middlewares/uploadTask");
const uploadStudentTask = require("../middlewares/uploadStudentTask");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");
const StudentReportService = require("../service/StudentReportService");
const ClassesService = require("../service/ClassesService");

const schema = Joi.object({
  academic_year: Joi.string().allow("", null),
  class_id: Joi.number().allow("", null),
  student_class_id: Joi.number().allow("", null),
  task_category_id: Joi.number().required(),
  semester: Joi.number().required(),
  subject_id: Joi.number().required(),
  topic: Joi.string().required(),
  characteristic: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().allow("", null),
  status: Joi.string().required(),
  assign_value: Joi.number().precision(2).allow("", null),
  feed_fwd: Joi.string().allow("", null),
  up_file: Joi.string().allow("", null),
  down_file: Joi.string().allow("", null),
});

const schemaUpdate = Joi.object({
  academic_year: Joi.string().allow("", null),
  class_id: Joi.number().allow("", null),
  student_class_id: Joi.number().allow("", null),
  task_category_id: Joi.number().allow("", null),
  semester: Joi.number().allow("", null),
  subject_id: Joi.number().allow("", null),
  topic: Joi.string().allow("", null),
  characteristic: Joi.string().allow("", null),
  start_date: Joi.date().allow("", null),
  end_date: Joi.date().allow("", null),
  status: Joi.string().allow("", null),
  assign_value: Joi.number().precision(2).allow("", null),
  feed_fwd: Joi.string().allow("", null),
  up_file: Joi.string().allow("", null),
  down_file: Joi.string().allow("", null),
});

class StudentTaskController {
  constructor() {
    this.studentTaskService = new StudentTaskService();
    this.studentReportService = new StudentReportService()
    this.classService = new ClassesService()
  }

  create = async (req, res) => {
    try {
      await uploadTask(req, res);

      var up_file = req.file ? req.file.path : null;

      const formData = { ...req.body, up_file };
      console.log(req.body)
      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
      }

      const resData = await this.studentTaskService.createStudentTask(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createBulk = async (req, res) => {
    try {
      await uploadTask(req, res);

      var up_file = req.file ? req.file.path : null;

      const formData = { ...req.body, up_file };
      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
      }

      const resData = await this.studentTaskService.generateTaskByClass(
        formData
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadTask(req, res);

      var up_file = req.file ? req.file.path : null;
      let formData;

      if (up_file) formData = { ...req.body, up_file };
      else formData = { ...req.body };

      const { error } = schemaUpdate.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
      }

      var id = req.params.id;

      const resData = await this.studentTaskService.updateStudentTask(
        id,
        formData
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentTaskService.showStudentTask(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentId = async (req, res) => {
    try {
      var id = req.params.id;
      const cat = req.query.cat || "";
      const academic = req.query.academic

      const resData = await this.studentTaskService.showStudentTaskByStudentId(
        id,
        cat,
        academic
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const { employee } = req.user
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const { class_id, with_assign, academic } = req.query

      let class_ids = []
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(0, undefined, { search: "", employee_id: employee.id }, 0)
        class_ids = empClasses.response?.data?.result?.map(c => c.id ?? "").filter(c => c != "") ?? []
      }


      const resData = await this.studentTaskService.showPage(
        page,
        limit,
        search,
        offset,
        {
          class_id,
          class_ids,
          academic
        }
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentTaskService.deleteStudentTask(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  uploadSiswa = async (req, res) => {
    try {
      await uploadStudentTask(req, res);

      var down_file = req.file ? req.file.path : null;

      const formData = { ...req.body, down_file };


      var id = req.params.id;

      const resData = await this.studentTaskService.updateStudentTask(
        id,
        formData
      );
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  downloadSiswa = async (req, res) => {
    try {
      const filePath = req.query.filepath; // Assuming the full file path is provided in the query parameter

      // Check if file path is provided
      if (!filePath) {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: "File path not provided.",
        });
      }

      
      // Check if file exists
      if (fs.existsSync(filePath)) {
        if (
          filePath.includes("_reports") && 
          (
            req.user?.dataValues?.role_id == 8 || 
            req.user?.dataValues?.role_id == 7
          )
        ) {
          let key = "", value = filePath
  
          if (req.query.student_id) { 
            key = "$studentclass.student_id$"
            value = req.query.student_id
          } else if (filePath.includes("number_reports")) key = "number_path"
          else if (filePath.includes("portofolio_reports")) key = "portofolio_path"
          else if (filePath.includes("narrative_reports")) key = "narrative_path";

          if (key) {
            const checkAccess = await this.studentReportService.checkReportAccess(key, value)
            if (!checkAccess) {
              return res.status(httpStatus.FORBIDDEN).send({
                status: false,
                code: httpStatus.FORBIDDEN,
                message: 'Report is locked',
              });
            }
          }
        }
        // Set appropriate headers
        const filename = path.basename(filePath);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );

        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.status(httpStatus.NOT_FOUND).send({
          status: false,
          code: httpStatus.NOT_FOUND,
          message: "File not found.",
        });
      }
    } catch (e) {
      console.error(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  };
}

module.exports = StudentTaskController;

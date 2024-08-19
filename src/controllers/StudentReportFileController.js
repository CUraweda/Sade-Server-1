const httpStatus = require("http-status");
const logger = require("../config/logger");
const uploadOldFile = require("../middlewares/uploadOldReport");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");
const ClassesService = require("../service/ClassesService");
const StudentReportFileService = require("../service/StudentReportFileService");

const schema = Joi.object({
  student_id: Joi.number().required(),
  semester: Joi.number().required(),
  academic_year: Joi.string().required(),
});

class StudentReportFileController {
  constructor() {
    this.studentReportFileController = new StudentReportFileService();
    this.classService = new ClassesService();
  }

  create = async (req, res) => {
    try {
      await uploadOldFile(req, res);

      var file_path = req.file ? req.file.path : null;

      const formData = { ...req.body, file_path };

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

      const resData = await this.studentReportFileController.create(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadOldFile(req, res);

      var file_path = req.file ? req.file.path : null;
      let formData;

      if (file_path) formData = { ...req.body, file_path };
      else formData = { ...req.body };

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

      var id = req.params.id;

      const resData = await this.studentReportFileController.update(
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

      const resData = await this.studentReportFileController.showOne(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const { employee } = req.user;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const offset = limit * page;

      const {
        search_query,
        class_id,
        student_id,
        academic,
        semester,
        with_assign,
      } = req.query;

      let class_ids = [];
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(
          0,
          undefined,
          { search: "", employee_id: employee.id },
          0
        );
        class_ids =
          empClasses.response?.data?.result
            ?.map((c) => c.id ?? "")
            .filter((c) => c != "") ?? [];
      }

      const resData = await this.studentReportFileController.showPage(
        page,
        limit,
        offset,
        {
          search: search_query,
          student_id,
          academic,
          semester,
          class_ids: class_id ? [class_id] : class_ids,
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

      const resData = await this.studentReportFileController.delete(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  downloadFile = async (req, res) => {
    try {
      const filePath = req.query.file_path;

      if (!filePath) {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: "File path not provided.",
        });
      }

      if (fs.existsSync(filePath)) {
        const filename = path.basename(filePath);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );

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

module.exports = StudentReportFileController;

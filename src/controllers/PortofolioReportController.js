const httpStatus = require("http-status");
const PortofolioReportService = require("../service/PortofolioReportService");
const PortofolioReportDao = require("../dao/PortofolioReportDao");
const logger = require("../config/logger");

const uploadPortofolio = require("../middlewares/uploadPortofolio");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const schema = Joi.object({
  student_report_id: Joi.number().required(),
  parent_path: Joi.string().allow("", null),
  teacher_path: Joi.string().allow("", null),
  merged_path: Joi.string().allow("", null),
});

class PortofolioReportController {
  constructor() {
    this.portofolioReportService = new PortofolioReportService();
    this.portofolioReportDao = new PortofolioReportDao();
  }

  create = async (req, res) => {
    let resData = {};

    try {
      await uploadPortofolio(req, res);

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
        return res.status(httpStatus.BAD_REQUEST).send(errorMessage); // Send error response and return
      }

      const checkExistance =
        await this.portofolioReportDao.getByStudentReportId(
          formData.student_report_id,
          formData.type
        );

      if (checkExistance) {
        resData = await this.portofolioReportService.updatePortofolioReport(
          checkExistance.id,
          formData
        );

        return res.status(resData.statusCode).send(resData.response); // Send response and return
      }

      resData = await this.portofolioReportService.createPortofolioReport(
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
      await uploadPortofolio(req, res);

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
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }

      var id = req.params.id;

      const resData = await this.portofolioReportService.updatePortofolioReport(
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

      const resData = await this.portofolioReportService.showPortofolioReport(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showOneByStudentReportId = async (req, res) => {
    try {
      const id = req.params.id;
      const type = req.query.type || "";

      const resData =
        await this.portofolioReportService.showPortofolioReportByStudentReportId(
          id,
          type
        );
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAllByStudentReportId = async (req, res) => {
    try {
      const id = req.params.id;
      const type = req.query.type || "";

      const resData =
        await this.portofolioReportService.showAllPortofolioReportByStudentReportId(
          id,
          type
        );
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      const resData = await this.portofolioReportService.showPage(
        page,
        limit,
        search,
        offset
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

      const resData = await this.portofolioReportService.deletePortofolioReport(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  merge = async (req, res) => {
    try {
      const id = req.params.id;

      const resData = await this.portofolioReportService.mergePortofolioReport(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send({
        level: 'error',
        message: e.message
      });
    }
  };

  downloadPortofolioReport = async (req, res) => {
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

  filtered = async (req, res) => {
    try {
      const academic = req.query.academic || "";
      const semester = req.query.semester || "";
      const classId = req.query.class_id || "";

      const resData =
        await this.portofolioReportService.filteredPortofolioReport(
          academic,
          semester,
          classId
        );
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = PortofolioReportController;

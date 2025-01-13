const httpStatus = require("http-status");
const AnnouncementService = require("../service/AnnouncementService");
const logger = require("../config/logger");
const ClassesService = require("../service/ClassesService");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const schema = Joi.object({
  class_id: Joi.number().allow(null),
  date_start: Joi.string().required(),
  date_end: Joi.string().required(),
  announcement_desc: Joi.string().required(),
});

class AnnouncementController {
  constructor() {
    this.announcementService = new AnnouncementService();
    this.classService = new ClassesService();
  }

  create = async (req, res) => {
    try {
      if (req.file) {
        req.body.file_path = req.file.path
        req.body.file_type = req.file.mimetype
      }

      const resData = await this.announcementService.createAnnouncement(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params

      if (req.file) {
        req.body.file_path = req.file.path
        req.body.file_type = req.file.mimetype
      }

      const resData = await this.announcementService.updateAnnouncement(
        id,
        req.body
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

      const resData = await this.announcementService.showAnnouncement(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClass = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.announcementService.showByClass(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  showBetween = async (req, res) => {
    try {
      const start = req.query.start;
      const end = req.query.end;
      const class_id = req.query.class_id || "";

      const resData = await this.announcementService.showAnnouncementBetween(
        start,
        end,
        class_id
      );

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
      const search = req.query.search_query || "";
      const offset = limit * page;
      const { start_date, end_date, class_id, with_assign } = req.query;
      const resData = await this.announcementService.showPage(
        page,
        limit,
        search,
        offset,
        {
          start_date,
          end_date,
          class_id,
          with_assign,
          employee
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

      const resData = await this.announcementService.deleteAnnouncement(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  downloadFile = async (req, res) => {
    try {
      const data = await this.announcementService.showAnnouncement(
        req.params.id
      );
      const filePath = data.response.data.file_path;

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
}

module.exports = AnnouncementController;

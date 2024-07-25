const httpStatus = require("http-status");
const AnnouncementService = require("../service/AnnouncementService");
const logger = require("../config/logger");
const ClassesService = require("../service/ClassesService");

class AnnouncementController {
  constructor() {
    this.announcementService = new AnnouncementService();
    this.classService = new ClassesService()
  }

  create = async (req, res) => {
    try {
      const resData = await this.announcementService.createAnnouncement(
        req.body
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

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
  };

  showBetween = async (req, res) => {
    try {
      const start = req.query.start;
      const end = req.query.end;
      const class_id = req.query.class_id || ""

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
      const { employee } = req.user
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const { start_date, end_date, class_id, with_assign } = req.query

      let class_ids = []
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(0, undefined, { search: "", employee_id: employee.id }, 0)
        class_ids = empClasses.response?.data?.result?.map(c => c.id ?? "").filter(c => c != "") ?? []
      }

      const resData = await this.announcementService.showPage(
        page,
        limit,
        search,
        offset,
        {
          start_date,
          end_date,
          class_id,
          class_ids
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
}

module.exports = AnnouncementController;

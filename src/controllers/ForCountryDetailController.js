const httpStatus = require("http-status");
const ForCountryDetailService = require("../service/ForCountryDetailService");
const logger = require("../config/logger");
const uploadForCountry = require("../middlewares/uploadForCountry");

const path = require("path");
const fs = require("fs");
const ClassesService = require("../service/ClassesService");

class ForCountryDetailController {
  constructor() {
    this.forCountryDetailService = new ForCountryDetailService();
    this.classService = new ClassesService();
  }

  create = async (req, res) => {
    try {
      await uploadForCountry(req, res);
      const certificate_path = req.file ? req.file.path : null;
      req.body['certificate_path'] = certificate_path
      console.log("HELLO")
      console.log(req.body)
      const resData = await this.forCountryDetailService.createForCountryDetail(req.body);
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      console.log(req.body)
      await uploadForCountry(req, res);
      console.log(req.body)


      const certificate_path = req.file ? req.file.path : null;
      req.body['certificate_path'] = certificate_path


      const resData = await this.forCountryDetailService.updateForCountryDetail(
        +req.params.id, req.body
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

      const resData = await this.forCountryDetailService.showForCountryDetail(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByUserId = async (req, res) => {
    try {
      const id = req.params.id;
      const academic = req.query.academic || "";

      const resData =
        await this.forCountryDetailService.showForCountryDetailByUserId(
          id,
          academic
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByDate = async (req, res) => {
    try {
      let { date, month, year } = req.query
      if (!month) month = new Date().getMonth + 1
      month = month.padStart(2, "0")
      if(date) date = date.padStart(2, "0")

      const resData = await this.forCountryDetailService.showByDate(date, month, year)
      res.status(resData.statusCode).send(resData.response)
    } catch (e) {
      logger.error(e)
      res.status(httpStatus.BAD_GATEWAY).send(e)
    }
  }



  showAll = async (req, res) => {
    try {
      const { employee } = req.user
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const { class_id, with_assign } = req.query

      let class_ids = []
      if (employee && with_assign == "Y") {
        const empClasses = await this.classService.showPage(0, undefined, { search: "", employee_id: employee.id }, 0)
        class_ids = empClasses.response?.data?.result?.map(c => c.id ?? "").filter(c => c != "") ?? []
      }

      const resData = await this.forCountryDetailService.showPage(
        page,
        limit,
        search,
        offset,
        {
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

      const resData = await this.forCountryDetailService.deleteForCountryDetail(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  downloadForCountryDetail = async (req, res) => {
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
}

module.exports = ForCountryDetailController;

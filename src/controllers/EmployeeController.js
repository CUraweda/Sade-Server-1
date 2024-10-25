const httpStatus = require("http-status");
const EmployeeService = require("../service/EmployeeService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.employeeService.createEmployee(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.employeeService.updateEmployee(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      const id = req.params.id;

      const resData = await this.employeeService.showEmployee(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAllIsGuru = async (req, res) => {
    try {
      var isGuru = req.query.is_initial || "";

      const resData = await this.employeeService.showEmployeeIsGuru(isGuru);

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
      const isGuru = req.query.guru
      const isAssign = req.query.isAssign
      const offset = limit * page;

      const resData = await this.employeeService.showPage(
        page,
        limit,
        { search, isGuru, isAssign },
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

      const resData = await this.employeeService.deleteEmployee(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.employeeService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

}

module.exports = EmployeeController;

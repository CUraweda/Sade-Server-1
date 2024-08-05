const httpStatus = require("http-status");
const StudentService = require("../service/StudentService");
const ParentService = require("../service/ParentService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class StudentController {
  constructor() {
    this.studentService = new StudentService();
    this.parentService = new ParentService()
  }

  create = async (req, res) => {
    try {
      const resData = await this.studentService.createStudent(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.studentService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importJSON = async (req, res) => {
    const { json_data } = req.body
    const { candidate, parents } = json_data

    const studentResponse = await this.studentService.createStudent(candidate)
    for (let parentData of Object.values(parents)) await this.parentService.createParent(parentData)

    res.status(studentResponse.statusCode).send(studentResponse.response);
  }

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentService.updateStudent(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.studentService.showStudent(id);

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

      const resData = await this.studentService.showPage(
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

      const resData = await this.studentService.deleteStudent(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showNis = async (req, res) => {
    try {
      var nis = req.params.id;
      const { dob } = req.query
      if(!dob) throw Error('Tolong kirimkan Tanggal Lahir Siswa')
      const resData = await this.studentService.showByNis(nis, dob);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = StudentController;

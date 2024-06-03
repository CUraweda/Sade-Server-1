const httpStatus = require("http-status");
const StudentAttendanceService = require("../service/StudentAttendanceService");
const logger = require("../config/logger");
const uploadExcel = require("../middlewares/uploadExcel");

class StudentAttendanceController {
  constructor() {
    this.studentAttendanceService = new StudentAttendanceService();
  }

  create = async (req, res) => {
    try {
      const resData =
        await this.studentAttendanceService.createStudentAttendance(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createBulk = async (req, res) => {
    try {
      const resData =
        await this.studentAttendanceService.createStudentAttendanceBulk(
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

      const resData =
        await this.studentAttendanceService.updateStudentAttendance(
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

      const resData = await this.studentAttendanceService.showStudentAttendance(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData =
        await this.studentAttendanceService.showStudentAttendanceByStudentId(
          id
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByClassNDate = async (req, res) => {
    try {
      const class_id = req.params.id;
      const att_date = req.query.att_date || "";

      const resData =
        await this.studentAttendanceService.showStudentAttendanceByClassIdNDate(
          class_id,
          att_date
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByStudentIdMonth = async (req, res) => {
    try {
      var id = req.params.id;
      const year = req.query.year || "";
      const month = req.query.month || "";

      const resData =
        await this.studentAttendanceService.showStudentAttendanceByStudentIdMonth(
          id,
          year,
          month
        );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
  //menampilkan rekap kehadiran siswa berdasarkan id siswa dan semester dengan kondisi status aktif "Ya" (sebagai pengganti filter tahun ajaran)
  //karena hanya akan menampilkan siswa dengan tahun ajaran yang sedang berjalan
  showRecapByStudent = async (req, res) => {
    try {
      var id = req.params.id;
      const semester = req.query.semester || "";
      const academic = req.query.academic || "";

      const resData =
        await this.studentAttendanceService.showRecapStudentAttendance(
          id,
          semester,
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
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      const resData = await this.studentAttendanceService.showPage(
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

      const resData =
        await this.studentAttendanceService.deleteStudentAttendance(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.studentAttendanceService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = StudentAttendanceController;

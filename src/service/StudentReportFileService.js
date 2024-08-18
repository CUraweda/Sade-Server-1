const httpStatus = require("http-status");
const StudentReportFileDao = require("../dao/StudentReportFileDao");
const responseHandler = require("../helper/responseHandler");

class StudentReportFileService {
  constructor() {
    this.studentReportFileDao = new StudentReportFileDao();
  }

  create = async (body) => {
    const data = await this.studentReportFileDao.create(body);
    if (!data)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Data rapor siswa Gagal dibuat"
      );

    return responseHandler.returnSuccess(
      httpStatus.CREATED,
      "Data rapor siswa Berhasil dibuat",
      data
    );
  };

  update = async (id, body) => {
    const dataExist = await this.studentReportFileDao.findById(id);
    if (!dataExist)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Data rapor siswa Tidak Ada"
      );

    const data = await this.studentReportFileDao.updateWhere(body, { id });
    if (!data)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Data rapor siswa Gagal diperbaharui"
      );

    return responseHandler.returnSuccess(
      httpStatus.CREATED,
      "Data rapor siswa Berhasil diperbaharui",
      {}
    );
  };

  delete = async (id) => {
    const data = await this.studentReportFileDao.deleteByWhere({ id });
    if (!data)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Data rapor siswa Gagal dihapus"
      );

    return responseHandler.returnSuccess(
      httpStatus.CREATED,
      "Data rapor siswa Berhasil dihapus",
      {}
    );
  };

  showPage = async (page, limit, offset, filters) => {
    const totalRows = await this.studentReportFileDao.getCount(filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentReportFileDao.getPage(
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Data rapor siswa Berhasil diambil",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  };

  showOne = async (id) => {
    const data = await this.studentReportFileDao.findById(id);
    if (!data)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Data rapor siswa Tidak ditemukan"
      );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Data rapor siswa Ditemukan",
      data
    );
  };
}

module.exports = StudentReportFileService;

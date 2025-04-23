const httpStatus = require("http-status");
const StudentDao = require("../dao/StudentDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

class StudentService {
  constructor() {
    this.studentDao = new StudentDao();
  }

  createStudent = async (reqBody) => {
    try {
      let message = "Student successfully added.";
      const nis = reqBody.nis
      let nis_validator = await this.studentDao.findOneByWhere({nis})
      if (nis_validator) {
        message = "NIS already exists";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }
      const nisn = reqBody.nisn
      if(nis){
        let nisn_validator = await this.studentDao.findOneByWhere({nisn})
        if (nisn_validator) {
          message = "NISN already exists";
          return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
        }
      }

      let data = await this.studentDao.create(reqBody);

      if (!data) {
        message = "Failed to add student.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  importFromExcel = async (req) => {
    try {
      let message = "Student successfully added.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      let data = await this.studentDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add student.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateStudent = async (id, body) => {
    const message = "Student successfully updated!";

    let dt = await this.studentDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student year not found!",
        {}
      );
    }

    const updateData = await this.studentDao.updateWhere(
      {
        nis: body.nis,
        nisn: body.nisn,
        full_name: body.full_name,
        nickname: body.nickname,
        gender: body.gender,
        pob: body.pob,
        dob: body.dob,
        nationality: body.nationality,
        religion: body.religion,
        address: body.address,
        level: body.level,
        class: body.class,
        is_active: body.is_active,
        is_transfer: body.is_transfer,
        category: body.category,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showStudent = async (id) => {
    const message = "Student successfully retrieved!";

    let dt = await this.studentDao.getById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.studentDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentDao.getStudentPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteStudent = async (id) => {
    const message = "Student successfully deleted!";

    let dt = await this.studentDao.deleteByWhere({ id });

    if (!dt) {
      return responseHandler.returnSuccess(httpStatus.OK, "Student not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  showByNis = async (nis, dob) => {
    const message = "Student successfully retrieved!";
    if (dob === "") return responseHandler.returnError(httpStatus.BAD_REQUEST, "Tolong sertakan tanggal lahir siswa")
    let dt = await this.studentDao.findByNis(nis, dob);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };
  
  async exportPage(search) {
    const result = await this.studentDao.getStudentPage(search, undefined, undefined)

    const sheet = result.map((dat, i) => ({
      No: i + 1,
      "Nama lengkap": dat.full_name ?? '',
      "Nama panggilan": dat.nickname ?? '',
      "NIS": dat.nis ?? '',
      "NISN": dat.nisn ?? '',
      "Jenis kelamin": dat.gender ?? '',
      "Tempat lahir": dat.pob ?? '',
      "Tanggal lahir": dat.dob ?? '',
      "Kewarganegaraan": dat.nationality ?? '',
      "Agama": dat.religion ?? '',
      "Alamat": dat.address ?? '',
      "Siswa pindahan": dat.is_transfer ?? '',
      "Kategori": dat.category ?? '',
      "Tingkat": dat.level ?? '',
      "Kelas": dat.class ?? '',
      "Status": dat.is_active ?? '',
    }))

    
    const worksheet = xlsx.utils.json_to_sheet(sheet);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

    return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });  
  }
}

module.exports = StudentService;


const httpStatus = require("http-status");
const SubjectDao = require("../dao/SubjectDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class SubjectService {
  constructor() {
    this.subjectDao = new SubjectDao();
  }

  createSubject = async (reqBody) => {
    try {
      let message = "Subject successfully added.";

      let data = await this.subjectDao.create(reqBody);

      if (!data) {
        message = "Failed to create subject.";
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

  updateSubject = async (id, body) => {
    const message = "Subject successfully updated!";

    let rel = await this.subjectDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Subject not found!",
        {}
      );
    }

    const updateData = await this.subjectDao.updateWhere(
      {
        level: body.level,
        code: body.code,
        name: body.name,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showSubject = async (id) => {
    const message = "Subject successfully retrieved!";

    let rel = await this.subjectDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Subject not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, filter, offset) {
    const totalRows = await this.subjectDao.getCount(filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.subjectDao.getSubjectPage(filter, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Subject successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  subjects = [
    {
      level: "SMP",
      code: "PAI",
      name: "Pendidikan Agama",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "PKN",
      name: "Pendidikan Kewarganegaraan",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "IND",
      name: "Bahasa Indonesia",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "MTK",
      name: "Matematika",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "IPA",
      name: "Ilmu Pengetahuan Alam",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "IPS",
      name: "Ilmu Pengetahuan Sosial",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "KES",
      name: "Seni Budaya dan Keterampilan",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "PENJAS",
      name: "Pendidikan Jasmani, Olahraga dan Kesehatan",
      threshold: 7.5,
    },
    {
      level: "SMP",
      code: "ING",
      name: "Bahasa Inggris",
      threshold: 7.5,
    },
  ]

  deleteSubject = async (id) => {
    const message = "Subject successfully deleted!";

    let rel = await this.subjectDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Subject not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = SubjectService;

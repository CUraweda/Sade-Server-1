const httpStatus = require("http-status");
const NarrativeCommentDao = require("../dao/NarrativeCommentDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class NarrativeCommentService {
  constructor() {
    this.narrativeCommentDao = new NarrativeCommentDao();
  }

  createNarrativeComment = async (reqBody) => {
    try {
      let message = "Narrative comment successfully added.";

      let data = await this.narrativeCommentDao.create(reqBody);

      if (!data) {
        message = "Failed to create narrative comment.";
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

  updateNarrativeComment = async (id, body) => {
    const message = "Narrative comment successfully updated!";

    let cl = await this.narrativeCommentDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative comment not found!",
        {}
      );
    }

    const updateData = await this.narrativeCommentDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNarrativeComment = async (id) => {
    const message = "Narrative comment successfully retrieved!";

    let cl = await this.narrativeCommentDao.findById(id);
    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative comment not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showNarrativeCommentByStudentId = async (id, semester, academic) => {
    const message = "Narrative comment successfully retrieved!";

    let cl = await this.narrativeCommentDao.findByStudentId(
      id,
      semester,
      academic
    );

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative comment not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showNarrativeCommentByStudentReportId = async (id) => {
    const message = "Narrative comment successfully retrieved!";

    let cl = await this.narrativeCommentDao.findByStudentReportId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative comment not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  deleteNarrativeComment = async (id) => {
    const message = "Narrative comment successfully deleted!";

    let cl = await this.narrativeCommentDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative comment not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = NarrativeCommentService;

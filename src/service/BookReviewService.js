const httpStatus = require("http-status");
const BookReviewDao = require("../dao/BookReviewDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class BookReviewService {
  constructor() {
    this.bookReviewDao = new BookReviewDao();
  }

  createBookReview = async (reqBody) => {
    try {
      let message = "Book review successfully added.";

      let data = await this.bookReviewDao.create(reqBody);

      if (!data) {
        message = "Failed to create book review.";
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

  updateBookReview = async (id, body) => {
    const message = "Book review successfully updated!";

    let cl = await this.bookReviewDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book review not found!",
        {}
      );
    }

    const updateData = await this.bookReviewDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showBookReview = async (id) => {
    const message = "Book review successfully retrieved!";

    let cl = await this.bookReviewDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book review not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showAllBookReviewByBookId = async (id) => {
    const message = "Book review successfully retrieved!";

    let cl = await this.bookReviewDao.getAllByBookId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book review not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.bookReviewDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.bookReviewDao.getBookReviewPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Book review successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteBookReview = async (id) => {
    const message = "Book review successfully deleted!";

    let cl = await this.bookReviewDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book review not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = BookReviewService;

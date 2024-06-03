const httpStatus = require("http-status");
const BookSliderDao = require("../dao/BookSliderDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class BookSliderService {
  constructor() {
    this.bookSliderDao = new BookSliderDao();
  }

  createBookSlider = async (reqBody) => {
    try {
      let message = "Book slider successfully added.";

      let data = await this.bookSliderDao.create(reqBody);

      if (!data) {
        message = "Failed to create book slider.";
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

  updateBookSlider = async (id, body) => {
    const message = "Book slider successfully updated!";

    let cl = await this.bookSliderDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book slider not found!",
        {}
      );
    }

    const updateData = await this.bookSliderDao.updateWhere(
      {
        path: body.path,
        title: body.title,
        writer: body.writer,
        publisher: body.publisher,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showBookSlider = async (id) => {
    const message = "Book slider successfully retrieved!";

    let cl = await this.bookSliderDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book slider not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showAllBookSlider = async (id) => {
    const message = "Book slider successfully retrieved!";

    let cl = await this.bookSliderDao.findAll();

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book slider not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.bookSliderDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.bookSliderDao.getBookSliderPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Book slider successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteBookSlider = async (id) => {
    const message = "Book slider successfully deleted!";

    let cl = await this.bookSliderDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book slider not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = BookSliderService;

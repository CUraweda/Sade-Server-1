const httpStatus = require("http-status");
const BookCategoryDao = require("../dao/BookCategoryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class BookCategoryService {
  constructor() {
    this.bookCategoryDao = new BookCategoryDao();
  }

  createBookCategory = async (reqBody) => {
    try {
      let message = "Book Category successfully added.";

      let data = await this.bookCategoryDao.create(reqBody);

      if (!data) {
        message = "Failed to create Book Category.";
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

  updateBookCategory = async (id, body) => {
    const message = "Book Category successfully updated!";

    let cl = await this.bookCategoryDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book category not found!",
        {}
      );
    }

    const updateData = await this.bookCategoryDao.updateWhere(
      {
        code: body.code,
        category: body.category,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showBookCategory = async (id) => {
    const message = "Book Category successfully retrieved!";

    let cl = await this.bookCategoryDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book Category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.bookCategoryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.bookCategoryDao.getBookCategoryPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Book Category successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteBookCategory = async (id) => {
    const message = "BookC ategory successfully deleted!";

    let cl = await this.bookCategoryDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book Category not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = BookCategoryService;

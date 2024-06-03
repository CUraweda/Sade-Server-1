const httpStatus = require("http-status");
const BorrowBookDao = require("../dao/BorrowBookDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class BorrowBookService {
  constructor() {
    this.borrowBookDao = new BorrowBookDao();
  }

  createBorrowBook = async (reqBody) => {
    try {
      let message = "Borrow Book successfully added.";

      let data = await this.borrowBookDao.create(reqBody);

      if (!data) {
        message = "Failed to create Borrow Book.";
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

  updateBorrowBook = async (id, body) => {
    const message = "Borrow Book successfully updated!";

    let rel = await this.borrowBookDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Borrow Book not found!",
        {}
      );
    }

    const updateData = await this.borrowBookDao.updateWhere(
      {
        student_id: body.student_id,
        book_id: body.book_id,
        start_date: body.start_date,
        end_date: body.end_date,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showBorrowBook = async (id) => {
    const message = "Borrow Book successfully retrieved!";

    let rel = await this.borrowBookDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Borrow Book not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showBorrowBookByStudentId = async (id, category) => {
    const message = "Borrow Book successfully retrieved!";

    let rel = await this.borrowBookDao.getByStudentId(id, category);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Borrow Book not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.borrowBookDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.borrowBookDao.getBorrowBookPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Borrow Book successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteBorrowBook = async (id) => {
    const message = "Borrow Book successfully deleted!";

    let rel = await this.borrowBookDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Borrow Book not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showBorrowBookRecapByStudent = async (id) => {
    const message = "Borrow Book successfully retrieved!";

    let rel = await this.borrowBookDao.recapByCategoryByStudentId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Borrow Book not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = BorrowBookService;

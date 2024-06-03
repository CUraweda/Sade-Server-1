const httpStatus = require("http-status");
const BookDao = require("../dao/BookDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");
const xlsx = require("xlsx");

class BookService {
  constructor() {
    this.bookDao = new BookDao();
  }

  createBook = async (body) => {
    try {
      let message = "Book successfully added.";

      let data = await this.bookDao.create(body);

      if (!data) {
        message = "Failed to create book.";
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

  updateBook = async (id, body) => {
    const message = "Book successfully updated!";

    let rel = await this.bookDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book not found!",
        {}
      );
    }
    console.log(body);
    const updateData = await this.bookDao.updateById(body, id);
    //KONDISI UPDATE DATA MASIH MENGHAPUS FILE EKSISTING KETIKA COVER DIISI KOSONG, HARUSNYA TIDAK DIHAPUS
    const rData = rel.dataValues;

    if (rData.cover) {
      // console.log(rData.cover);
      if (body.cover) {
        fs.unlink(rData.cover, (err) => {
          if (err) {
            return responseHandler.returnError(
              httpStatus.NOT_FOUND,
              "Cannot delete attachment!"
            );
          }
          console.log("Delete File successfully.");
        });
      }
    }

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showBook = async (id) => {
    const message = "Book successfully retrieved!";

    let rel = await this.bookDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.bookDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.bookDao.getBookPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Book successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteBook = async (id) => {
    const message = "Book successfully deleted!";

    let rel = await this.bookDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "Book not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Books successfully imported.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      let data = await this.bookDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add books.";
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
}

module.exports = BookService;

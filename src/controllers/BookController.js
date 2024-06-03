const httpStatus = require("http-status");
const BookService = require("../service/BookService");
const logger = require("../config/logger");
const uploadCover = require("../middlewares/uploadCover");
const Joi = require("joi");
const ApiError = require("../helper/ApiError");
const uploadExcel = require("../middlewares/uploadExcel");

const schema = Joi.object({
  book_cat_id: Joi.number().required(),
  title: Joi.string().required(),
  publisher: Joi.string().required(),
  writer: Joi.string().required(),
  qty: Joi.number().required(),
  category: Joi.string().required(),
  cover: Joi.string().allow("", null),
});

class BookController {
  constructor() {
    this.bookService = new BookService();
  }

  create = async (req, res, next) => {
    try {
      await uploadCover(req, res);

      const cover = req.file ? req.file.path : null;

      const formData = { ...req.body, cover };

      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }

      const resData = await this.bookService.createBook(formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadCover(req, res);

      const cover = req.file ? req.file.path : null;
      let formData;

      if (cover) formData = { ...req.body, cover };
      else formData = { ...req.body };

      const { error } = schema.validate(formData, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details
          .map((details) => {
            return details.message;
          })
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }

      var id = req.params.id;

      const resData = await this.bookService.updateBook(id, formData);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.bookService.showBook(id);

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

      const resData = await this.bookService.showPage(
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

      const resData = await this.bookService.deleteBook(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      await uploadExcel(req, res);

      const resData = await this.bookService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = BookController;

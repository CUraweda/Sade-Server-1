const httpStatus = require("http-status");
const TransactionJournalDao = require("../dao/TransactionJournalDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class TransactionJournalService {
  constructor() {
    this.transactionJournalDao = new TransactionJournalDao();
  }

  createTransactionJournal = async (reqBody) => {
    try {
      let message = "Transaction Journal successfully added.";

      let data = await this.transactionJournalDao.create(reqBody);

      if (!data) {
        message = "Failed to create transaction Journal.";
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

  updateTransactionJournal = async (id, body) => {
    const message = "Transaction Journal successfully updated!";

    let rel = await this.transactionJournalDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Transaction Journal not found!",
        {}
      );
    }

    const updateData = await this.transactionJournalDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showTransactionJournal = async (id) => {
    const message = "Transaction Journal successfully retrieved!";

    let rel = await this.transactionJournalDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Transaction Journal not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.transactionJournalDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.transactionJournalDao.getTransactionJournalPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Transaction Journal successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteTransactionJournal = async (id) => {
    const message = "Transaction Journal successfully deleted!";

    let rel = await this.transactionJournalDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Transaction Journal not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = TransactionJournalService;

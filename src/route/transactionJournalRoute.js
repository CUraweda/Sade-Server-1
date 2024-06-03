const express = require("express");
const TransactionJournalController = require("../controllers/TransactionJournalController");
const TransactionJournalValidator = require("../validator/TransactionJournalValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const transactionJournalController = new TransactionJournalController();
const transactionJournalValidator = new TransactionJournalValidator();

router.post(
  "/create",
  auth([1, 2]),
  transactionJournalValidator.transactionJournalCreateUpdateValidator,
  transactionJournalController.create
);

router.put(
  "/update/:id",
  auth([1, 2]),
  transactionJournalValidator.transactionJournalCreateUpdateValidator,
  transactionJournalController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  transactionJournalController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), transactionJournalController.showAll);

router.delete("/delete/:id", auth([1, 2]), transactionJournalController.delete);

module.exports = router;

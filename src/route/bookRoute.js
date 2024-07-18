const express = require("express");
const BookController = require("../controllers/BookController");
const BookValidator = require("../validator/BookValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const bookController = new BookController();
const bookValidator = new BookValidator();

router.post(
  "/create",
  auth([1, 3]),
  // bookValidator.bookCreateUpdateValidator,
  bookController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  // bookValidator.bookCreateUpdateValidator,
  bookController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), bookController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), bookController.showAll);

router.delete("/delete/:id", auth([1, 3]), bookController.delete);

router.post("/import", auth([1, 3]), bookController.importExcel);

module.exports = router;

const express = require("express");
const BookReviewController = require("../controllers/BookReviewController");
const BookReviewValidator = require("../validator/BookReviewValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const bookReviewController = new BookReviewController();
const bookReviewValidator = new BookReviewValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookReviewValidator.bookReviewCreateUpdateValidator,
  bookReviewController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookReviewValidator.bookReviewCreateUpdateValidator,
  bookReviewController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookReviewController.show
);

router.get(
  "/show-by-book/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookReviewController.showAllByBookId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), bookReviewController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookReviewController.delete
);

module.exports = router;

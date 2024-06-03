const express = require("express");
const BookCategoryController = require("../controllers/BookCategoryController");
const BookCategoryValidator = require("../validator/BookCategoryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const bookCategoryController = new BookCategoryController();
const bookCategoryValidator = new BookCategoryValidator();

router.post(
  "/create",
  auth([1, 3]),
  bookCategoryValidator.bookCategoryCreateUpdateValidator,
  bookCategoryController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  bookCategoryValidator.bookCategoryCreateUpdateValidator,
  bookCategoryController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  bookCategoryController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), bookCategoryController.showAll);

router.delete("/delete/:id", auth([1]), bookCategoryController.delete);

module.exports = router;

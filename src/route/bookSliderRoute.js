const express = require("express");
const BookSliderController = require("../controllers/BookSliderController");
const BookSliderValidator = require("../validator/BookSliderValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const bookSliderController = new BookSliderController();
const bookSliderValidator = new BookSliderValidator();

router.post(
  "/create",
  auth([1, 3]),
  bookSliderValidator.bookSliderCreateUpdateValidator,
  bookSliderController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  bookSliderValidator.bookSliderCreateUpdateValidator,
  bookSliderController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
  bookSliderController.show
);

// router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), bookSliderController.showAll);

router.get(
  "/show-all",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  bookSliderController.showAll
);

router.delete("/delete/:id", auth([1, 3]), bookSliderController.delete);

module.exports = router;

const express = require("express");
const ForCountryDetailController = require("../controllers/ForCountryDetailController");
const ForCountryDetailValidator = require("../validator/ForCountryDetailValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const forCountryDetailController = new ForCountryDetailController();
const validator = new ForCountryDetailValidator()

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  validator.forCountryDetailsCreateUpdateValidator,
  forCountryDetailController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  validator.forCountryDetailsCreateUpdateValidator,
  forCountryDetailController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.show
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.showByUserId
);

router.get(
  '/show-by-date',
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.showByDate
)

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.showAll
);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.delete
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  forCountryDetailController.downloadForCountryDetail
);

module.exports = router;

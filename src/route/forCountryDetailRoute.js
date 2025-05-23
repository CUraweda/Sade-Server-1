const express = require("express");
const ForCountryDetailController = require("../controllers/ForCountryDetailController");
const ForCountryDetailValidator = require("../validator/ForCountryDetailValidator");

const router = express.Router();
const auth = require("../middlewares/auth");
const uploadFileMiddleware = require("../middlewares/uploadForCountryDetail");

const forCountryDetailController = new ForCountryDetailController();
const validator = new ForCountryDetailValidator()

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  validator.forCountryDetailsCreateUpdateValidator,
  forCountryDetailController.create
);

router.post(
  "/add",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  validator.forCountryDetailAddValidator,
  forCountryDetailController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  validator.forCountryDetailsCreateUpdateValidator,
  forCountryDetailController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryDetailController.show
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryDetailController.showByUserId
);

router.get(
  '/show-by-date',
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryDetailController.showByDate
)
router.get(
  '/show-total',
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]),
  forCountryDetailController.showTotalStatus
)

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 13]),
  forCountryDetailController.showAll
);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryDetailController.delete
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryDetailController.downloadForCountryDetail
);

module.exports = router;

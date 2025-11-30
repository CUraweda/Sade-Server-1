const express = require("express");
const ForCountryController = require("../controllers/ForCountryController");
// const ForCountryValidator = require("../validator/ForCountryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const forCountryController = new ForCountryController();
// const forCountryValidator = new ForCountryValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  //   forCountryValidator.forCountryCreateUpdateValidator,
  forCountryController.create
);
router.post(
  "/create-bulk",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  //   forCountryValidator.forCountryCreateUpdateValidator,
  forCountryController.createBulk
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  //   forCountryValidator.forCountryCreateUpdateValidator,
  forCountryController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryController.show
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryController.showByUserId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), forCountryController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  forCountryController.delete
);

module.exports = router;

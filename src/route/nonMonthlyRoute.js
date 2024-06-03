const express = require("express");
const NonMonthlyController = require("../controllers/NonMonthlyController");
const NonMonthlyValidator = require("../validator/NonMonthlyValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const nonMonthlyController = new NonMonthlyController();
const nonMonthlyValidator = new NonMonthlyValidator();

// router.post(
//   "/create",
//   auth([1]),
//   //   nonMonthlyValidator.nonMonthlyCreateUpdateValidator,
//   nonMonthlyController.create
// );

router.post(
  "/generate-billing",
  auth([1, 2]),
  nonMonthlyValidator.nonMonthlyGenerateValidator,
  nonMonthlyController.generateClass
);

router.put(
  "/update/:id",
  auth([1, 2]),
  //   nonMonthlyValidator.nonMonthlyUpdateValidator,
  nonMonthlyController.update
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  nonMonthlyController.show
);

router.get(
  "/download/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  nonMonthlyController.fileDownload
);

// router.get("/", auth([1]), nonMonthlyController.showAll);

// router.delete("/delete/:id", auth([1]), nonMonthlyController.delete);

module.exports = router;

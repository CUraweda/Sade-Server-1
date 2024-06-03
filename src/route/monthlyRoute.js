const express = require("express");
const MonthlyController = require("../controllers/MonthlyController");
const MonthlyValidator = require("../validator/MonthlyValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const monthlyController = new MonthlyController();
const monthlyValidator = new MonthlyValidator();

// router.post(
//   "/create",
//   auth([1]),
//   //   monthlyValidator.monthlyCreateUpdateValidator,
//   monthlyController.create
// );

router.post(
  "/generate-billing",
  auth([1, 2]),
  monthlyValidator.monthlyGenerateValidator,
  monthlyController.generateClass
);

router.put(
  "/update/:id",
  auth([1, 2]),
  //   monthlyValidator.monthlyUpdateValidator,
  monthlyController.update
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  monthlyController.show
);

router.get(
  "/download/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  monthlyController.fileDownload
);

// router.get("/", auth([1]), monthlyController.showAll);

// router.delete("/delete/:id", auth([1]), monthlyController.delete);

module.exports = router;

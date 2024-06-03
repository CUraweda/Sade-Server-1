const express = require("express");
const MonthController = require("../controllers/MonthController");
const MonthValidator = require("../validator/MonthValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const monthController = new MonthController();
const monthValidator = new MonthValidator();

router.post(
  "/create",
  auth([1]),
  monthValidator.monthCreateUpdateValidator,
  monthController.create
);

router.put(
  "/update/:id",
  auth([1]),
  monthValidator.monthCreateUpdateValidator,
  monthController.update
);

router.get("/show/:id", auth([1]), monthController.show);

router.get("/", auth([1]), monthController.showAll);

router.delete("/delete/:id", auth([1]), monthController.delete);

module.exports = router;

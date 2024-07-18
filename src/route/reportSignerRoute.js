const express = require("express");
const ReportSignerController = require("../controllers/ReportSignerController");
const ReportSignerValidator = require("../validator/ReportSignerValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const reportSignerController = new ReportSignerController();
const reportSignerValidator = new ReportSignerValidator();

router.post(
  "/create",
  auth([1, 3, 4, 6]),
  reportSignerValidator.reportSignerCreateUpdateValidator,
  reportSignerController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 4, 6]),
  reportSignerValidator.reportSignerCreateUpdateValidator,
  reportSignerController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  reportSignerController.show
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  reportSignerController.showByClassId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), reportSignerController.showAll);

router.delete("/delete/:id", auth([1, 3, 5, 6]), reportSignerController.delete);

module.exports = router;

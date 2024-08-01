const express = require("express");
const NumberReportController = require("../controllers/NumberReportController");
const NumberReportValidator = require("../validator/NumberReportValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const numberReportController = new NumberReportController();
const numberReportValidator = new NumberReportValidator();

router.post(
  "/create",
  auth([1, 6]),
  numberReportValidator.numberReportCreateUpdateValidator,
  numberReportController.create
);

router.post(
  "/create-bulk",
  auth([1, 6]),
  numberReportValidator.numberReportBulkCreateValidator,
  numberReportController.createBulk
);

router.put(
  "/update/:id",
  auth([1, 6]),
  numberReportValidator.numberReportCreateUpdateValidator,
  numberReportController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  numberReportController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), numberReportController.showAll);
router.delete("/delete/:id", auth([1, 6]), numberReportController.delete);
router.delete("/delete-all", auth([1, 6]), numberReportController.deleteAll);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  numberReportController.showByStudentId
);

router.post("/import", auth([1, 3, 6]), numberReportController.importExcel);

router.get(
  "/generate/:id",
  auth([1, 3, 6]),
  numberReportController.exportByStudentId
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  numberReportController.downloadNumberReport
);

router.get(
  "/filter-by-params",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  numberReportController.filtered
);

module.exports = router;

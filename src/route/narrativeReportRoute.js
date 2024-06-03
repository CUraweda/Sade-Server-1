const express = require("express");
const NarrativeReportController = require("../controllers/NarrativeReportController");
const NarrativeReportValidator = require("../validator/NarrativeReportValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const narrativeReportController = new NarrativeReportController();
const narrativeReportValidator = new NarrativeReportValidator();

router.post(
  "/create",
  auth([1, 6]),
  narrativeReportValidator.narrativeReportCreateUpdateValidator,
  narrativeReportController.create
);

router.put(
  "/update/:id",
  auth([1, 6]),
  narrativeReportValidator.narrativeReportCreateUpdateValidator,
  narrativeReportController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  narrativeReportController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), narrativeReportController.showAll);

router.delete("/delete/:id", auth([1, 6]), narrativeReportController.delete);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  narrativeReportController.showByStudentId
);

router.post("/import", auth([1, 3]), narrativeReportController.importExcel);

router.get(
  "/generate/:id",
  auth([1, 3, 6]),
  narrativeReportController.exportByStudentId
);

router.get(
  "/filter-by-params",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  narrativeReportController.filtered
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  narrativeReportController.downloadNarrativeReport
);

module.exports = router;

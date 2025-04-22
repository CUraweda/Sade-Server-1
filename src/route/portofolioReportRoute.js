const express = require("express");
const PortofolioReportController = require("../controllers/PortofolioReportController");
const PortofolioReportValidator = require("../validator/PortofolioReportValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const portofolioReportController = new PortofolioReportController();
const portofolioReportValidator = new PortofolioReportValidator();

router.post(
  "/create",
  auth([1, 3, 6, 8,11]),
    // portofolioReportValidator.portofolioReportCreateUpdateValidator,
  portofolioReportController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6, 8,11]),
  //   portofolioReportValidator.portofolioReportCreateUpdateValidator,
  portofolioReportController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.show
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.showAll
);

router.get(
  "/show-all-by-student-report/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.showAllByStudentReportId
);

router.get(
  "/filter-by-params",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.filtered
);

router.delete(
  "/delete/:id",
  auth([1, 3, 6, 8,11]),
  portofolioReportController.delete
);

router.put(
  "/merge/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.merge
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  portofolioReportController.downloadPortofolioReport
);

module.exports = router;

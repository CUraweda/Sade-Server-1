const express = require("express");
const StudentReportController = require("../controllers/StudentReportController");
const StudentReportValidator = require("../validator/StudentReportValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentReportController = new StudentReportController();
const studentReportValidator = new StudentReportValidator();

router.post(
  "/create",
  auth([1, 3, 4, 6, 8]),
  studentReportValidator.studentReportCreateValidator,
  studentReportController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 4, 6, 8]),
  studentReportValidator.studentReportUpdateValidator,
  studentReportController.update
);

router.put(
	'/update-access/:id',
	auth([1, 2, 3, 4]),
	studentReportController.updateAccess
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.show
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.showByClassId
);

router.get(
  "/show-by-student",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.showByStudentId
);

router.get(
  "/show-by-student-details",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.showByStudentIdDetails
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.showAll
);

router.delete(
  "/delete/:id",
  auth([1, 3, 4, 6]),
  studentReportController.delete
);

router.put(
  "/merge/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.merge
);

router.get(
  "/export-data/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.exportData
);

router.get(
  "/filter-by-params",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentReportController.filtered
);

module.exports = router;

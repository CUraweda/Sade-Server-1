const express = require("express");
const StudentAttendanceController = require("../controllers/StudentAttendanceController");
const StudentAttendanceValidator = require("../validator/StudentAttendanceValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentAttendanceController = new StudentAttendanceController();
const studentAttendanceValidator = new StudentAttendanceValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  studentAttendanceValidator.studentAttendanceCreateUpdateValidator,
  studentAttendanceController.create
);

router.post(
  "/create-bulk",
  auth([1, 3, 6]),
  // studentAttendanceValidator.studentAttendanceCreateUpdateValidator,
  studentAttendanceController.createBulk
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  studentAttendanceValidator.studentAttendanceCreateUpdateValidator,
  studentAttendanceController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentAttendanceController.show
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentAttendanceController.showByStudentId
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentAttendanceController.showByClassNDate
);

router.get(
  "/show-by-student-month/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentAttendanceController.showByStudentIdMonth
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), studentAttendanceController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 3, 6]),
  studentAttendanceController.delete
);

router.get(
  "/recap-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentAttendanceController.showRecapByStudent
);

router.post("/import", auth([1, 3]), studentAttendanceController.importExcel);

module.exports = router;

const express = require("express");
const StudentReportFileController = require("../controllers/StudentReportFileController");

const router = express.Router();
const auth = require("../middlewares/auth");
const isStudentParentValid = require("../middlewares/StudentParentValid");

const controller = new StudentReportFileController();

router.post("/create", auth([1, 6]), controller.create);

router.put("/update/:id", auth([1, 6]), controller.update);

router.get("/show/:id", auth([1, 3, 4, 6]), controller.show);

router.get("/", auth([1, 3, 4, 6]), controller.showAll);

router.get(
  "/show-by-student/:student_id",
  auth([7, 8]),
  isStudentParentValid("params", "student_id"),
  controller.showByStudent
);

router.delete("/delete/:id", auth([1, 6]), controller.delete);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  controller.downloadFile
);

module.exports = router;

const express = require("express");
const StudentController = require("../controllers/StudentController");
const StudentValidator = require("../validator/StudentValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentController = new StudentController();
const studentValidator = new StudentValidator();

router.post(
  "/create",
  auth([1, 3]),
  studentValidator.studentCreateUpdateValidator,
  studentController.create
);

router.post("/import", auth([1, 3]), studentController.importExcel);

router.put(
  "/update/:id",
  auth([1, 3]),
  studentValidator.studentCreateUpdateValidator,
  studentController.update
);

router.post(
  "/import-json",
  auth([1, 3]),
  studentValidator.studentExportData,
  studentController.importJSON
)

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), studentController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), studentController.showAll);

router.delete("/delete/:id", auth([1, 3]), studentController.delete);

router.get(
  "/show-nis/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  studentController.showNis
);

router.get(
  "/export",
   auth([1, 3]),
  studentController.export
)

module.exports = router;

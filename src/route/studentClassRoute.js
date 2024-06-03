const express = require("express");
const StudentClassController = require("../controllers/StudentClassController");
const StudentClassValidator = require("../validator/StudentClassValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentClassController = new StudentClassController();
const studentClassValidator = new StudentClassValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  studentClassValidator.studentClassCreateUpdateValidator,
  studentClassController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  studentClassValidator.studentClassCreateUpdateValidator,
  studentClassController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentClassController.show
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentClassController.showByClass
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8]), studentClassController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), studentClassController.delete);

router.get(
  "/show-by-level",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  studentClassController.showLevel
);

router.post("/import", auth([1, 3, 6]), studentClassController.importExcel);

module.exports = router;

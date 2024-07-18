const express = require("express");
const StudentTaskController = require("../controllers/StudentTaskController");
const StudentTaskValidator = require("../validator/StudentTaskValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentTaskController = new StudentTaskController();
const studentTaskValidator = new StudentTaskValidator();

router.post(
  "/create",
  auth([1, 6]),
  // studentTaskValidator.studentTaskCreateUpdateValidator,
  studentTaskController.create
);

router.post(
  "/create-by-class",
  auth([1, 6]),
  // studentTaskValidator.studentTaskCreateUpdateValidator,
  studentTaskController.createBulk
);

router.put(
  "/update/:id",
  auth([1, 6]),
  // studentTaskValidator.studentTaskCreateUpdateValidator,
  studentTaskController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentTaskController.show
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentTaskController.showByStudentId
);

router.get("/", auth([1, 3, 6]), studentTaskController.showAll);

router.delete("/delete/:id", auth([1, 6]), studentTaskController.delete);

router.put(
  "/upload/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentTaskController.uploadSiswa
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  studentTaskController.downloadSiswa
);

module.exports = router;

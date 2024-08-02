const express = require("express");
const AcademicYearController = require("../controllers/AcademicYearController");
const AcademicYearValidator = require("../validator/AcademicYearValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const academicYearController = new AcademicYearController();
const academicYearValidator = new AcademicYearValidator();

router.post(
  "/create",
  auth([1]),
  academicYearValidator.academicYearCreateUpdateValidator,
  academicYearController.create
);

router.put(
  "/update/:id",
  auth([1]),
  academicYearValidator.academicYearCreateUpdateValidator,
  academicYearController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), academicYearController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), academicYearController.showAll);

router.delete("/delete/:id", auth([1]), academicYearController.delete);

module.exports = router;

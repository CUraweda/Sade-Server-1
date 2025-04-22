const express = require("express");
const TimetableController = require("../controllers/TimetableController");
const TimetableValidator = require("../validator/TimetableValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const timetableController = new TimetableController();
const timetableValidator = new TimetableValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  timetableValidator.timetableCreateValidator,
  timetableController.create
);

router.post(
  "/duplicate-create",
  auth([1, 3, 6]),
  timetableValidator.timetableDuplicateCreateValidator,
  timetableController.duplicateCreate
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  timetableValidator.timetableUpdateValidator,
  timetableController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  timetableController.show
);

router.get(
  "/show-by-class",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  timetableController.showByClass
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  timetableController.showByClassId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), timetableController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), timetableController.delete);

module.exports = router;

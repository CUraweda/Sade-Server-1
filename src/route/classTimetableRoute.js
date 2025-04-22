const express = require("express");
const ClassTimetableController = require("../controllers/ClassTimetableController");
const ClassTimetableValidator = require("../validator/ClassTimetableValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const classTimetableController = new ClassTimetableController();
const classTimetableValidator = new ClassTimetableValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  //   classTimetableValidator.classTimetableCreateUpdateValidator,
  classTimetableController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  classTimetableValidator.classTimetableCreateUpdateValidator,
  classTimetableController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  classTimetableController.show
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  classTimetableController.showByClassId
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), classTimetableController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), classTimetableController.delete);

module.exports = router;

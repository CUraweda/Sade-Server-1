const express = require("express");
const TimetableTempController = require("../controllers/TimetableTempController");
const TimetableTempValidator = require("../validator/TimetableTempValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const timetableTempController = new TimetableTempController();
const timetableTempValidator = new TimetableTempValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  timetableTempValidator.timetableTempCreateUpdateValidator,
  timetableTempController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  timetableTempValidator.timetableTempCreateUpdateValidator,
  timetableTempController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  timetableTempController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), timetableTempController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), timetableTempController.delete);

module.exports = router;

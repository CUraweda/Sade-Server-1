const express = require("express");
const EduCalendarController = require("../controllers/EduCalendarController");
const EduCalendarValidator = require("../validator/EduCalendarValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const eduCalendarController = new EduCalendarController();
const eduCalendarValidator = new EduCalendarValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 6]),
  eduCalendarValidator.eduCalendarCreateUpdateValidator,
  eduCalendarController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 6]),
  eduCalendarValidator.eduCalendarCreateUpdateValidator,
  eduCalendarController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  eduCalendarController.show
);

router.get(
  "/show-ongoing",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  eduCalendarController.showByOngoingWeek
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8]), eduCalendarController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 6]),
  eduCalendarController.delete
);

module.exports = router;

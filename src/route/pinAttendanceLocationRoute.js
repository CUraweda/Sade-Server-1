const express = require("express");
const PinLocationAttendance = require("../controllers/PinLocationAttendance");
const PinLocationAttendanceValidator = require("../validator/PinAttendanceLocation");

const router = express.Router();
const auth = require("../middlewares/auth");

const pinLocationAttendanceController = new PinLocationAttendance();
const pinLocationAttendanceValidator = new PinLocationAttendanceValidator();

router.post(
  "/create",
  auth([1, 3, 6, 8]),
  pinLocationAttendanceValidator.pinAttendanceLocationCreateUpdateValidator,
  pinLocationAttendanceController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6, 8]),
  pinLocationAttendanceValidator.pinAttendanceLocationCreateUpdateValidator,
  pinLocationAttendanceController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  pinLocationAttendanceController.show
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  pinLocationAttendanceController.showAll
);

module.exports = router;

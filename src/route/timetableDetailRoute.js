const express = require("express");
const TimetableDetailController = require("../controllers/TimetableDetailController");
const TimetableDetailValidator = require("../validator/TimetableDetailValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const timetabledetailController = new TimetableDetailController();
const timetabledetailValidator = new TimetableDetailValidator();

router.post(
  "/create",
  auth([1, 3]),
  timetabledetailValidator.timetabledetailCreateUpdateValidator,
  timetabledetailController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  timetabledetailValidator.timetabledetailCreateUpdateValidator,
  timetabledetailController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  timetabledetailController.show
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  timetabledetailController.showAll
);

router.delete("/delete/:id", auth([1, 3]), timetabledetailController.delete);

module.exports = router;

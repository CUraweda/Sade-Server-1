const express = require("express");
const EduCalendarDetailController = require("../controllers/EduCalendarDetailController");
const EduCalendarDetailValidator = require("../validator/EduCalendarDetailValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const eduCalendarDetailController = new EduCalendarDetailController();
const eduCalendarDetailValidator = new EduCalendarDetailValidator();

router.post(
  "/create",
  auth([1, 3, 4, 6]),
  eduCalendarDetailValidator.eduCalendarDetailCreateUpdateValidator,
  eduCalendarDetailController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 4, 6]),
  eduCalendarDetailValidator.eduCalendarDetailUpdateValidator,
  eduCalendarDetailController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  eduCalendarDetailController.show
);

router.get(
  "/show-by-teacher/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  eduCalendarDetailController.showByTeacherId
)

router.get(
  "/show-by-edu/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  eduCalendarDetailController.showByEduId
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  eduCalendarDetailController.showAll
);

router.delete(
  "/delete/:id",
  auth([1, 3, 4, 6]),
  eduCalendarDetailController.delete
);

router.post(
  "/import",
  auth([1, 2, 3, 4, 6]),
  eduCalendarDetailController.importExcel
);

module.exports = router;

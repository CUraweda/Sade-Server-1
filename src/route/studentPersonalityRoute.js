const express = require("express");
const StudentPersonalityController = require("../controllers/StudentPersonalityController");
const StudentPersonalityValidator = require("../validator/StudentPersonalityValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const studentPersonalityController = new StudentPersonalityController();
const studentPersonalityValidator = new StudentPersonalityValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  studentPersonalityValidator.studentPersonalityCreateUpdateValidator,
  studentPersonalityController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  studentPersonalityValidator.studentPersonalityCreateUpdateValidator,
  studentPersonalityController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  studentPersonalityController.show
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  studentPersonalityController.showAll
);

router.delete(
  "/delete/:id",
  auth([1, 3, 6]),
  studentPersonalityController.delete
);

module.exports = router;

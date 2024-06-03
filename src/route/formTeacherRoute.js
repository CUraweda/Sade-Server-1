const express = require("express");
const FormTeacherController = require("../controllers/FormTeacherController");
const FormTeacherValidator = require("../validator/FormTeacherValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const formTeacherController = new FormTeacherController();
const formTeacherValidator = new FormTeacherValidator();

router.post(
  "/create",
  auth([1, 5]),
  formTeacherValidator.formTeacherCreateUpdateValidator,
  formTeacherController.create
);

router.put(
  "/update/:id",
  auth([1, 5]),
  formTeacherValidator.formTeacherCreateUpdateValidator,
  formTeacherController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6]), formTeacherController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), formTeacherController.showAll);

router.delete("/delete/:id", auth([1, 5]), formTeacherController.delete);

module.exports = router;

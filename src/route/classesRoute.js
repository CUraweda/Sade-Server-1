const express = require("express");
const ClassesController = require("../controllers/ClassesController");
const ClassesValidator = require("../validator/ClassesValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const classesController = new ClassesController();
const classesValidator = new ClassesValidator();

router.post(
  "/create",
  auth([1, 3]),
  classesValidator.classesCreateUpdateValidator,
  classesController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  classesValidator.classesCreateUpdateValidator,
  classesController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 13]), classesController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6, 9, 10, 11, 13]), classesController.showAll);

router.delete("/delete/:id", auth([1, 3]), classesController.delete);

module.exports = router;

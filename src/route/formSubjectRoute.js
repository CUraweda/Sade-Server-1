const express = require("express");
const FormSubjectController = require("../controllers/FormSubjectController");
const FormSubjectValidator = require("../validator/FormSubjectValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const formSubjectController = new FormSubjectController();
const formSubjectValidator = new FormSubjectValidator();

router.post(
  "/create",
  auth([1, 5]),
  formSubjectValidator.formSubjectCreateUpdateValidator,
  formSubjectController.create
);

router.put(
  "/update/:id",
  auth([1, 5]),
  formSubjectValidator.formSubjectCreateUpdateValidator,
  formSubjectController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6]), formSubjectController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), formSubjectController.showAll);

router.delete("/delete/:id", auth([1, 5]), formSubjectController.delete);

module.exports = router;

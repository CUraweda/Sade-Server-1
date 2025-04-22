const express = require("express");
const SubjectController = require("../controllers/SubjectController");
const SubjectValidator = require("../validator/SubjectValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const subjectController = new SubjectController();
const subjectValidator = new SubjectValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  subjectValidator.subjectCreateUpdateValidator,
  subjectController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  subjectValidator.subjectCreateUpdateValidator,
  subjectController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), subjectController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), subjectController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), subjectController.delete);

module.exports = router;

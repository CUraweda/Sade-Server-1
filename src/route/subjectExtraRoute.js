const express = require("express");
const SubjectExtraController = require("../controllers/SubjectExtraController");
const SubjectExtraValidator = require("../validator/SubjectExtraValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const subjectExSubjectExtraController = new SubjectExtraController();
const subjectExtraValidator = new SubjectExtraValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  subjectExtraValidator.subjectCreateUpdateValidator,
  subjectExSubjectExtraController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  subjectExtraValidator.subjectCreateUpdateValidator,
  subjectExSubjectExtraController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), subjectExSubjectExtraController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), subjectExSubjectExtraController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), subjectExSubjectExtraController.delete);

module.exports = router;

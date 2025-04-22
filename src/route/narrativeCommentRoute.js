const express = require("express");
const NarrativeCommentController = require("../controllers/NarrativeCommentController");
const NarrativeCommentValidator = require("../validator/NarrativeCommentValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const narrativeCommentController = new NarrativeCommentController();
const narrativeCommentValidator = new NarrativeCommentValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  narrativeCommentValidator.narrativeCommentCreateValidator,
  narrativeCommentController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  narrativeCommentValidator.narrativeCommentUpdateValidator,
  narrativeCommentController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  narrativeCommentController.show
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  narrativeCommentController.showByStudentId
);

router.get(
  "/show-by-student-report/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  narrativeCommentController.showByStudentReportId
);

// router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), narrativeCommentController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 3, 6]),
  narrativeCommentController.delete
);

module.exports = router;

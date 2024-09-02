const express = require("express");
const LessonPlanController = require("../controllers/LessonPlanController");
const LessonPlanValidator = require("../validator/LessonPlanValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const lessonPlanController = new LessonPlanController();
const lessonPlanValidator = new LessonPlanValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8]),
    lessonPlanController.showAll
);
router.get(
    "/show/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8]),
    lessonPlanController.show
);

router.post(
    "/create",
    auth([1, 2, 3, 4, 5, 6, 7, 8]),
    lessonPlanValidator.lessonPlanCreateUpdateValidator,
    lessonPlanController.create
);

router.put(
    "/update/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8]),
    lessonPlanValidator.lessonPlanCreateUpdateValidator,
    lessonPlanController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8]),
    lessonPlanController.delete
);

module.exports = router;

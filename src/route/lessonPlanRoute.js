const express = require("express");
const LessonPlanController = require("../controllers/LessonPlanController");

const router = express.Router();
const auth = require("../middlewares/auth");

const lessonPlanController = new LessonPlanController();

router.get(
    "/",
    auth([1, 3, 4, 6]),
    lessonPlanController.showAll
);
router.get(
    "/show-rekap-teacher",
    auth([1, 3, 4, 6]),
    lessonPlanController.showRekapTeacher
);

router.get(
    "/download",
    auth([1, 3, 4, 6]),
    lessonPlanController.downloadFile
);

router.get(
    "/:id",
    auth([1, 3, 4, 6]),
    lessonPlanController.showOne
);

router.post(
    "/create",
    auth([1, 3, 4, 6]),
    lessonPlanController.create
);

router.put(
    "/update/:id",
    auth([1, 3, 4, 6]),
    lessonPlanController.update
);

router.delete(
    "/delete/:id",
    auth([1, 3, 4, 6]),
    lessonPlanController.delete
);

module.exports = router;

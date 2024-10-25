const express = require("express");
const AchievementController = require("../controllers/AchievementController");
const AchievementValidator = require("../validator/AchievementValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const achievementController = new AchievementController();
const achievementValidator = new AchievementValidator();

router.post(
  "/create",
  auth([1, 3, 6, 7, 8]),
  // achievementValidator.achievementCreateUpdateValidator,
  achievementController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6, 7, 8]),
  // achievementValidator.achievementCreateUpdateValidator,
  achievementController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  achievementController.show
);

router.get(
  "/show-all-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  achievementController.showByStudentId
);

//get top one by student id
router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  achievementController.showTopOneByStudentId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), achievementController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 3, 6, 7, 8]),
  achievementController.delete
);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  achievementController.downloadCertificate
);

module.exports = router;

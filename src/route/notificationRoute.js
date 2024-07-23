const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const NotificationValidator = require("../validator/NotificationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const notificationController = new NotificationController();
const notificationValidator = new NotificationValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  notificationValidator.notificationCreateValidator,
  notificationController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  notificationValidator.notificationUpdateValidator,
  notificationController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  notificationController.show
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  notificationController.showByUserId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), notificationController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  notificationController.delete
);

module.exports = router;

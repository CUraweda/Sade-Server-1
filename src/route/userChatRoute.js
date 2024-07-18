const express = require("express");
const UserChatController = require("../controllers/UserChatController");
const UserChatValidator = require("../validator/UserChatValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const userChatController = new UserChatController();
const userChatValidator = new UserChatValidator();

router.post(
  "/create",
  auth([1, 3]),
  userChatValidator.userChatCreateUpdateValidator,
  userChatController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  userChatValidator.userChatCreateUpdateValidator,
  userChatController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userChatController.show
);

router.get(
  "/show-conversation",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userChatController.showUserBetweenId
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userChatController.showByUserId
);

router.get(
  "/show-by-user-details/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userChatController.showByUserIdDetails
);

// router.get("/", auth([1, 2, 3, 4, 5, 6]), userChatController.showAll);

router.delete("/delete/:id", auth([1, 3]), userChatController.delete);

module.exports = router;

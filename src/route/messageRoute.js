const express = require("express");
const MessageController = require("../controllers/MessageController");
const MessageValidator = require("../validator/MessageValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const messageController = new MessageController();
const messageValidator = new MessageValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  messageValidator.messageCreateUpdateValidator,
  messageController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  messageValidator.messageUpdateStatusValidator,
  messageController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8]), messageController.show);

router.get(
  "/show-by-uid/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  messageController.showConversationByUid
);

module.exports = router;

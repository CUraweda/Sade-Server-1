const express = require("express");
const UserAccessController = require("../controllers/UserAccessController");
const UserAccessValidator = require("../validator/UserAccessValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const userAccessController = new UserAccessController();
const userAccessValidator = new UserAccessValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  userAccessValidator.userAccessCreateUpdateValidator,
  userAccessController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  userAccessValidator.userAccessCreateUpdateValidator,
  userAccessController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  userAccessController.show
);

router.get(
  "/show-by-user/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  userAccessController.showByUserId
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), userAccessController.showAll);

router.delete("/delete/:id", auth([1, 3]), userAccessController.delete);

module.exports = router;

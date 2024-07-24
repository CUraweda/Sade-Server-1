const express = require("express");
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController")

const router = express.Router();
const auth = require("../middlewares/auth");

const authController = new AuthController();
const userController = new UserController();

router.get(
  "/show-by-roles",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  authController.showByRoles
);
router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userController.showAll
)
router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userController.show
)
router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userController.update
)
router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userController.delete
)

router.get('/me', auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), authController.me);
module.exports = router;

const express = require("express");
const AuthController = require("../controllers/AuthController");
const UserValidator = require("../validator/UserValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const authController = new AuthController();
const userValidator = new UserValidator();

router.post(
  "/register",
  userValidator.userCreateValidator,
  authController.register
);
router.post(
  "/email-exists",
  userValidator.checkEmailValidator,
  authController.checkEmail
);
router.post("/login", userValidator.userLoginValidator, authController.login);
router.post("/refresh-token", authController.refreshTokens);
router.post("/logout", authController.logout);
router.put(
  "/change-password",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  userValidator.changePasswordValidator,
  authController.changePassword
);
router.post("/verify-email/:id", authController.verifyMail);
router.put(
  "/update-profile/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  authController.update
);
router.post(
  "/forgot-password",
  // auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userValidator.forgotPasswordValidator,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  // auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  userValidator.resetPasswordValidator,
  authController.resetPassword
);
module.exports = router;

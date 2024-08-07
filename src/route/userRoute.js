const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();
const auth = require("../middlewares/auth");

const authController = new AuthController();

router.get(
  "/show-by-roles",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  authController.showByRoles
);

router.get('/me', auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), authController.me);
module.exports = router;

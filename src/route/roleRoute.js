const express = require("express");
const RoleController = require("../controllers/RoleController");
const RoleValidator = require("../validator/RoleValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const roleController = new RoleController();
const roleValidator = new RoleValidator();

router.post(
  "/create",
  auth([1]),
  roleValidator.roleCreateUpdateValidator,
  roleController.create
);

router.put(
  "/update/:id",
  auth([1]),
  roleValidator.roleCreateUpdateValidator,
  roleController.update
);

router.get("/show/:id", auth([1]), roleController.show);

router.get("/", auth([1]), roleController.showAll);

router.delete("/delete/:id", auth([1]), roleController.delete);

module.exports = router;

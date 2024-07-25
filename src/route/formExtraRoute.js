const express = require("express");
const FormExtraController = require("../controllers/FormExtraController");
const FormExtraValidator = require("../validator/FormExtraValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const formExtraController = new FormExtraController();
const formExtraValidator = new FormExtraValidator();

router.post(
  "/create",
  auth([1, 5]),
  formExtraValidator.formExtraCreateaUpdateValidator,
  formExtraController.create
);

router.put(
  "/update/:id",
  auth([1, 5]),
  formExtraValidator.formExtraCreateaUpdateValidator,
  formExtraController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6]), formExtraController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), formExtraController.showAll);

router.delete("/delete/:id", auth([1, 5]), formExtraController.delete);

module.exports = router;

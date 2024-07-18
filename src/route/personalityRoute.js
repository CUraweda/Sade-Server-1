const express = require("express");
const PersonalityController = require("../controllers/PersonalityController");
const PersonalityValidator = require("../validator/PersonalityValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const personalityController = new PersonalityController();
const personalityValidator = new PersonalityValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  personalityValidator.personalityCreateUpdateValidator,
  personalityController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  personalityValidator.personalityCreateUpdateValidator,
  personalityController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  personalityController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), personalityController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), personalityController.delete);

module.exports = router;

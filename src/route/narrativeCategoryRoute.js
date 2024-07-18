const express = require("express");
const NarrativeCategoryController = require("../controllers/NarrativeCategoryController");
const NarrativeCategoryValidator = require("../validator/NarrativeCategoryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const narrativeCategoryController = new NarrativeCategoryController();
const narrativeCategoryValidator = new NarrativeCategoryValidator();

router.post(
  "/create",
  auth([1, 6]),
  narrativeCategoryValidator.narrativeCategoryCreateUpdateValidator,
  narrativeCategoryController.create
);

router.put(
  "/update/:id",
  auth([1, 6]),
  narrativeCategoryValidator.narrativeCategoryCreateUpdateValidator,
  narrativeCategoryController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeCategoryController.show
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeCategoryController.showAll
);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeCategoryController.showByClassId
);

router.delete("/delete/:id", auth([1, 6]), narrativeCategoryController.delete);

module.exports = router;

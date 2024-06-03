const express = require("express");
const NarrativeSubCategoryController = require("../controllers/NarrativeSubCategoryController");
const NarrativeSubCategoryValidator = require("../validator/NarrativeSubCategoryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const narrativeSubCategoryController = new NarrativeSubCategoryController();
const narrativeSubCategoryValidator = new NarrativeSubCategoryValidator();

router.post(
  "/create",
  auth([1, 6]),
  narrativeSubCategoryValidator.narrativeSubCategoryCreateUpdateValidator,
  narrativeSubCategoryController.create
);

router.put(
  "/update/:id",
  auth([1, 6]),
  narrativeSubCategoryValidator.narrativeSubCategoryCreateUpdateValidator,
  narrativeSubCategoryController.update
);

router.get("/show/:id", auth([1, 6]), narrativeSubCategoryController.show);

router.get(
  "/show-by-category/:id",
  auth([1, 6]),
  narrativeSubCategoryController.showByCategoryId
);

router.get("/", auth([1, 6]), narrativeSubCategoryController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 6]),
  narrativeSubCategoryController.delete
);

module.exports = router;

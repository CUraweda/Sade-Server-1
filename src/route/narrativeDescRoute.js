const express = require("express");
const NarrativeDescController = require("../controllers/NarrativeDescController");
const NarrativeDescValidator = require("../validator/NarrativeDescValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const narrativeDescController = new NarrativeDescController();
const narrativeDescValidator = new NarrativeDescValidator();

router.post(
  "/create",
  auth([1, 3, 6]),
  narrativeDescValidator.narrativeDescCreateUpdateValidator,
  narrativeDescController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6]),
  narrativeDescValidator.narrativeDescCreateUpdateValidator,
  narrativeDescController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeDescController.show
);

router.get(
  "/show-by-subcategory/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeDescController.showBySubCatId
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  narrativeDescController.showAll
);

router.delete("/delete/:id", auth([1, 3, 6]), narrativeDescController.delete);

// router.post("/import", auth([1, 3, 6]), narrativeDescController.importExcel);

module.exports = router;

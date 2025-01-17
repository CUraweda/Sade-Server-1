const express = require("express");
const WasteCollectionController = require("../controllers/WasteCollectionController");
const WasteCollectionValidator = require("../validator/WasteCollectionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const wasteCollectionController = new WasteCollectionController();
const wasteCollectionValidator = new WasteCollectionValidator();

router.post(
  "/create",
  auth([1, 3, 6, 9, 10]),
  wasteCollectionValidator.wasteCollectionCreateUpdateValidator,
  wasteCollectionController.create
);

router.put(
  "/update/:id",
  auth([1, 3, 6, 9, 10]),
  wasteCollectionValidator.wasteCollectionCreateUpdateValidator,
  wasteCollectionController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  wasteCollectionController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 9, 10]), wasteCollectionController.showAll);
router.get("/get-by-filter", auth([1, 2, 3, 4, 5, 6, 9, 10, 11, 13]), wasteCollectionController.showByFilter);

router.delete("/delete/:id", auth([1, 3, 6, 9, 10]), wasteCollectionController.delete);

router.get(
  "/show-recap-type",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]),
  wasteCollectionController.showRecapType
)
router.get(
  "/show-recap-history/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  wasteCollectionController.showRecapHistory
);

router.get(
  "/show-recap-dashboard/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  wasteCollectionController.showRecapStudentInClass
);

router.get(
  "/collection-week-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  wasteCollectionController.showCollectionPerWeekbyStudentId
);

router.get(
  "/recap-week-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  wasteCollectionController.showRecapPerWeekbyStudentId
);

router.post("/import", auth([1, 3, 6, 9, 10]), wasteCollectionController.importExcel);

router.get(
  "/target-achievement-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 10]),
  wasteCollectionController.showTargetAchievementByStudentId
);

module.exports = router;

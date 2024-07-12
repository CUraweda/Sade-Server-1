const express = require("express");
const WasteOfficerController = require("../controllers/WasteOfficerController");
const WasteOfficerValidator = require("../validator/WasteOfficerValidator")

const router = express.Router();
const auth = require("../middlewares/auth");

const wasteOfficerController = new WasteOfficerController();
const wasteOfficerValidator = new WasteOfficerValidator();

router.post(
  "/create",
  auth([1]),
  wasteOfficerValidator.wasteOfficerCreateUpdateValidator,
  wasteOfficerController.create
);

router.put(
  "/update/:id",
  auth([1]),
  wasteOfficerValidator.wasteOfficerCreateUpdateValidator,
  wasteOfficerController.update
);

router.get("/show/:id", auth([1]), wasteOfficerController.show);

router.get("/get-by-date/:date", auth([1]), wasteOfficerController.showByDate);
router.get("/", auth([1]), wasteOfficerController.showAll);

router.delete("/delete/:id", auth([1]), wasteOfficerController.delete);

module.exports = router;

const express = require("express");
const WasteTypeController = require("../controllers/WasteTypeController");
const WasteTypeValidator = require("../validator/WasteTypeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const wasteTypeController = new WasteTypeController();
const wasteTypeValidator = new WasteTypeValidator();

router.post(
  "/create",
  auth([1]),
  wasteTypeValidator.wasteTypeCreateUpdateValidator,
  wasteTypeController.create
);

router.put(
  "/update/:id",
  auth([1]),
  wasteTypeValidator.wasteTypeCreateUpdateValidator,
  wasteTypeController.update
);

router.get("/show/:id", auth([1]), wasteTypeController.show);

router.get("/", auth([1]), wasteTypeController.showAll);

router.delete("/delete/:id", auth([1]), wasteTypeController.delete);

module.exports = router;

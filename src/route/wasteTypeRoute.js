const express = require("express");
const WasteTypeController = require("../controllers/WasteTypeController");
const WasteTypeValidator = require("../validator/WasteTypeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const wasteTypeController = new WasteTypeController();
const wasteTypeValidator = new WasteTypeValidator();

router.post(
  "/create",
  auth([1, 9, 10,11]),
  wasteTypeValidator.wasteTypeCreateUpdateValidator,
  wasteTypeController.create
);

router.put(
  "/update/:id",
  auth([1, 9, 10,11]),
  wasteTypeValidator.wasteTypeCreateUpdateValidator,
  wasteTypeController.update
);

router.get("/show/:id", auth([1, 9, 10, 11, 13]), wasteTypeController.show);

router.get("/", auth([1, 9, 10, 11, 13]), wasteTypeController.showAll);

router.delete("/delete/:id", auth([1, 9, 10,11]), wasteTypeController.delete);

module.exports = router;

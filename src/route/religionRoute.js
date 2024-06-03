const express = require("express");
const ReligionController = require("../controllers/ReligionController");
const ReligionValidator = require("../validator/ReligionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const religionController = new ReligionController();
const religionValidator = new ReligionValidator();

router.post(
  "/create",
  auth([1]),
  religionValidator.religionCreateUpdateValidator,
  religionController.create
);

router.put(
  "/update/:id",
  auth([1]),
  religionValidator.religionCreateUpdateValidator,
  religionController.update
);

router.get("/show/:id", auth([1]), religionController.show);

router.get("/", auth([1]), religionController.showAll);

router.delete("/delete/:id", auth([1]), religionController.delete);

module.exports = router;

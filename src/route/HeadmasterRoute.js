const express = require("express");
const HeadmasterController = require("../controllers/HeadmasterController");
const HeadmasterValidator = require("../validator/HeadmasterValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const headmasterController = new HeadmasterController();
const headmasterValidator = new HeadmasterValidator();

router.post(
  "/create",
  auth([1, 5]),
  headmasterValidator.headmasterCreateUpdateValidator,
  headmasterController.create
);

router.put(
  "/update/:id",
  auth([1, 5]),
  headmasterValidator.headmasterCreateUpdateValidator,
  headmasterController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6]), headmasterController.show);

router.get("/", auth([1, 2, 3, 4, 5, 6]), headmasterController.showAll);

router.delete("/delete/:id", auth([1, 5]), headmasterController.delete);

module.exports = router;

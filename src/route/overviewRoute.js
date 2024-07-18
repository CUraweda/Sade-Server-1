const express = require("express");
const OverviewController = require("../controllers/OverviewController");
const OverviewValidator = require("../validator/OverviewValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const overviewController = new OverviewController();
const overviewValidator = new OverviewValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6]),
  overviewValidator.overviewCreateUpdateValidator,
  overviewController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6]),
  overviewValidator.overviewCreateUpdateValidator,
  overviewController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  overviewController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), overviewController.showAll);

router.get(
  "/show-active",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  overviewController.showActive
);

router.put(
  "/set-active/:id",
  auth([1, 2, 3, 4, 5, 6]),
  overviewController.setActive
);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6]),
  overviewController.delete
);

module.exports = router;

const express = require("express");
const WasteSalesController = require("../controllers/WasteSalesController");

const router = express.Router();
const auth = require("../middlewares/auth");

const wasteSalesController = new WasteSalesController();

router.get(
  "/",
  auth([1, 9, 10, 11, 13]),
  wasteSalesController.showWasteSummary
);

module.exports = router;

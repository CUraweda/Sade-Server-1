const express = require("express");
const DashboardController = require("../controllers/DashboardController");

const router = express.Router();
const auth = require("../middlewares/auth");
const dashboardController = new DashboardController();

router.get("/admin-keuangan", auth([1, 2]), dashboardController.adminKeuangan);
router.get(
  "/admin-timbangan",
  auth([1, 2, 9, 10]),
  dashboardController.adminTimbangan
);
router.get(
  "/detail-chart",
  auth([1, 2, 9, 10]),
  dashboardController.getDetailChartData
);

router.get(
  "/chart",
  auth([1, 2, 9, 10]),
  dashboardController.getChartData
);
module.exports = router;

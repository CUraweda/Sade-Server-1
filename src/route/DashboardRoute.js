const express = require("express");
const DashboardController = require("../controllers/DashboardController");

const router = express.Router();
const auth = require("../middlewares/auth");
const dashboardController = new DashboardController();

router.get("/admin-keuangan", auth([1, 2]), dashboardController.adminKeuangan);

module.exports = router;

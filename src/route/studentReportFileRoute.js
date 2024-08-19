const express = require("express");
const StudentReportFileController = require("../controllers/StudentReportFileController");

const router = express.Router();
const auth = require("../middlewares/auth");

const controller = new StudentReportFileController();

router.post("/create", auth([1, 6]), controller.create);

router.put("/update/:id", auth([1, 6]), controller.update);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), controller.show);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), controller.showAll);

router.delete("/delete/:id", auth([1, 6]), controller.delete);

router.get(
  "/download",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  controller.downloadFile
);

module.exports = router;

const express = require("express");
const AnnouncementController = require("../controllers/AnnouncementController");
const AnnouncementValidator = require("../validator/AnnouncementValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const announcementController = new AnnouncementController();
const announcementValidator = new AnnouncementValidator();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6]),
  // announcementValidator.announcementCreateUpdateValidator,
  announcementController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6]),
  // announcementValidator.announcementCreateUpdateValidator,
  announcementController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]),
  announcementController.show
);

router.get(
  "/show-between",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]),
  announcementController.showBetween
);

router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]),
  announcementController.showAll
);
router.get(
  "/get-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]),
  announcementController.showByClass
);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6]),
  announcementController.delete
);

router.get(
  "/download/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]),
  announcementController.downloadFile
);

module.exports = router;

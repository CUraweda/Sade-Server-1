const express = require("express");
const ParentController = require("../controllers/ParentController");
const ParentValidator = require("../validator/ParentValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const parentController = new ParentController();
const parentValidator = new ParentValidator();

router.post(
  "/create",
  auth([1, 3]),
  parentValidator.parentCreateUpdateValidator,
  parentController.create
);

router.post("/import", auth([1, 3]), parentController.importExcel);

router.put(
  "/update/:id",
  auth([1, 3]),
  parentValidator.parentCreateUpdateValidator,
  parentController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), parentController.show);

router.get("/show-by-userid/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), parentController.showByUserId);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  parentController.showByStudentId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 8]), parentController.showAll);

router.delete("/delete/:id", auth([1, 3]), parentController.delete);

module.exports = router;

const express = require("express");
const ParentController = require("../controllers/ParentController");
const ParentValidator = require("../validator/ParentValidator");

const router = express.Router();
const auth = require("../middlewares/auth");
const isStudentParentValid = require("../middlewares/StudentParentValid");

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
  "/update/me",
  auth([8]),
  parentValidator.parentCreateUpdateValidator,
  parentController.updateMe
);

router.put(
  "/update/:id",
  auth([1, 3]),
  parentValidator.parentCreateUpdateValidator,
  parentController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), parentController.show);

router.get("/show-by-userid/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), parentController.showByUserId);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  isStudentParentValid("params", "id"),
  parentController.showByStudentId
);

router.get("/show-by-name/:name", auth([1, 4, 8]), parentController.showByName)

router.put("/attach-user/:id", auth([1, 4, 8]), parentValidator.parentAttachValidator, parentController.update)

router.get("/", auth([1, 2, 3, 4, 5, 6, 8,11]), parentController.showAll);

router.delete("/delete/:id", auth([1, 3]), parentController.delete);

module.exports = router;

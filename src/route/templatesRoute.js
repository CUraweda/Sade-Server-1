const express = require("express");
const TemplatesController = require("../controllers/TemplatesController");

const router = express.Router();
const auth = require("../middlewares/auth");

const templatesController = new TemplatesController();

router.post("/create", auth([1, 3, 6]), templatesController.create);

router.put("/update/:id", auth([1, 3, 6]), templatesController.update);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  templatesController.show
);

router.get(
  "/show-by-code/:code",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  templatesController.showByCode
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8]), templatesController.showAll);

router.delete("/delete/:id", auth([1, 3, 6]), templatesController.delete);

module.exports = router;

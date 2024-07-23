const express = require("express");
const FinancialPostController = require("../controllers/FinancialPostController");
const FinancialPostValidator = require("../validator/FinancialPostValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const financialPostController = new FinancialPostController();
const financialPostValidator = new FinancialPostValidator();

router.post(
  "/create",
  auth([1, 2]),
  financialPostValidator.financialPostCreateUpdateValidator,
  financialPostController.create
);

router.put(
  "/update/:id",
  auth([1, 2]),
  financialPostValidator.financialPostCreateUpdateValidator,
  financialPostController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  financialPostController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), financialPostController.showAll);

router.delete("/delete/:id", auth([1, 2]), financialPostController.delete);

module.exports = router;

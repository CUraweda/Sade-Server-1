const express = require("express");
const PaymentCategoryController = require("../controllers/PaymentCategoryController");
const PaymentCategoryValidator = require("../validator/PaymentCategoryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const paymentCategoryController = new PaymentCategoryController();
const paymentCategoryValidator = new PaymentCategoryValidator();

router.post(
  "/create",
  auth([1]),
  paymentCategoryValidator.paymentCategoryCreateUpdateValidator,
  paymentCategoryController.create
);

router.put(
  "/update/:id",
  auth([1]),
  paymentCategoryValidator.paymentCategoryCreateUpdateValidator,
  paymentCategoryController.update
);

router.get("/show/:id", auth([1]), paymentCategoryController.show);

router.get(
  "/show-by-billing-cycle/:billing_cycle",
  auth([1]),
  paymentCategoryController.showByBillingCycle
);

router.get("/", auth([1]), paymentCategoryController.showAll);

router.delete("/delete/:id", auth([1]), paymentCategoryController.delete);

module.exports = router;

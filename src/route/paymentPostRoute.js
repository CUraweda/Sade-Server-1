const express = require("express");
const PaymentPostController = require("../controllers/PaymentPostController");
const PaymentPostValidator = require("../validator/PaymentPostValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const paymentPostController = new PaymentPostController();
const paymentPostValidator = new PaymentPostValidator();

router.post(
  "/create",
  auth([1, 2]),
  paymentPostValidator.paymentPostCreateUpdateValidator,
  paymentPostController.create
);

router.put(
  "/update/:id",
  auth([1, 2]),
  paymentPostValidator.paymentPostCreateUpdateValidator,
  paymentPostController.update
);

router.get("/show/:id", auth([1, 2]), paymentPostController.show);

router.get("/", auth([1, 2]), paymentPostController.showAll);

router.get('/show-total', auth([1, 2, 6, 13]), paymentPostController.showTotal)

router.delete("/delete/:id", auth([1, 2]), paymentPostController.delete);

module.exports = router;

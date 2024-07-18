const express = require("express");
const BorrowBookController = require("../controllers/BorrowBookController");
const BorrowBookValidator = require("../validator/BorrowBookValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const borrowBookController = new BorrowBookController();
const borrowBookValidator = new BorrowBookValidator();

router.post(
  "/create",
  auth([1]),
  borrowBookValidator.borrowBookCreateUpdateValidator,
  borrowBookController.create
);

router.put(
  "/update/:id",
  auth([1]),
  borrowBookValidator.borrowBookCreateUpdateValidator,
  borrowBookController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  borrowBookController.show
);

router.get(
  "/show-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  borrowBookController.showByStudentId
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), borrowBookController.showAll);

router.delete("/delete/:id", auth([1]), borrowBookController.delete);

router.get(
  "/show-recap-by-student/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  borrowBookController.showRecapByStudent
);

module.exports = router;

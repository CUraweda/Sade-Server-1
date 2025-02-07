const express = require("express")
const StudentPaymentCategoryController = require("../controllers/StudentPaymentCategoryController")
const StudentPaymentCategoryValidator = require("../validator/StudentPaymentCategoryValidator")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentPaymentCategoryController = new StudentPaymentCategoryController()
const studentPaymentCategoryValidator = new StudentPaymentCategoryValidator()


router.post(
    "/create",
    auth([1, 2, 3, 6]),
    studentPaymentCategoryValidator.studentPaymentCategoryCreateUpdateValidator,
    studentPaymentCategoryController.create
)

router.put(
    "/update/:id",
    auth([1, 2, 3, 6]),
    studentPaymentCategoryValidator.studentPaymentCategoryCreateUpdateValidator,
    studentPaymentCategoryController.update
)

router.get(
    "/",
    auth([1, 2, 3, 6, 13]),
    studentPaymentCategoryController.showAll
)
router.get(
    "/get-by-id/:id",
    auth([1, 2, 3, 6, 13]),
    studentPaymentCategoryController.showById
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 6]),
    studentPaymentCategoryController.delete
);
module.exports = router
const express = require("express")
const StudentPaymentPostController = require("../controllers/StudentPaymentPostController")
const StudentPaymentPostValidator = require("../validator/StudentPaymentPostValidator")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentPaymentPostController = new StudentPaymentPostController()
const studentPaymentPostValidator = new StudentPaymentPostValidator()


router.post(
    "/create",
    auth([1, 2, 3, 6]),
    studentPaymentPostValidator.studentPaymentPostCreateUpdateValidator,
    studentPaymentPostController.create
)

router.put(
    "/update/:id",
    auth([1, 2, 3, 6]),
    studentPaymentPostValidator.studentPaymentPostCreateUpdateValidator,
    studentPaymentPostController.update
)

router.get(
    "/",
    auth([1, 2, 3, 6]),
    studentPaymentPostController.showAll
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 6]),
    studentPaymentPostController.delete
);
module.exports = router
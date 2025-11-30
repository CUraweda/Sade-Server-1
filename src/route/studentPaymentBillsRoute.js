const express = require("express")
const StudentPaymentBillsController = require("../controllers/StudentPaymentBillsController")
const StudentPaymentBillsValidator = require("../validator/StudentPaymentBillsValidator")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentPaymentBillsController = new StudentPaymentBillsController()
const studentPaymentBillsValidator = new StudentPaymentBillsValidator()

router.post(
    "/create",
    auth([1, 2, 3, 6]),
    studentPaymentBillsValidator.studentPaymentBillsCreateUpdateValidator,
    studentPaymentBillsController.create
)

router.post(
    "/bulk-create",
    auth([1, 2, 3, 6]),
    studentPaymentBillsValidator.studentPaymentBillsBulkCreateValidator,
    studentPaymentBillsController.bulkCreate
)

router.put(
    "/update/:id",
    auth([1, 2, 3, 6]),
    studentPaymentBillsValidator.studentPaymentBillsCreateUpdateValidator,
    studentPaymentBillsController.update
)

router.get(
    "/",
    auth([1, 2, 3, 6,11, 13]),
    studentPaymentBillsController.showAll
)
router.get(
    "/get-by-id/:id",
    auth([1, 2, 3, 6,11, 13]),
    studentPaymentBillsController.showById
)

router.get(
    "/get-by-student-id/:id",
    auth([1, 2, 3, 6,11, 13]),
    studentPaymentBillsController.showByStudentId
)

router.get(
    "/get-by-class/:class_id",
    auth([1, 2, 3, 6,11, 13]),
    studentPaymentBillsController.showByClass
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 6]),
    studentPaymentBillsController.delete
);
module.exports = router
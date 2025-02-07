const express = require("express")
const StudentPaymentReportController = require("../controllers/StudentPaymentReportController")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentPaymentReportController = new StudentPaymentReportController()

router.get(
    "/",
    auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.showAll
)
router.get(
    "/get-by-id/:id",
    auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.showById
)
router.get(
    "/get-by-student-id/:id",
    auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.showByStudentId
)
router.get(
    "/get-by-class-id/:id",
    auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.showByClassId
)
router.get(
    "/get-by-filter",
    auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.showByFilter
)

router.get(
    "/export-all",
     auth([1, 2, 3, 6, 13]),
    studentPaymentReportController.exportAll
)
module.exports = router
const express = require("express")
const StudentBillsController = require("../controllers/StudentBillsController")
const StudentBillsValidator = require("../validator/StudentBillsValidator")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentBillsController = new StudentBillsController()
const studentBillsValidator = new StudentBillsValidator()


router.post(
    "/create",
    auth([1, 2, 3, 6]),
    studentBillsValidator.studentBillsCreateUpdateValidator,
    studentBillsController.create
)

router.post(
	'/bulk-create',
	auth([1, 2, 3, 6]),
	studentBillsValidator.studentBillsBulkCreateValidator,
	studentBillsController.bulkCreate
);

router.put(
    '/up-evidence/:ids',
    auth([8]),
    studentBillsController.upEvidence
)

router.put(
    '/confirm-evidence/:id', 
    auth([1, 2, 3]), 
    studentBillsController.confirmEvidence
);

router.put(
    "/update/:id",
    auth([1, 2, 3, 6]),
    studentBillsValidator.studentBillsCreateUpdateValidator,
    studentBillsController.update
)

router.get(
    "/",
    auth([1, 2, 3, 6]),
    studentBillsController.showAll
)
router.get(
    "/get-for-report",
    auth([13]),
    studentBillsController.showForReport
)
router.get(
    "/get-by-id/:id",
    auth([1, 2, 3, 6]),
    studentBillsController.showById
)

router.get(
    "/get-by-student-id/:id",
    auth([1, 2, 3, 6, 8]),
    studentBillsController.showByStudentId
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 6]),
    studentBillsController.delete
);
module.exports = router
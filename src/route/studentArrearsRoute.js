const express = require("express")
const StudentArrearsController = require("../controllers/StudentArrearsController")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentArrearsController = new StudentArrearsController()

router.get(
    "/",
    auth([1, 2, 3, 6, 13]),
    studentArrearsController.showAll
)
router.get(
    "/show-report",
    auth([1, 2, 3, 6, 13]),
    studentArrearsController.showReport
)
router.get(
    "/get-by-id/:id",
    auth([1, 2, 3, 6]),
    studentArrearsController.showById
)
router.get(
    "/get-by-student-id/:id",
    auth([1, 2, 3, 6]),
    studentArrearsController.showByStudentId
)
router.get(
    "/get-by-class-id/:id",
    auth([1, 2, 3, 6]),
    studentArrearsController.showByClassId
)

router.get(
    "/export-all",
     auth([1, 2, 3, 6]),
    studentArrearsController.exportAll
)
module.exports = router
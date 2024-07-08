const express = require("express")
const StudentDataController = require("../controllers/StudentDataController")
const StudentDataValidator = require("../validator/StudentDataValidator")

const router = express.Router()
const auth = require("../middlewares/auth")

const studentDataController = new StudentDataController()
const studentDataValidator = new StudentDataValidator()

router.post(
    "/create",
    auth([1, 3, 6]),
    studentDataValidator.studentDataCreateUpdateValidator,
    studentDataController.create
)

router.put(
    "/update/:id",
    auth([1, 3, 6]),
    studentDataValidator.studentDataCreateUpdateValidator,
    studentDataController.update
)

router.get(
    "/",
    auth([1, 3, 6]),
    studentDataController.showAll
)

router.get(
    "/get-by-student-id/:id",
    auth([1, 3, 6]),
    studentDataController.showByStudentId
)

router.get(
    "/get-by-class/:class",
    auth([1, 3, 6]),
    studentDataController.showByClass
)

router.delete(
    "/delete/:id",
    auth([1, 3, 6]),
    studentDataController.delete
  );
module.exports = router
const express = require("express");
const uploadFile = require('../middlewares/uploadEmployeeSignature')
const EmployeeSignatureController = require("../controllers/EmployeeSignatureControllers");
const EmployeeSignatureValidator = require("../validator/EmployeeSignatureValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeSignatureController = new EmployeeSignatureController();
const employeeSignatureValidator = new EmployeeSignatureValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.getAll
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.getOne
);

router.post(
    "/create",
    employeeSignatureValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.createOne
);

router.post(
    "/add-mine",
    // employeeSignatureValidator.addMineValidator,
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.addMine
);

router.put(
    "/update/:id",
    employeeSignatureValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 9, 10, 11]),
    employeeSignatureController.delete
);

module.exports = router;

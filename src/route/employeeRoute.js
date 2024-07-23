const express = require("express");
const EmployeeController = require("../controllers/EmployeeController");
const EmployeeValidator = require("../validator/EmployeeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeController = new EmployeeController();
const employeeValidator = new EmployeeValidator();

router.post(
  "/create",
  auth([1, 5]),
  employeeValidator.employeeCreateUpdateValidator,
  employeeController.create
);

router.put(
  "/update/:id",
  auth([1, 5]),
  employeeValidator.employeeCreateUpdateValidator,
  employeeController.update
);

router.put(
  '/attach/:id',
  auth([1,5]),
  employeeValidator.attachEmployeeValidator,
  employeeController.update
)

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  employeeController.show
);

router.get(
  "/show-by-status",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  employeeController.showAllIsGuru
);

router.get("/", auth([1, 2, 3, 4, 5, 6]), employeeController.showAll);

router.delete("/delete/:id", auth([1, 5]), employeeController.delete);

router.post("/import", auth([1, 5]), employeeController.importExcel);

module.exports = router;

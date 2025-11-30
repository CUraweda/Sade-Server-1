const express = require("express");
const TaskController = require("../controllers/TaskController");
// const TaskValidator = require("../validator/TaskValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const taskController = new TaskController();
// const taskValidator = new TaskValidator();

router.post(
  "/create",
  auth([1, 6]),
  // taskValidator.taskCreateUpdateValidator,
  taskController.create
);

router.put(
  "/update/:id",
  auth([1, 6]),
  // taskValidator.taskCreateUpdateValidator,
  taskController.update
);

router.get("/show/:id", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), taskController.show);

router.get(
  "/show-by-class/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  taskController.showByClassId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]), taskController.showAll);

router.delete("/delete/:id", auth([1, 6]), taskController.delete);

module.exports = router;

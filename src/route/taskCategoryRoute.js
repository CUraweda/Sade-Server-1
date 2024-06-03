const express = require("express");
const TaskCategoryController = require("../controllers/TaskCategoryController");
const TaskCategoryValidator = require("../validator/TaskCategoryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const taskCategoryController = new TaskCategoryController();
const taskCategoryValidator = new TaskCategoryValidator();

router.post(
  "/create",
  auth([1, 3]),
  taskCategoryValidator.taskCategoryCreateUpdateValidator,
  taskCategoryController.create
);

router.put(
  "/update/:id",
  auth([1, 3]),
  taskCategoryValidator.taskCategoryCreateUpdateValidator,
  taskCategoryController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8]),
  taskCategoryController.show
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8]), taskCategoryController.showAll);

router.delete("/delete/:id", auth([1, 3]), taskCategoryController.delete);

module.exports = router;

const express = require("express");
const TaskDetailController = require("../controllers/TaskDetailController");

const router = express.Router();
const auth = require("../middlewares/auth");

const taskDetailController = new TaskDetailController();

router.post(
  "/create",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  taskDetailController.create
);

router.put(
  "/update/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  taskDetailController.update
);

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  taskDetailController.show
);

router.get(
  "/show-by-task/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  taskDetailController.showByTaskId
);

router.get("/", auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), taskDetailController.showAll);

router.delete(
  "/delete/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  taskDetailController.delete
);

module.exports = router;

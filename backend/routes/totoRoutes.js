import express from "express";
// import validateToken from "../middleware/validateTokenHandler.js";
import {createTodo, getTodos, getTodoById, deleteTodo, updateTodo} from "../controllers/todoControllers.js";
import validateToken from "../middleware/validateTokenHandler.js";
import {logoutUser} from "../controllers/userControllers.js";

const router = express.Router();

// router.use(validateToken);

router.use(validateToken)


// User gets all todos
router.get("/", getTodos);

// User create todo
router.post("/", createTodo);


// User get todo by id
router.get("/:id", getTodoById);

// User update todo by id
router.put("/:id", updateTodo);

// User delete todo by id
router.delete("/:id", deleteTodo, logoutUser);

export default router;
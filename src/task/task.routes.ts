import Router from "express";
import { query, param } from "express-validator";
import { validate } from "../middlewares/validation";
import {
	createTaskValidation,
	taskIdParam,
	updateTaskValidation,
} from "../validations/validations";
import { TaskController } from "./task.controller";
import { authenticate } from "../middlewares/auth.middleware";
const router = Router();

router.post("/", validate(createTaskValidation), TaskController.createTask);
router.get(
	"/",
	validate([query("page").optional().isInt({ min: 1 })]),
	TaskController.getTasks,
);
router.get(
	"/:id",
	validate([param("id").isUUID()]),
	TaskController.getTaskById,
);
router.put("/:id", validate(updateTaskValidation), TaskController.updateTask);
router.delete(
	"/:id",
	validate([param("id").isUUID()]),
	TaskController.deleteTask,
);

router.put(
	"/:id/complete",
	validate([param("id").isUUID()]),
	TaskController.completeTask,
);

/* alt */
router.patch(
	"/:id/complete",
	authenticate,
	taskIdParam,
	validate(updateTaskValidation),
	TaskController.completeTask,
);

export default router;

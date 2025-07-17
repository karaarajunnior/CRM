import { Router } from "express";
import { param } from "express-validator";
import { ActivityLogController } from "./activityLog.controller";
import { validate } from "../../middlewares/validation";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, ActivityLogController.getAllLogs);

router.get(
	"/user/:userId",
	authenticate,
	validate([param("userId").isUUID().withMessage("Invalid userId")]),
	ActivityLogController.getLogsByUser,
);

router.get(
	"/:id",
	authenticate,
	validate([param("id").isUUID().withMessage("Invalid log ID")]),
	ActivityLogController.getLogById,
);

router.post("/createLog", ActivityLogController.createLog);

export default router;

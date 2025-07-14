import Router from "express";
import { query, param } from "express-validator";
import { validate } from "../middlewares/validation";
import {
	createInteractionValidation,
	updateInteractionValidation,
} from "../types/types";
import { InteractionController } from "../controllers/interaction.controller";
const router = Router();

router.post(
	"/",
	validate(createInteractionValidation),
	InteractionController.createInteraction,
);
router.get(
	"/",
	validate([query("page").optional().isInt({ min: 1 })]),
	InteractionController.getInteractions,
);
router.get(
	"/:id",
	validate([param("id").isUUID()]),
	InteractionController.getInteractionById,
);
router.put(
	"/:id",
	validate(updateInteractionValidation),
	InteractionController.updateInteraction,
);
router.delete(
	"/:id",
	validate([param("id").isUUID()]),
	InteractionController.deleteInteraction,
);

// Complete interaction
router.put(
	"/:id/complete",
	validate([param("id").isUUID()]),
	InteractionController.completeInteraction,
);

export default router;

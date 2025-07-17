import Router from "express";
import { query, param, body } from "express-validator";
import { validate } from "../middlewares/validation";
import {
	createDealValidation,
	updateDealValidation,
} from "../validations/validations";
import { DealController } from "./deal.controller";
const router = Router();

router.post("/", validate(createDealValidation), DealController.createDeal);
router.get(
	"/",
	validate([query("page").optional().isInt({ min: 1 })]),
	DealController.getDeals,
);
router.get(
	"/:id",
	validate([param("id").isUUID()]),
	DealController.getDealById,
);
router.put("/:id", validate(updateDealValidation), DealController.updateDeal);
router.delete(
	"/:id",
	validate([param("id").isUUID()]),
	DealController.deleteDeal,
);

// Deal stages and pipeline
router.get("/pipeline/stats", DealController.getPipelineStats);
router.put(
	"/:id/stage",
	validate([
		param("id").isUUID(),
		body("stage").isIn([
			"PROSPECTING",
			"QUALIFICATION",
			"PROPOSAL",
			"NEGOTIATION",
			"CLOSED_WON",
			"CLOSED_LOST",
		]),
	]),
	DealController.updateDealStage,
);

export default router;

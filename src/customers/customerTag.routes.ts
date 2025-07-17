import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { validate as validateRequest } from "../middlewares/validation";
import * as CT from "./customerTag.controller";

const router = Router();

/* add/remove by body */
router.post(
	"/",
	authenticate,
	validateRequest([body("customerId").isUUID(), body("tagId").isUUID()]),
	CT.addTag,
);

router.delete(
	"/",
	authenticate,
	validateRequest([body("customerId").isUUID(), body("tagId").isUUID()]),
	CT.removeTag,
);

/* read helpers */
router.get(
	"/customer/:customerId",
	validateRequest([param("customerId").isUUID()]),
	CT.getTagsForCustomers,
);

router.get(
	"/tag/:tagId",
	validateRequest([param("tagId").isUUID()]),
	CT.getCustomersForTags,
);

export default router;

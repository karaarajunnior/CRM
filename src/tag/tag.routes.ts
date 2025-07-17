import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { validate as validateRequest } from "../middlewares/validation";
import * as TagCtrl from "./tag.controller";

const router = Router();

router.get("/", TagCtrl.listTags);
router.get("/:id", validateRequest([param("id").isUUID()]), TagCtrl.getTag);

router.post(
	"/",
	authenticate,
	validateRequest([
		body("name").isString().notEmpty(),
		body("color").optional().isString(),
	]),
	TagCtrl.createTag,
);

router.put(
	"/:id",
	authenticate,
	validateRequest([
		param("id").isUUID(),
		body("name").optional().isString(),
		body("color").optional().isString(),
	]),
	TagCtrl.updateTag,
);

router.delete(
	"/:id",
	authenticate,
	validateRequest([param("id").isUUID()]),
	TagCtrl.deleteTag,
);

export default router;

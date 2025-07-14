import { CustomerController } from "../controllers/customer.controller";
import { Router } from "express";
import {
	contactValidation,
	createCustomerValidation,
	customFieldValidation,
} from "../types/types";
import { validate } from "../middlewares/validation";
import { param } from "express-validator";
import { upload } from "../middlewares/upload";

const router = Router();

router.post(
	"/customer",
	validate(createCustomerValidation),
	CustomerController.createCustomer,
);
router.post(
	"/:id/contacts",
	validate(contactValidation),
	CustomerController.addContactMethod,
);
router.post(
	"/:id/custom-fields",
	validate(customFieldValidation),
	CustomerController.addCustomField,
);
router.post(
	"/:id/documents",
	upload.single("document"),
	CustomerController.uploadDocument,
);
router.get(
	"/:id/timeline",
	validate([param("id").isUUID()]),
	CustomerController.getCustomerTimeline,
);
router.get(
	"/:id/stats",
	validate([param("id").isUUID()]),
	CustomerController.getCustomerStats,
);

router.post("/segments", CustomerController.segmentCustomers);
router.post(
	"/import",
	upload.single("file"),
	CustomerController.importCustomers,
);
router.get("/export/:format", CustomerController.exportCustomers);

export default router;

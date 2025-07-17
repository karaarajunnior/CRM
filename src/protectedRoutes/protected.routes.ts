import { CustomerController } from "../customers/customer.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import express, { Router } from "express";
import { upload } from "../middlewares/upload";
import {
	logout,
	resetPassword,
	requestPasswordReset,
	getProfile,
	removeUser,
} from "../users/user.controller";
import { validate } from "../middlewares/validation";
import {
	paginationValidation,
	updateCustomerValidation,
} from "../validations/validations";
const app = express();
const router = Router();

//customer with validations
router.get(
	"/allcustomers",
	validate(paginationValidation),
	CustomerController.getCustomers,
);
router.delete("/customerDelete", CustomerController.deleteCustomer);
router.get("/:customerstat", CustomerController.getCustomerStats);
router.get("/customerTime", CustomerController.getCustomerTimeline);
router.post("/cust", CustomerController.exportCustomers);
router.post(
	"/:doc",
	upload.single("file"),
	authenticate,
	authorize([]),
	CustomerController.uploadDocument,
);

router.put(
	"/:id",
	validate(updateCustomerValidation),
	CustomerController.updateCustomer,
);

//users
router.delete("/remove/:id", authenticate, removeUser);
router.get("/logout", logout);

router.post("/reset-passowrd", resetPassword);
router.post("/request-password-reset", requestPasswordReset);
router.get(
	"/profile/:id",
	authenticate,
	authorize(["ADMIN", "SALES_REP"]),
	getProfile,
);

export default router;

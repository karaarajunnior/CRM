import express from "express";
import {
	register,
	login,
	requestPasswordReset,
	resetPassword,
	getProfile,
	logout,
} from "../users/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation";
import {
	registerValidation,
	loginValidation,
} from "../validations/validations";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

export default router;

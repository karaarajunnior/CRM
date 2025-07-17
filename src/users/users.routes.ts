import express from "express";
import {
	register,
	login,
	requestPasswordReset,
	resetPassword,
	getProfile,
	logout,
} from "../users/user.controller";

import { validate } from "../middlewares/validation";
import {
	registerValidation,
	loginValidation,
} from "../validations/validations";
import { authenticate } from "../middlewares/auth.middleware";
import { basicLimiter } from "../middlewares/RateLimiter";

const router = express.Router();

router.post("/register", basicLimiter, validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.get("/logout", authenticate, logout);
router.get("/profile", getProfile);

export default router;

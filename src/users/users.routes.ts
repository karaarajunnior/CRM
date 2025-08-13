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
import { logActivityMiddleware } from "../middlewares/LogActivityMiddleware";

const router = express.Router();

router.post("/register", validate(registerValidation), basicLimiter, register);
router.post("/login", validate(loginValidation), login);
router.get("/logout", authenticate, logout);
router.get("/profile", authenticate, logActivityMiddleware, getProfile);

export default router;

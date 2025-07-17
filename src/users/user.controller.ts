import { Response, Request } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import {
	AuthenticatedRequest,
	LoginInput,
	PasswordResetInput,
	PasswordResetRequestInput,
	RegisterInput,
} from "./types";
import { AuthRequest } from "../types/types";
import { AuthService } from "./user.service";
import { registerSchema } from "../validations/validations";

const authService = new AuthService();

export const login = async (
	req: Request<{}, {}, LoginInput>,
	res: Response,
) => {
	try {
		const { user, token, refreshToken } = await authService.loginUser(req.body);

		res.cookie("token", token, { maxAge: 2 * 60 * 60 * 1000 });
		res.json({
			message: "🔓 Logged In",
			token,
			refreshToken,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				department: user.department,
			},
		});
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res.status(401).json({ error: "JWT error" });
		}

		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "User not found") {
			return res.status(404).json({ error: errorMessage });
		}

		if (errorMessage === "Invalid credentials") {
			return res.status(401).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const register = async (
	req: Request<{}, {}, RegisterInput>,
	res: Response,
) => {
	try {
		const { error } = registerSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const user = await authService.registerUser(req.body);
		res.status(201).json({
			success: "User created, proceed to Login",
			data: user,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "User already exists") {
			return res.status(400).json({ error: errorMessage });
		}

		if (errorMessage === "Required fields missing") {
			return res.status(400).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const removeUser = async (req: AuthRequest, res: Response) => {
	try {
		const deletedUser = await authService.removeUser(
			req.userId!,
			req.params.id,
		);

		res.status(200).json({
			success: true,
			message: `Deleted successfully: ${deletedUser.id}`,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "You can only remove yourself") {
			return res.status(403).json({ error: errorMessage });
		}

		if (errorMessage === "User with id doesn't exist") {
			return res.status(404).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		const newToken = await authService.refreshAccessToken(token);

		res.json({ token: newToken });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "Refresh token required") {
			return res.status(400).json({ error: errorMessage });
		}

		if (errorMessage === "Invalid refresh token") {
			return res.status(401).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const requestPasswordReset = async (
	req: Request<{}, {}, PasswordResetRequestInput>,
	res: Response,
) => {
	try {
		const { email } = req.body;
		await authService.requestPasswordReset(email);

		res.json({ message: "Reset token sent to email" });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "User not found") {
			return res.status(404).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const resetPassword = async (
	req: Request<{}, {}, PasswordResetInput>,
	res: Response,
) => {
	try {
		await authService.resetPassword(req.body);

		res.json({ message: "Password updated successfully" });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "Invalid or expired token") {
			return res.status(401).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const getProfile = async (req: AuthRequest, res: Response) => {
	try {
		const user = await authService.getUserProfile(req.userId!);
		res.json(user);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Something went wrong";

		if (errorMessage === "User not found") {
			return res.status(404).json({ error: errorMessage });
		}

		return res.status(500).json({ error: errorMessage });
	}
};

export const logout = async (req: Request, res: Response) => {
	res.clearCookie("token").json({ message: "Logout successful" });
	res
		.cookie("token", " ", { maxAge: 1 })
		.json({ message: "Logout successful" });
};

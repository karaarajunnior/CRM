import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
	Resend,
	CreateEmailOptions,
	CreateEmailResponseSuccess,
	ErrorResponse,
} from "resend";
import dotenv from "dotenv";

import {
	JwtPayload,
	LoginInput,
	PasswordResetInput,
	PasswordResetRequestInput,
	RegisterInput,
	SendEmailInput,
} from "./types";
import { logActivityMiddleware } from "../middlewares/LogActivityMiddleware";

dotenv.config();
const resend = new Resend(process.env.CRM_RESEND_KEY);
const prisma = new PrismaClient();

export class AuthService {
	/* Login service */
	async loginUser(loginData: LoginInput): Promise<{
		user: any;
		token: string;
		refreshToken: string;
	}> {
		const { email, password } = loginData;

		if (!email || !password) {
			throw new Error("Missing email or password");
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new Error("User not found");
		}

		const valid: boolean = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error("Invalid credentials");
		}

		const token: string = jwt.sign(
			{ userId: user.id, role: user.roleId },
			process.env.ACCESS_TOKEN!,
			{ expiresIn: "1h" },
		);

		const refresh: string = jwt.sign(
			{ userId: user.id },
			process.env.REFRESH_TOKEN!,
			{ expiresIn: "7d" },
		);
		await prisma.user.update({
			where: {
				email,
			},
			data: {
				lastLoginAt: new Date().toISOString(),
			},
		});

		return { user, token, refreshToken: refresh };
	}

	/* Register service */
	async registerUser(registerData: RegisterInput): Promise<Partial<any>> {
		const { email, password, firstName, lastName, roleId, department } =
			registerData;

		if (
			!email ||
			!password ||
			!firstName ||
			!lastName ||
			!roleId ||
			!department
		) {
			throw new Error("Required fields missing");
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			throw new Error("User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				roleId,
				department,
			},
			omit: {
				password: true,
			},
		});

		return user;
	}

	/* Remove user service */
	async removeUser(userId: string, targetUserId: string): Promise<any> {
		if (userId !== targetUserId) {
			throw new Error("You can only remove yourself");
		}

		const deletedUser = await prisma.user.delete({
			where: { id: targetUserId },
		});

		if (!deletedUser) {
			throw new Error("User with id doesn't exist");
		}

		return deletedUser;
	}

	/* Refresh token service */
	async refreshAccessToken(refreshToken: string): Promise<string> {
		if (!refreshToken) {
			throw new Error("Refresh token required");
		}

		try {
			const payload: JwtPayload = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN!,
			) as { userId: string };

			const newToken: string = jwt.sign(
				{ userId: payload.userId },
				process.env.ACCESS_TOKEN!,
				{ expiresIn: "1h" },
			);

			return newToken;
		} catch (error) {
			throw new Error("Invalid refresh token");
		}
	}

	/* Email service */
	async sendEmail(options: SendEmailInput | CreateEmailOptions): Promise<
		| CreateEmailResponseSuccess
		| ErrorResponse
		| {
				data: null;
				error: unknown;
		  }
		| null
	> {
		try {
			const { data, error } = await resend.emails.send(options);

			if (error) {
				console.error("Resend email sending error:", error);
				return error;
			}

			console.log("Email sent successfully:", data);
			return data;
		} catch (err) {
			console.error("Unexpected error during email sending:", err);
			return { data: null, error: err };
		}
	}

	/* Password reset request service */
	async requestPasswordReset(email: string): Promise<void> {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new Error("User not found");
		}

		const resetToken: string = jwt.sign(
			{ userId: user.id },
			process.env.REFRESH_TOKEN!,
			{ expiresIn: "1m" },
		);

		console.log(`Reset token (email): ${resetToken}`);

		await this.sendEmail({
			from: "Acme <onboarding@resend.dev>",
			to: ["karaarajunior1@gmail.com", "karaarajunior057@gmail.com"],
			subject: "Password Reset Request",
			html: `<p>Reset token (email): ${resetToken}</p>`,
		});
	}

	/* Password reset service */
	async resetPassword(resetData: PasswordResetInput): Promise<void> {
		const { token, newPassword, lastName } = resetData;

		try {
			const payload: JwtPayload = jwt.verify(
				token,
				process.env.ACCESS_TOKEN!,
			) as { userId: string };

			const hashed: string = await bcrypt.hash(newPassword, 10);
			await prisma.user.update({
				where: { id: payload.userId },
				data: { password: hashed },
			});

			await this.sendEmail({
				from: "Acme <onboarding@resend.dev>",
				to: ["karaarajunior1@gmail.com", "karaarajunior057@gmail.com"],
				subject: `Password Updated - ${lastName}`,
				html: `<p>Your Password has been updated successfully</p>`,
				text: "If it's not you, please ignore",
			});
		} catch (error) {
			throw new Error("Invalid or expired token");
		}
	}

	/* Get profile service */
	async getUserProfile(userId: string): Promise<any> {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
}

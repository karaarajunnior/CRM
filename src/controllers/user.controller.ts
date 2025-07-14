import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { AuthRequest, registerSchema } from "../types/types";
import { Resend, CreateEmailOptions } from "resend";
import dotenv from "dotenv";
import { cookie } from "express-validator";

dotenv.config();
const resend = new Resend(process.env.CRM_RESEND_KEY);

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ error: "User not found" });

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return res.status(401).json({ error: "Invalid credentials" });

		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.ACCESS_TOKEN!,
			{ expiresIn: "1h" },
		);
		const refresh = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN!, {
			expiresIn: "7d",
		});

		res.cookie("token", token, { maxAge: 2 * 60 * 60 * 1000 });

		res.json({ message: "🔓 loged In", token, refreshToken: refresh });
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

/* register user */
export const register = async (req: Request, res: Response) => {
	const { error } = registerSchema.validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const { email, password, firstName, lastName, role, department } = req.body;
	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser)
			return res.status(400).json({ error: "User already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				role,
				department,
			},
			omit: {
				password,
			},
		});

		res
			.status(200)
			.json({ success: "user created, proceed to Login", data: user });
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

/* delete */
export const removeUser = async (req: AuthRequest, res: Response) => {
	try {
		if (req.userId === req.params.id) {
			const IsUserRemoved = await prisma.user.delete({
				where: { id: req.params.id },
			});

			if (!IsUserRemoved) {
				return res
					.status(400)
					.json({ success: false, ErrorMsg: "user with id doesnt exist" });
			}
			return res.status(200).json({
				success: true,
				message: `Deleted successfully: ${IsUserRemoved.id}`,
			});
		} else {
			console.log(req.userId, req.params.id);

			res.status(400).json({ message: "you can only remove yourself" });
		}
	} catch (error) {
		throw error;
	}
};

export const refreshToken = (req: Request, res: Response) => {
	const { token } = req.body;
	if (!token) return res.status(400).json({ error: "Refresh token required" });

	try {
		const payload = jwt.verify(token, process.env.REFRESH_TOKEN!) as {
			userId: string;
		};
		const newToken = jwt.sign(
			{ userId: payload.userId },
			process.env.ACCESS_TOKEN!,
			{
				expiresIn: "1h",
			},
		);
		res.json({ token: newToken });
	} catch {
		res.status(401).json({ error: "Invalid refresh token" });
	}
};

/* email to requestPasswordReset */

async function sendEmail(options: CreateEmailOptions) {
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

export const requestPasswordReset = async (req: Request, res: Response) => {
	const { email } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(404).json({ error: "User not found" });

	const resetToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN!, {
		expiresIn: "15m",
	});

	console.log(`Reset token (email): ${resetToken}`);

	sendEmail({
		from: "Acme <onboarding@resend.dev>",
		to: ["karaarajunior1@gmail.com", "karaarajunior057@gmail.com"],
		subject: "hello world",
		html: `<p>Reset token (email): ${resetToken}</p>`,
	});

	res.json({ message: "Reset token sent to email" });
};

/* password reset */
export const resetPassword = async (req: Request, res: Response) => {
	const { token, newPassword, lastName } = req.body;
	try {
		const payload = jwt.verify(token, process.env.ACCESS_TOKEN!) as {
			userId: string;
		};
		const hashed = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({
			where: { id: payload.userId },
			data: { password: hashed },
		});

		sendEmail({
			from: "Acme <onboarding@resend.dev>",
			to: ["karaarajunior1@gmail.com", "karaarajunior057@gmail.com"],
			subject: `hello ${lastName}`,
			html: `<p>Your Password has been updated successfully</p>`,
			text: "if its not you, please ignore",
		});

		res.json({ message: "Password updated successfully" });
	} catch {
		res.status(401).json({ error: "Invalid or expired token" });
	}
};

/* get profile */
export const getProfile = async (req: AuthRequest, res: Response) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.userId } });
		if (!user) return res.status(404).json({ error: "User not found" });
		res.json(user);
	} catch {
		res.status(500).json({ error: "Something went wrong" });
	}
};

/* log out */
export const logout = async (req: Request, res: Response) => {
	res.clearCookie("token").json({ message: "log out successfull" });
	//alternatively
	/*res
		.cookie("token", " ", { maxAge: 1 })
		.json({ message: "log out successfull" });
	*/
};

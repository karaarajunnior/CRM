import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { inngest } from "../client";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const signup = async (req: Request, res: Response) => {
	const { email, password, skills = [] } = req.body;

	const hashedpassword = await bcrypt.hash(password, 2);
	const user = await prisma.use.create({ data: { email, password, skills } });

	await inngest.send({
		name: "sign up",
		data: { email },
	});
	const token = await jwt.sign({ email }, process.env.SECRET_KEY || "junior", {
		expiresIn: "1h",
	});

	if (!user) throw new Error(`user with email: ${email} already exist`);

	return { user, token };
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const userExists = await prisma.use.findFirst({ where: { email } });

	if (!userExists) {
		return res.status(401).json({ msg: "email not found" });
	}

	const ismatch = await bcrypt.compare(password, userExists.email);
	if (!ismatch) {
		return res.status(401).json({ msg: "invalid password" });
	}

	const token = await jwt.sign({ email }, process.env.SECRET_KEY || "junior", {
		expiresIn: "1h",
	});

	return { token };
};

export const logout = async (req: Request, res: Response) => {
	res.clearCookie("token", { maxAge: 1 });
};

interface auth extends Request {
	user: {
		role: "admin" | "user" | "manager";
	};
}
export const updateuser = async (req: auth, res: Response) => {
	const { email, skills = [], role } = req.body;

	const user = await prisma.use.findUnique({ where: { email } });
	if (!user) return res.status(401).json("user not found");

	if (req.user?.role !== "admin") {
		res.status(403).json({ msg: "forbidden" });
	}

	const updateUser = await prisma.use.update({
		where: { email },
		data: {
			skills: skills?.length ? skills : user?.skills,
			role,
		},
	});
};

export const getUser = async (req: auth, res: Response) => {
	const users = await prisma.use.findMany();
	return users;
};

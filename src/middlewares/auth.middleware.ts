import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* authentucate */
export const authenticate = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer"))
		return res.status(401).json({ error: "Unauthorized" });

	let token = authHeader.split(" ")[1];
	if (!token) {
		token = req.cookies.token;
	}

	try {
		const payload = jwt.verify(token, process.env.ACCESS_TOKEN!) as {
			userId: string;
			role: string;
		};
		req.userId = payload.userId;
		req.userRole = payload.role;
		next();
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
};

/* authorize based on roles */
export const authorize = (roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!roles.includes(req.userRole!)) {
			return res.status(403).json({ error: "Forbidden: Access denied" });
		}
		next();
	};
};

/* based on permissions
to be fixed in the schema
export const getpermission = (permission: string) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		const userId = req.userId;
		const user = await prisma.user.findMany({
			where: {},
			include: {
				role: {
					permissions: {},
				},
			},
		});
		const haspermissions = user?.role?.permissions.some(
			(p) => p.name === permission,
		);
		if (!haspermissions) {
			res.status(403).json({ msg: "access denied" });
		}
		next();
	};
};*/

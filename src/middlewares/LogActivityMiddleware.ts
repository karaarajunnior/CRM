// middleware/logActivityMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/types";

const prisma = new PrismaClient();
export async function logActivityMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	if (!["POST", "PUT", "DELETE", "GET", "PATCH"].includes(req.method)) {
		return next();
	}

	const ipAddress = req.ip;
	const userAgent = req.get("User-Agent");
	const userId = req.userId ?? " ";
	const entityId = req.body.id || req.params.id;

	const action = `${req.method} ${req.originalUrl}`.toUpperCase();
	const entity = req.originalUrl.split("/")[2] || "UNKNOWN";

	try {
		await prisma.activityLog.create({
			data: {
				action,
				entity,
				entityId,
				userId,
				ipAddress,
				userAgent,
			},
		});
	} catch (error) {
		console.error("Failed to log activity:", error);
	}

	next();
}

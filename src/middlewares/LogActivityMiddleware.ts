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
	const userId = req.userId!;
	const entityId = req.body.id || req.params.id || req.query.id || userId;
	let changes: any | undefined;
	const action = `${req.method} ${req.originalUrl}`.toUpperCase();
	const entity = req.originalUrl.split("/")[2] || "UNKNOWN";
	const existingChange = await prisma[entity].findUnique({
		where: { id: entityId },
	});

	if (existingChange) {
		changes = {};

		for (const key of Object.keys(req.body)) {
			const oldVal = existingChange[key];
			const newVal = req.body[key];
			if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
				changes[key] = { old: oldVal, new: newVal };
			}
		}

		if (Object.keys(changes).length === 0) {
			changes = "no changes";
		}

		try {
			if (
				req.method === "GET" ||
				req.method === "PUT" ||
				req.method === "PATCH" ||
				(req.method === "POST" && entityId)
			) {
			}

			await prisma.activityLog.create({
				data: {
					action,
					entity,
					entityId,
					changes,
					userId,
					ipAddress,
					userAgent,
				},
			});
		} catch (error) {
			console.error("Failed to log activity:", error);
		}
	}
	next();
}

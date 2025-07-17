import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ActivityLogData } from "../../types/types";

const prisma = new PrismaClient();

export class ActivityLogController {
	static async getAllLogs(req: Request, res: Response): Promise<void> {
		try {
			const logs = await prisma.activityLog.findMany({
				orderBy: { createdAt: "desc" },
				// include: {
				// 	user: {
				// 		select: {
				// 			id: true,
				// 			firstName: true,
				// 			lastName: true,
				// 			email: true,
				// 		},
				// 	},
				// },
			});
			res.status(200).json(logs);
		} catch (error) {
			console.error("Failed to fetch activity logs:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	static async getLogsByUser(req: Request, res: Response) {
		const { userId } = req.params;

		if (!userId) throw new Error("user id missing in params");
		try {
			const logs = await prisma.activityLog.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			});
			res.status(200).json(logs);
		} catch (error) {
			console.error("Failed to fetch user activity logs:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	static async getLogById(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) throw new Error("id missing in params");

		try {
			const log = await prisma.activityLog.findUnique({
				where: { id },
				// include: {
				// 	user: {
				// 		select: {
				// 			id: true,
				// 			firstName: true,
				// 			lastName: true,
				// 			email: true,
				// 		},
				// 	},
				// },
			});

			if (!log) {
				return res.status(404).json({ message: "Log not found" });
			}

			res.status(200).json(log);
		} catch (error) {
			console.error("Failed to fetch activity log:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	static async createLog(req: Request, res: Response): Promise<void> {
		const { action, entity, entityId, changes, userId, ipAddress, userAgent } =
			req.body as ActivityLogData;

		if (!action || !entity || !entityId || !userId) {
			res.status(400).json({ message: "Missing required fields" });
		}

		try {
			await prisma.activityLog.create({
				data: {
					action,
					entity,
					entityId,
					changes: changes || null,
					userId,
					ipAddress: req.ip,
					userAgent: req.get("User-Agent") || "unknown",
				},
			});

			res.status(201).json({ message: "Activity log created" });
		} catch (error) {
			console.error("Failed to log activity:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

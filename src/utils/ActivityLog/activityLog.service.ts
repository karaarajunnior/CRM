import { Request } from "express";
import { ActivityLogData, AuthRequest } from "../../types/types";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ActivityLogService {
	static async log(data): Promise<void> {
		try {
			await prisma.activityLog.create({
				data: {
					action: data.action,
					entity: data.entity,
					entityId: data.entityId,
					changes: data.changes || null,
					userId: data.userId,
					ipAddress: data.ipAddress,
					userAgent: data.userAgent,
				},
			});
		} catch (error) {
			console.error("Failed to log activity:", error);
		}
	}

	static async logFromRequest(
		req: AuthRequest,
		action: string,
		entity: string,
		entityId: string,
		changes?: any,
	): Promise<void> {
		if (!req.user) return;

		await this.log({
			action,
			entity,
			entityId,
			changes,
			userId: req.user.id,
			ipAddress: req.ip,
			userAgent: req.get("User-Agent"),
		});
	}
}

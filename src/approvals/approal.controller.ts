import { Request, Response } from "express";
import { ApprovalService } from "./approval.service";

export class ApprovalController {
	static async processApproval(req: Request, res: Response) {
		try {
			const { approvalRequestId, userId, roleId, action, remarks } = req.body;

			const result = await ApprovalService.processApprovalAction({
				approvalRequestId,
				userId,
				roleId,
				action,
				remarks,
			});

			return res.status(200).json({ message: "Action processed", result });
		} catch (error: any) {
			console.error("Approval error:", error);
			return res.status(400).json({ error: error.message });
		}
	}
}

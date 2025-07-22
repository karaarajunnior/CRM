import { PrismaClient } from "@prisma/client";
import { ApprovalInput } from "./types";
const prisma = new PrismaClient();

export class ApprovalService {
	static async processApprovalAction(data: ApprovalInput) {
		const { approvalRequestId, userId, roleId, action, remarks } = data;

		const result = await prisma.$executeRawUnsafe(`
      CALL process_approval_action(
        ${approvalRequestId},
        ${userId},
        ${roleId},
        '${action}',
        '${remarks}'
      );
    `);

		return result;
	}
}

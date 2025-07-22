export interface ApprovalInput {
	approvalRequestId: number;
	userId: number;
	roleId: number;
	action: "APPROVE" | "REJECT" | "RETURN";
	remarks: string;
}

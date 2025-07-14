import Joi from "joi";
import { Request } from "express";
import { body, param, query } from "express-validator";
export const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	role: Joi.string().valid(
		"ADMIN",
		"SALES_MANAGER",
		"SALES_REP",
		"SUPPORT",
		"MARKETING",
	),
	department: Joi.string().optional(),
});

export const createNoteValidation = [
	body("title").optional().trim().isLength({ max: 200 }),
	body("content").trim().isLength({ min: 1, max: 5000 }),
];

export const updateTaskValidation = [
	param("id").isUUID(),
	body("title").optional().trim().isLength({ min: 1, max: 200 }),
	body("description").optional().trim().isLength({ max: 1000 }),
	body("type")
		.optional()
		.isIn(["FOLLOW_UP", "DEMO", "PROPOSAL", "CONTRACT", "SUPPORT", "MEETING"]),
	body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	body("status")
		.optional()
		.isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
	body("dueDate").optional().isISO8601(),
	body("completedAt").optional().isISO8601(),
	body("customerId").optional().isUUID(),
	body("dealId").optional().isUUID(),
	body("assignedUserId").optional().isUUID(),
];

export const createTaskValidation = [
	body("title").trim().isLength({ min: 1, max: 200 }),
	body("description").optional().trim().isLength({ max: 1000 }),
	body("type")
		.optional()
		.isIn(["FOLLOW_UP", "DEMO", "PROPOSAL", "CONTRACT", "SUPPORT", "MEETING"]),
	body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	body("dueDate").isISO8601(),
	body("customerId").optional().isUUID(),
	body("dealId").optional().isUUID(),
	body("assignedUserId").optional().isUUID(),
];

export const updateInteractionValidation = [
	param("id").isUUID(),
	body("type")
		.optional()
		.isIn(["EMAIL", "CALL", "MEETING", "SMS", "SOCIAL", "WEBSITE"]),
	body("subject").optional().trim().isLength({ min: 1, max: 200 }),
	body("content").optional().trim().isLength({ max: 2000 }),
	body("direction").optional().isIn(["INBOUND", "OUTBOUND"]),
	body("customerId").optional().isUUID(),
	body("dealId").optional().isUUID(),
	body("scheduledAt").optional().isISO8601(),
	body("completedAt").optional().isISO8601(),
];

export const createInteractionValidation = [
	body("type").isIn(["EMAIL", "CALL", "MEETING", "SMS", "SOCIAL", "WEBSITE"]),
	body("subject").trim().isLength({ min: 1, max: 200 }),
	body("content").optional().trim().isLength({ max: 2000 }),
	body("direction").isIn(["INBOUND", "OUTBOUND"]),
	body("customerId").isUUID(),
	body("dealId").optional().isUUID(),
	body("scheduledAt").optional().isISO8601(),
];

export const createDealValidation = [
	body("title").trim().isLength({ min: 1, max: 200 }),
	body("description").optional().trim().isLength({ max: 1000 }),
	body("value").isDecimal({ decimal_digits: "0,2" }),
	body("currency").optional().isLength({ min: 3, max: 3 }),
	body("stage")
		.optional()
		.isIn([
			"PROSPECTING",
			"QUALIFICATION",
			"PROPOSAL",
			"NEGOTIATION",
			"CLOSED_WON",
			"CLOSED_LOST",
		]),
	body("probability").optional().isInt({ min: 0, max: 100 }),
	body("expectedCloseDate").isISO8601(),
	body("customerId").isUUID(),
	body("assignedUserId").optional().isUUID(),
];

export const updateDealValidation = [
	param("id").isUUID(),
	body("title").optional().trim().isLength({ min: 1, max: 200 }),
	body("description").optional().trim().isLength({ max: 1000 }),
	body("value").optional().isDecimal({ decimal_digits: "0,2" }),
	body("currency").optional().isLength({ min: 3, max: 3 }),
	body("stage")
		.optional()
		.isIn([
			"PROSPECTING",
			"QUALIFICATION",
			"PROPOSAL",
			"NEGOTIATION",
			"CLOSED_WON",
			"CLOSED_LOST",
		]),
	body("probability").optional().isInt({ min: 0, max: 100 }),
	body("expectedCloseDate").optional().isISO8601(),
	body("actualCloseDate").optional().isISO8601(),
	body("customerId").optional().isUUID(),
	body("assignedUserId").optional().isUUID(),
];

export const loginValidation = [
	body("email").isEmail().normalizeEmail(),
	body("password").isLength({ min: 6 }),
];

export const registerValidation = [
	body("email").isEmail().normalizeEmail(),
	body("password").isLength({ min: 6 }),
	body("firstName").trim().isLength({ min: 1, max: 50 }),
	body("lastName").trim().isLength({ min: 1, max: 50 }),
	body("role")
		.optional()
		.isIn(["ADMIN", "SALES_MANAGER", "SALES_REP", "SUPPORT", "MARKETING"]),
	body("department").optional().trim().isLength({ max: 100 }),
];

export const createCustomerValidation = [
	body("email").isEmail().normalizeEmail(),
	body("firstName").trim().isLength({ min: 1, max: 50 }),
	body("lastName").trim().isLength({ min: 1, max: 50 }),
	body("company").optional().trim().isLength({ max: 100 }),
	body("jobTitle").optional().trim().isLength({ max: 100 }),
	body("phone").optional().trim().isLength({ max: 20 }),
	body("status").optional().isIn(["LEAD", "PROSPECT", "CUSTOMER", "INACTIVE"]),
	body("score").optional().isInt({ min: 0, max: 100 }),
	body("lifetimeValue").optional().isDecimal({ decimal_digits: "0,2" }),
	body("assignedUserId").optional().isUUID(),
];

export const updateCustomerValidation = [
	param("id").isUUID().withMessage("invalid id"),
	body("email").optional().isEmail().normalizeEmail(),
	body("firstName").optional().trim().isLength({ min: 1, max: 50 }),
	body("lastName").optional().trim().isLength({ min: 1, max: 50 }),
	body("company").optional().trim().isLength({ max: 100 }),
	body("jobTitle").optional().trim().isLength({ max: 100 }),
	body("phone").optional().trim().isLength({ max: 20 }),
	body("status").optional().isIn(["LEAD", "PROSPECT", "CUSTOMER", "INACTIVE"]),
	body("score").optional().isInt({ min: 0, max: 100 }),
	body("lifetimeValue").optional().isDecimal({ decimal_digits: "0,2" }),
	body("assignedUserId").optional().isUUID(),
];

export const contactValidation = [
	param("id").isUUID(),
	body("type").isIn(["email", "phone", "mobile", "fax", "website"]),
	body("value").trim().isLength({ min: 1, max: 255 }),
	body("isPrimary").isBoolean(),
	body("label").optional().trim().isLength({ max: 50 }),
];

export const customFieldValidation = [
	param("id").isUUID(),
	body("name").trim().isLength({ min: 1, max: 50 }),
	body("type").isIn([
		"text",
		"number",
		"date",
		"boolean",
		"select",
		"multiselect",
	]),
	body("value").exists(),
	body("options").optional().isArray(),
];

export const updateNoteValidation = [
	param("id").isUUID().withMessage("Invalid note ID format"),
	body("title")
		.optional()
		.isString()
		.withMessage("Title must be a string")
		.isLength({ min: 1, max: 255 })
		.withMessage("Title must be between 1 and 255 characters"),
	body("content")
		.optional()
		.isString()
		.withMessage("Content must be a string")
		.isLength({ min: 1, max: 10000 })
		.withMessage("Content must be between 1 and 10000 characters"),
	body("contactId")
		.optional()
		.isUUID()
		.withMessage("Contact ID must be a valid UUID"),
	body("dealId")
		.optional()
		.isUUID()
		.withMessage("Deal ID must be a valid UUID"),
	body("taskId")
		.optional()
		.isUUID()
		.withMessage("Task ID must be a valid UUID"),
	body("interactionId")
		.optional()
		.isUUID()
		.withMessage("Interaction ID must be a valid UUID"),
	body("isPrivate")
		.optional()
		.isBoolean()
		.withMessage("isPrivate must be a boolean"),
	body("tags")
		.optional()
		.isArray()
		.withMessage("Tags must be an array")
		.custom((tags) => {
			if (tags.some((tag: any) => typeof tag !== "string")) {
				throw new Error("All tags must be strings");
			}
			return true;
		}),
];
export const paginationValidation = [
	query("page").optional().isInt({ min: 1 }),
	query("limit").optional().isInt({ min: 1, max: 100 }),
	query("search").optional().trim().isLength({ max: 255 }),
];

export interface AuthUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface AuthRequest extends Request {
	user?: AuthUser;
}

export interface PaginationQuery {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface CustomerFilter {
	status?: string;
	assignedUserId?: string;
	tags?: string[];
	minScore?: number;
	maxScore?: number;
	dateFrom?: Date;
	dateTo?: Date;
}

export interface ContactInfo {
	type: "email" | "phone" | "mobile" | "fax" | "website";
	value: string;
	isPrimary: boolean;
	label?: string;
}

export interface CustomField {
	name: string;
	type: "text" | "number" | "date" | "boolean" | "select" | "multiselect";
	value: any;
	options?: string[];
}

export interface DocumentAttachment {
	id: string;
	name: string;
	type: string;
	size: number;
	url: string;
	uploadedAt: Date;
	uploadedBy: string;
}

export interface AuthRequest extends Request {
	userId?: string;
	userRole?: string;
}

export interface ActivityLogData {
	action: string;
	entity: string;
	entityId: string;
	changes?: any;
	userId: string;
	ipAddress?: string;
	userAgent?: string;
}

export const CreateDealDto = [];
export const UpdateDealDto = [];

export const createDealDto = [];

export const CreateNoteDto = [];

export const UpdateNoteDto = [];
export const CreateInteractionDto = [];
export const UpdateInteractionDto = [];

export const taskIdParam = param("id").isUUID().withMessage("Invalid task ID");

export const CreateTaskDto = [
	body("title").isString().notEmpty(),
	body("dueDate").isISO8601().toDate().optional(),
	body("customerId").isUUID().withMessage("customerId must be UUID"),
];

export const UpdateTaskDto = [
	body("title").isString().optional(),
	body("status").isIn(["OPEN", "IN_PROGRESS", "DONE"]).optional(),
	body("dueDate").isISO8601().toDate().optional(),
];

import { body, param, query } from "express-validator";
import z from "zod";
import Joi from "joi";
import { RegisterInput } from "../users/types";

export const registerSchema = Joi.object<RegisterInput>({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	roleId: Joi.number(),
	department: Joi.string().optional(),
});

// Date range validation
export const dateRangeSchema = z
	.object({
		startDate: z.string().datetime(),
		endDate: z.string().datetime(),
	})
	.refine(
		(data) => {
			const startDate = new Date(data.startDate);
			const endDate = new Date(data.endDate);
			return startDate <= endDate;
		},
		{
			message: "Start date must be before or equal to end date",
		},
	);

// Analytics filter validation
export const analyticsFilterSchema = z.object({
	dateRange: dateRangeSchema.optional(),
	userId: z.string().uuid().optional(),
	customerId: z.string().uuid().optional(),
	dealId: z.string().uuid().optional(),
	department: z.string().optional(),
	role: z
		.enum(["ADMIN", "SALES_MANAGER", "SALES_REP", "SUPPORT", "MARKETING"])
		.optional(),
	status: z.string().optional(),
	stage: z
		.enum([
			"PROSPECTING",
			"QUALIFICATION",
			"PROPOSAL",
			"NEGOTIATION",
			"CLOSED_WON",
			"CLOSED_LOST",
		])
		.optional(),
});

// Analytics query validation
export const analyticsQuerySchema = z.object({
	type: z.enum([
		"sales",
		"customers",
		"deals",
		"interactions",
		"tasks",
		"activities",
		"dashboard",
	]),
	filters: analyticsFilterSchema.optional(),
	groupBy: z.string().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	limit: z.number().int().positive().max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});

// Sales metrics query validation
export const salesMetricsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeComparison: z.boolean().optional(),
	groupBy: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
});

// User performance query validation
export const userPerformanceQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeTeam: z.boolean().optional(),
	sortBy: z
		.enum(["revenue", "deals", "conversion", "tasks", "interactions"])
		.optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	limit: z.number().int().positive().max(100).optional(),
});

// Customer analytics query validation
export const customerAnalyticsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeSegmentation: z.boolean().optional(),
	includeLifetimeValue: z.boolean().optional(),
	sortBy: z.enum(["lifetimeValue", "totalDeals", "createdAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Deal analytics query validation
export const dealAnalyticsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includePipeline: z.boolean().optional(),
	includeConversion: z.boolean().optional(),
	groupBy: z.enum(["stage", "month", "quarter", "year", "user"]).optional(),
});

// Interaction analytics query validation
export const interactionAnalyticsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeResponseTime: z.boolean().optional(),
	groupBy: z.enum(["type", "direction", "day", "week", "month"]).optional(),
});

// Task analytics query validation
export const taskAnalyticsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeOverdue: z.boolean().optional(),
	groupBy: z.enum(["priority", "status", "type", "user"]).optional(),
});

// Custom report validation
export const customReportSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	type: z.enum([
		"sales",
		"customers",
		"deals",
		"interactions",
		"tasks",
		"activities",
	]),
	filters: analyticsFilterSchema.optional(),
	metrics: z.array(z.string()).min(1),
	groupBy: z.string().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Report export validation
export const reportExportSchema = z.object({
	format: z.enum(["csv", "excel", "pdf"]),
	reportType: z.enum([
		"sales",
		"customers",
		"deals",
		"interactions",
		"tasks",
		"activities",
	]),
	filters: analyticsFilterSchema.optional(),
	filename: z.string().min(1).max(100).optional(),
});

// Dashboard metrics query validation
export const dashboardMetricsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeComparison: z.boolean().optional(),
	includeForecasting: z.boolean().optional(),
	refreshCache: z.boolean().optional(),
});

// Forecast query validation
export const forecastQuerySchema = z.object({
	type: z.enum(["revenue", "deals", "customers"]),
	period: z.enum(["month", "quarter", "year"]),
	horizon: z.number().int().min(1).max(12),
	filters: analyticsFilterSchema.optional(),
});

// Leaderboard query validation
export const leaderboardQuerySchema = z.object({
	metric: z.enum(["revenue", "deals", "conversion", "tasks", "interactions"]),
	period: z.enum(["week", "month", "quarter", "year"]),
	limit: z.number().int().min(1).max(50).optional(),
	department: z.string().optional(),
	role: z
		.enum(["ADMIN", "SALES_MANAGER", "SALES_REP", "SUPPORT", "MARKETING"])
		.optional(),
});

// Performance goal validation
export const performanceGoalSchema = z.object({
	userId: z.string().uuid(),
	metric: z.string().min(1),
	target: z.number().positive(),
	period: z.enum(["week", "month", "quarter", "year"]),
});

// Comparison query validation
export const comparisonQuerySchema = z.object({
	type: z.enum(["sales", "customers", "deals", "interactions", "tasks"]),
	currentPeriod: dateRangeSchema,
	comparisonPeriod: dateRangeSchema,
	filters: analyticsFilterSchema.optional(),
});

// Pipeline metrics query validation
export const pipelineMetricsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeConversion: z.boolean().optional(),
	includeTimeInStage: z.boolean().optional(),
});

// Customer segmentation query validation
export const customerSegmentationQuerySchema = z.object({
	segmentBy: z.enum([
		"lifetimeValue",
		"totalDeals",
		"company",
		"source",
		"status",
	]),
	filters: analyticsFilterSchema.optional(),
	includeMetrics: z.boolean().optional(),
});

// Regional metrics query validation
export const regionalMetricsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	groupBy: z.enum(["country", "state", "city"]).optional(),
	includeComparison: z.boolean().optional(),
});

// Product metrics query validation
export const productMetricsQuerySchema = z.object({
	filters: analyticsFilterSchema.optional(),
	includeGrowth: z.boolean().optional(),
	sortBy: z.enum(["revenue", "deals", "growth"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Validation helper functions
export const validateDateRange = (
	startDate: string,
	endDate: string,
): boolean => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	return start <= end && start <= new Date() && end <= new Date();
};

export const validatePagination = (
	limit?: number,
	offset?: number,
): boolean => {
	if (limit && (limit <= 0 || limit > 1000)) return false;
	if (offset && offset < 0) return false;
	return true;
};

export const validateMetrics = (
	metrics: string[],
	allowedMetrics: string[],
): boolean => {
	return metrics.every((metric) => allowedMetrics.includes(metric));
};

export const validateUserId = (userId: string): boolean => {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(userId);
};

export const validatePeriod = (period: string): boolean => {
	const validPeriods = ["day", "week", "month", "quarter", "year"];
	return validPeriods.includes(period);
};

export const validateRole = (role: string): boolean => {
	const validRoles = [
		"ADMIN",
		"SALES_MANAGER",
		"SALES_REP",
		"SUPPORT",
		"MARKETING",
	];
	return validRoles.includes(role);
};

export const validateDealStage = (stage: string): boolean => {
	const validStages = [
		"PROSPECTING",
		"QUALIFICATION",
		"PROPOSAL",
		"NEGOTIATION",
		"CLOSED_WON",
		"CLOSED_LOST",
	];
	return validStages.includes(stage);
};

export const validateInteractionType = (type: string): boolean => {
	const validTypes = ["EMAIL", "CALL", "MEETING", "SMS", "SOCIAL", "WEBSITE"];
	return validTypes.includes(type);
};

export const validateTaskStatus = (status: string): boolean => {
	const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
	return validStatuses.includes(status);
};

export const validateCustomerStatus = (status: string): boolean => {
	const validStatuses = ["LEAD", "PROSPECT", "CUSTOMER", "INACTIVE"];
	return validStatuses.includes(status);
};

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
	body("type").optional(),
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

// Export validation schemas
export const validationSchemas = {
	dateRange: dateRangeSchema,
	analyticsFilter: analyticsFilterSchema,
	analyticsQuery: analyticsQuerySchema,
	salesMetricsQuery: salesMetricsQuerySchema,
	userPerformanceQuery: userPerformanceQuerySchema,
	customerAnalyticsQuery: customerAnalyticsQuerySchema,
	dealAnalyticsQuery: dealAnalyticsQuerySchema,
	interactionAnalyticsQuery: interactionAnalyticsQuerySchema,
	taskAnalyticsQuery: taskAnalyticsQuerySchema,
	customReport: customReportSchema,
	reportExport: reportExportSchema,
	dashboardMetricsQuery: dashboardMetricsQuerySchema,
	forecastQuery: forecastQuerySchema,
	leaderboardQuery: leaderboardQuerySchema,
	performanceGoal: performanceGoalSchema,
	comparisonQuery: comparisonQuerySchema,
	pipelineMetricsQuery: pipelineMetricsQuerySchema,
	customerSegmentationQuery: customerSegmentationQuerySchema,
	regionalMetricsQuery: regionalMetricsQuerySchema,
	productMetricsQuery: productMetricsQuerySchema,
};

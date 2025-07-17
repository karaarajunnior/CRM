import { Request } from "express";

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

export interface PaginationResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
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

export interface ContactInput {
	customerId: string;
	taskId: string;
	type: string;
	value: string;
	noteId: string;
}

export interface ContactUpdateInput {
	type: string;
	value: string;
	noteId: string;
	taskId: string;
	customerId: string;
}

export interface Contact {
	id: string;
	customerId: string;
	taskId: string;
	type: string;
	value: string;
	noteId: string;
}

export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	contacts: T[];
	pagination: PaginationMeta;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
	pagination?: PaginationMeta;
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

export interface DateRange {
	startDate: string;
	endDate: string;
}

export interface AnalyticsFilter {
	dateRange?: DateRange;
	userId?: string;
	customerId?: string;
	dealId?: string;
	department?: string;
	role?: string;
	status?: string;
	stage?: string;
}

export interface SalesMetrics {
	totalRevenue: number;
	totalDeals: number;
	avgDealValue: number;
	conversionRate: number;
	winRate: number;
	totalCustomers: number;
	newCustomers: number;
	lostCustomers: number;
	pipeline: {
		totalValue: number;
		totalDeals: number;
		avgDealSize: number;
	};
}

export interface UserPerformance {
	userId: string;
	userName: string;
	department: string;
	role: string;
	metrics: {
		totalRevenue: number;
		totalDeals: number;
		avgDealValue: number;
		conversionRate: number;
		completedTasks: number;
		totalInteractions: number;
		customerCount: number;
	};
}

export interface CustomerMetrics {
	totalCustomers: number;
	activeCustomers: number;
	newCustomers: number;
	customersByStatus: {
		[key: string]: number;
	};
	avgCustomerLifetimeValue: number;
	topCustomers: {
		id: string;
		name: string;
		company: string;
		lifetimeValue: number;
		totalDeals: number;
	}[];
}

export interface DealAnalytics {
	totalDeals: number;
	totalValue: number;
	avgDealSize: number;
	winRate: number;
	dealsByStage: {
		[key: string]: {
			count: number;
			value: number;
		};
	};
	dealsByMonth: {
		month: string;
		count: number;
		value: number;
	}[];
	avgSalesCycle: number;
}

export interface InteractionAnalytics {
	totalInteractions: number;
	interactionsByType: {
		[key: string]: number;
	};
	interactionsByDirection: {
		INBOUND: number;
		OUTBOUND: number;
	};
	avgResponseTime: number;
	completionRate: number;
}

export interface TaskAnalytics {
	totalTasks: number;
	completedTasks: number;
	overdueTasks: number;
	tasksByPriority: {
		[key: string]: number;
	};
	tasksByStatus: {
		[key: string]: number;
	};
	avgCompletionTime: number;
	completionRate: number;
}

export interface ActivityAnalytics {
	totalActivities: number;
	activitiesByAction: {
		[key: string]: number;
	};
	activitiesByUser: {
		userId: string;
		userName: string;
		activityCount: number;
	}[];
	activitiesByEntity: {
		[key: string]: number;
	};
}

export interface DashboardMetrics {
	sales: SalesMetrics;
	customers: CustomerMetrics;
	deals: DealAnalytics;
	interactions: InteractionAnalytics;
	tasks: TaskAnalytics;
	activities: ActivityAnalytics;
	userPerformance: UserPerformance[];
}

export interface RevenueData {
	period: string;
	revenue: number;
	deals: number;
	customers: number;
}

export interface FunnelData {
	stage: string;
	count: number;
	value: number;
	conversionRate: number;
}

export interface TrendData {
	period: string;
	value: number;
	change: number;
	changePercent: number;
}

export interface ReportExport {
	format: "csv" | "excel" | "pdf";
	data: any;
	filename: string;
	headers: string[];
}

export interface CustomReport {
	id: string;
	name: string;
	description?: string;
	type:
		| "sales"
		| "customers"
		| "deals"
		| "interactions"
		| "tasks"
		| "activities";
	filters: AnalyticsFilter;
	metrics: string[];
	groupBy?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface AnalyticsQuery {
	type:
		| "sales"
		| "customers"
		| "deals"
		| "interactions"
		| "tasks"
		| "activities"
		| "dashboard";
	filters?: AnalyticsFilter;
	groupBy?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	limit?: number;
	offset?: number;
}

export interface ComparisonData {
	current: any;
	previous: any;
	change: number;
	changePercent: number;
	trend: "up" | "down" | "stable";
}

export interface PipelineMetrics {
	stage: string;
	count: number;
	value: number;
	avgDealSize: number;
	conversionRate: number;
	avgTimeInStage: number;
}

export interface CustomerSegment {
	segment: string;
	count: number;
	percentage: number;
	avgLifetimeValue: number;
	avgDealSize: number;
}

export interface PerformanceGoal {
	id: string;
	userId: string;
	metric: string;
	target: number;
	current: number;
	period: string;
	progress: number;
	status: "on_track" | "behind" | "ahead";
}

export interface Forecast {
	period: string;
	predictedRevenue: number;
	confidence: number;
	factors: {
		factor: string;
		impact: number;
	}[];
}

export interface LeaderboardEntry {
	userId: string;
	userName: string;
	department: string;
	metric: string;
	value: number;
	rank: number;
	change: number;
}

export interface RegionalMetrics {
	region: string;
	revenue: number;
	deals: number;
	customers: number;
	avgDealSize: number;
	conversionRate: number;
}

export interface ProductMetrics {
	product: string;
	revenue: number;
	deals: number;
	avgDealSize: number;
	growthRate: number;
}

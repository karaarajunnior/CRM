import { Request } from "express";

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
	};
}

export interface importResult {
	total: number;
	successful: number;
	failed: number;
	errors: string[];
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
export interface CustomerInput {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	status?: string;
	score?: number;
	tags?: string[];
	assignedUserId?: string;
	[customField: string]: any; // For extensibility
}

export interface CustomerUpdateInput extends Partial<CustomerInput> {}

//Used for addContactMethod and addCustomField:
export interface ContactMethodInput {
	type: "phone" | "email" | "social" | string;
	value: string;
	note?: string;
}

export interface CustomField {
	name: string;
	type: "text" | "number" | "date" | "boolean" | "select" | "multiselect";
	value: any;
	options?: string[];
}
export interface DocumentUploadResult {
	id: string;
	fileName: string;
	filePath: string;
	fileSize: number;
	uploadedBy: string;
	uploadedAt: Date;
}
export interface CustomerStats {
	totalDeals: number;
	totalInteractions: number;
	lastInteractionDate: Date | null;
	score: number;
}
export interface CustomerSegmentCriteria {
	minScore?: number;
	maxScore?: number;
	tag?: string;
	status?: string;
}

export interface CustomerSegmentResult {
	segmentName: string;
	customers: Customer[];
}
export interface ExportResult {
	buffer: Buffer;
	filename: string;
	contentType: string;
}
export interface Importresult {
	successCount: number;
	failureCount: number;
	errors?: Array<{ row: number; message: string }>;
}

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
export interface Customer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	status: string;
	score?: number;
	tags?: string[];
	assignedUserId: string;
	createdAt: Date;
	updatedAt: Date;
	[customField: string]: any;
}

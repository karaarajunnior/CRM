import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service";
import { createError } from "../middlewares/errorHandler";
import { createPaginationResult } from "../utils/pagination";
import { ActivityLogService } from "../utils/ActivityLog/activityLog.service";
import { createClient } from "redis";
import {
	ApiResponse,
	ContactMethodInput,
	Customer,
	CustomerSegmentCriteria,
	CustomerStats,
	CustomerUpdateInput,
	PaginatedResult,
} from "../customers/types";
import { CustomField } from "../customers/types";

const redisClient = createClient();
interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
	};
}

export class CustomerController {
	/* create customer*/
	static async createCustomer(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const customerData = {
				...req.body,
				assignedUserId: req.body.assignedUserId || req.user!.id,
			};

			const customer = await CustomerService.createCustomer(customerData);

			await ActivityLogService.logFromRequest(
				req,
				"CREATE",
				"Customer",
				customer.id,
				{ customerData },
			);

			res.status(201).json({
				success: true,
				data: customer,
				message: "Customer created successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* get customer*/
	static async getCustomers(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			if (!redisClient.isOpen) await redisClient.connect();
			const cachedData = await redisClient.get("customer");

			if (cachedData) {
				res.status(200).json({ data: cachedData, source: "cache by redis" });
			}

			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 5;
			const search = req.query.search as string;
			const filters = {
				status: req.query.status as string,
				assignedUserId: req.query.assignedUserId as string,
				tags: req.query.tags
					? (req.query.tags as string).split(",")
					: undefined,
				minScore: req.query.minScore
					? parseInt(req.query.minScore as string)
					: undefined,
				maxScore: req.query.maxScore
					? parseInt(req.query.maxScore as string)
					: undefined,
			};

			const { customers, total } = await CustomerService.getCustomers(
				page,
				limit,
				search,
				filters,
			);

			const result = createPaginationResult(customers, total, page, limit);

			redisClient.setEx("customer", 3600, JSON.stringify(result.data));

			res.json({
				success: true,
				data: result.data,
				pagination: result.pagination,
			});
		} catch (error) {
			next(error);
		}
	}
	/* get customerBy id*/
	static async getCustomerById(
		req: Request<{ id: string }, {}, {}>,
		res: Response<ApiResponse<any>>,
		next: NextFunction,
	) {
		try {
			const includeRelations = req.query.include === "true";

			const customer = await CustomerService.getCustomerById(
				req.params.id,
				includeRelations,
			);

			if (!customer) {
				throw createError("Customer not found", 404);
			}

			res.json({
				success: true,
				data: customer,
			});
		} catch (error) {
			next(error);
		}
	}

	/* uodate customer*/
	static async updateCustomer(
		req: Request<{ id: string }, {}, CustomerUpdateInput>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const updateData = req.body;

			const existingCustomer = await CustomerService.getCustomerById(id);
			if (!existingCustomer) {
				throw createError("Customer not found", 404);
			}

			const customer = await CustomerService.updateCustomer(id, updateData);

			await ActivityLogService.logFromRequest(req, "UPDATE", "Customer", id, {
				before: existingCustomer,
				after: updateData,
			});

			res.json({
				success: true,
				data: customer,
				message: "Customer updated successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* remove customer*/
	static async deleteCustomer(
		req: AuthenticatedRequest,
		res: Response<ApiResponse<null>>,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;

			const customer = await CustomerService.getCustomerById(id);
			if (!customer) {
				throw createError("Customer not found", 404);
			}

			await CustomerService.deleteCustomer(id);

			await ActivityLogService.logFromRequest(req, "DELETE", "Customer", id, {
				deletedCustomer: customer,
			});

			res.json({
				success: true,
				message: "Customer deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* add contact method*/
	static async addContactMethod(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const contactData = req.body;

			const contact: ContactMethodInput =
				await CustomerService.addContactMethod(id, contactData);

			await ActivityLogService.logFromRequest(
				req,
				"ADD_CONTACT",
				"Customer",
				id,
				{ contactData },
			);

			res.status(201).json({
				success: true,
				data: contact,
				message: "Contact method added successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* custom field*/
	static async addCustomField(
		req: Request<{ id: string }, {}, CustomField>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const fieldData = req.body;

			const field = await CustomerService.addCustomField(id, fieldData);

			await ActivityLogService.logFromRequest(
				req,
				"ADD_CUSTOM_FIELD",
				"Customer",
				id,
				{ fieldData },
			);

			res.status(201).json({
				success: true,
				data: field,
				message: "Custom field added successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* upload document*/
	static async uploadDocument(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const file = req.file;

			if (!file) {
				throw createError("No file uploaded", 400);
			}

			const document = await CustomerService.uploadDocument(
				id,
				file,
				req.user!.id,
			);

			await ActivityLogService.logFromRequest(
				req,
				"UPLOAD_DOCUMENT",
				"Customer",
				id,
				{ fileName: file.originalname, fileSize: file.size },
			);

			res.status(201).json({
				success: true,
				data: document,
				message: "Document uploaded successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	/* customer timeline*/
	static async getCustomerTimeline(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 20;

			const timeline = await CustomerService.getCustomerTimeline(
				id,
				page,
				limit,
			);

			res.json({
				success: true,
				data: timeline,
			});
		} catch (error) {
			next(error);
		}
	}
	/*customer statistics*/
	static async getCustomerStats(
		req: Request<{ id: string }, {}, CustomerStats>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const stats = await CustomerService.getCustomerStats(id);

			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	}
	/* customers ranked*/
	static async segmentCustomers(
		req: Request<{}, {}, CustomerSegmentCriteria>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const criteria = req.body;
			const segments = await CustomerService.segmentCustomers(criteria);

			res.json({
				success: true,
				data: segments,
			});
		} catch (error) {
			next(error);
		}
	}
	/* export and import customer*/
	static async exportCustomers(
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const format = (req.query.format as "csv" | "excel") || "csv";
			const filters = req.query.filters
				? JSON.parse(req.query.filters as string)
				: {};

			const { buffer, filename, contentType } =
				await CustomerService.exportCustomers(format, filters);

			res.setHeader("Content-Type", contentType);
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="${filename}"`,
			);
			res.send(buffer);
		} catch (error) {
			next(error);
		}
	}

	static async importCustomers(
		req: AuthenticatedRequest,
		res: Response<ApiResponse<any>>,
		next: NextFunction,
	) {
		try {
			const file = req.file;
			if (!file) {
				throw createError("No file uploaded", 400);
			}

			const result = await CustomerService.importCustomers(file, req.user!.id);

			await ActivityLogService.logFromRequest(
				req,
				"IMPORT_CUSTOMERS",
				"Customer",
				"bulk",
				{ importResult: result },
			);

			res.json({
				success: true,
				data: result,
				message: "Customers imported successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}

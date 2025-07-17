import { createError } from "../middlewares/errorHandler";
import { ContactInfo, DocumentAttachment } from "../types/types";

import { CustomField } from "./types";
import * as XLSX from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomerService {
	static async createCustomer(customerData: any) {
		const { tags, contacts, customFields, ...data } = customerData;

		return await prisma.customer.create({
			data: {
				...data,

				customFields: customFields || [],

				customerTags: tags
					? {
							create: tags.map((tagName: string) => ({
								tag: {
									connectOrCreate: {
										where: { name: tagName },
										create: { name: tagName },
									},
								},
							})),
						}
					: undefined,
			},
			include: {
				assignedUser: {
					select: { id: true, firstName: true, lastName: true, email: true },
				},
				customerTags: {
					include: { tag: true },
				},
				_count: {
					select: { deals: true, interactions: true, tasks: true, notes: true },
				},
			},
		});
	}

	static async getCustomers(
		page: number,
		limit: number,
		search?: string,
		filters?: any,
	) {
		const skip = (page - 1) * limit;
		const where: any = {
			isActive: true,
		};

		if (search) {
			where.OR = [
				{ firstName: { contains: search, mode: "insensitive" } },
				{ lastName: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ company: { contains: search, mode: "insensitive" } },
			];
		}

		if (filters.status) {
			where.status = filters.status;
		}

		if (filters.assignedUserId) {
			where.assignedUserId = filters.assignedUserId;
		}

		if (filters.tags && filters.tags.length > 0) {
			where.customerTags = {
				some: {
					tag: {
						name: { in: filters.tags },
					},
				},
			};
		}

		if (filters.minScore !== undefined || filters.maxScore !== undefined) {
			where.score = {};
			if (filters.minScore !== undefined) where.score.gte = filters.minScore;
			if (filters.maxScore !== undefined) where.score.lte = filters.maxScore;
		}

		const [customers, total] = await Promise.all([
			prisma.customer.findMany({
				where,
				skip,
				take: limit,
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true, email: true },
					},
					customerTags: {
						include: { tag: true },
					},
					_count: {
						select: {
							deals: true,
							interactions: true,
							tasks: true,
							notes: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.customer.count({ where }),
		]);

		return { customers, total };
	}

	static async getCustomerById(id: string, includeRelations = false) {
		const include: any = {
			assignedUser: {
				select: { id: true, firstName: true, lastName: true, email: true },
			},
			customerTags: {
				include: { tag: true },
			},
		};

		if (includeRelations) {
			include.deals = {
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
			};
			include.interactions = {
				include: {
					user: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
				take: 10,
			};
			include.tasks = {
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
				take: 10,
			};
			include.notes = {
				include: {
					author: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
				take: 10,
			};
		}

		return await prisma.customer.findUnique({
			where: { id },
			include,
		});
	}

	static async updateCustomer(id: string, updateData: any) {
		const { tags, contacts, customFields, ...data } = updateData;

		if (tags) {
			await prisma.customerTag.deleteMany({
				where: { customerId: id },
			});
		}

		return await prisma.customer.update({
			where: { id },
			data: {
				...data,
				contacts: contacts || undefined,
				customFields: customFields || undefined,
				customerTags: tags
					? {
							create: tags.map((tagName: string) => ({
								tag: {
									connectOrCreate: {
										where: { name: tagName },
										create: { name: tagName },
									},
								},
							})),
						}
					: undefined,
			},
			include: {
				assignedUser: {
					select: { id: true, firstName: true, lastName: true, email: true },
				},
				customerTags: {
					include: { tag: true },
				},
			},
		});
	}

	static async deleteCustomer(id: string) {
		return await prisma.customer.update({
			where: { id },
			data: { isActive: false },
		});
	}

	static async addContactMethod(customerId: string, contactData) {
		const customer = await prisma.customer.findUnique({
			where: { id: customerId },
			select: { contacts: true },
		});

		if (!customer) {
			throw createError("Customer not found", 404);
		}

		const contacts = (customer.contacts as unknown as ContactInfo[]) || [];

		if (contactData.isPrimary) {
			contacts.forEach((contact) => {
				if (contact.type === contactData.type) {
					contact.isPrimary = false;
				}
			});
		}

		contacts.push(contactData);

		await prisma.customer.update({
			where: { id: customerId },
			data: { ...contactData },
		});

		return contactData;
	}

	static async addCustomField(customerId: string, fieldData: CustomField) {
		const customer = await prisma.customer.findUnique({
			where: { id: customerId },
			select: { customFields: true },
		});

		if (!customer) {
			throw createError("Customer not found", 404);
		}

		const customFields: any =
			(customer.customFields as unknown as CustomField[]) || [];

		const filteredFields = customFields.filter(
			(field) => field.name !== fieldData.name,
		);
		filteredFields.push(fieldData);

		await prisma.customer.update({
			where: { id: customerId },
			data: { customFields: filteredFields },
		});

		return fieldData;
	}

	static async uploadDocument(
		customerId: string,
		file: Express.Multer.File,
		uploadedBy: string,
	) {
		const customer = await prisma.customer.findUnique({
			where: { id: customerId },
			select: { documents: true },
		});

		if (!customer) {
			throw createError("Customer not found", 404);
		}

		const document: DocumentAttachment = {
			id: Date.now().toString(),
			name: file.originalname,
			type: file.mimetype,
			size: file.size,
			url: `/uploads/${file.filename}`,
			uploadedAt: new Date(),
			uploadedBy,
		};

		const documents: any =
			(customer.documents as unknown as DocumentAttachment[]) || [];
		documents.push(document);

		await prisma.customer.update({
			where: { id: customerId },
			data: { documents },
		});

		return document;
	}

	static async getCustomerTimeline(
		customerId: string,
		page: number,
		limit: number,
	) {
		const skip = (page - 1) * limit;

		const [interactions, deals, tasks, notes] = await Promise.all([
			prisma.interaction.findMany({
				where: { customerId },
				include: {
					user: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.deal.findMany({
				where: { customerId },
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.task.findMany({
				where: { customerId },
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.note.findMany({
				where: { customerId },
				include: {
					author: {
						select: { id: true, firstName: true, lastName: true },
					},
				},
				orderBy: { createdAt: "desc" },
			}),
		]);

		const timeline = [
			...interactions.map((item) => ({ ...item, type: "interaction" })),
			...deals.map((item) => ({ ...item, type: "deal" })),
			...tasks.map((item) => ({ ...item, type: "task" })),
			...notes.map((item) => ({ ...item, type: "note" })),
		].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		return timeline;
	}

	static async getCustomerStats(customerId: string) {
		const [customer, dealStats, interactionStats, taskStats] =
			await Promise.all([
				prisma.customer.findUnique({
					where: { id: customerId },
					select: { lifetimeValue: true, createdAt: true },
				}),
				prisma.deal.aggregate({
					where: { customerId },
					_sum: { value: true },
					_count: { id: true },
				}),
				prisma.interaction.groupBy({
					by: ["type"],
					where: { customerId },
					_count: { id: true },
				}),
				prisma.task.groupBy({
					by: ["status"],
					where: { customerId },
					_count: { id: true },
				}),
			]);

		return {
			lifetimeValue: customer?.lifetimeValue || 0,
			customerSince: customer?.createdAt,
			totalDeals: dealStats._count.id,
			totalDealValue: dealStats._sum.value || 0,
			interactionsByType: interactionStats,
			tasksByStatus: taskStats,
		};
	}

	static async segmentCustomers(criteria: any) {
		const segments: any = [];

		// High-value customers
		if (criteria.includeHighValue) {
			const highValueCustomers = await prisma.customer.findMany({
				where: {
					lifetimeValue: { gte: criteria.highValueThreshold || 10000 },
					isActive: true,
				},
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
					customerTags: {
						include: { tag: true },
					},
				},
			});

			segments.push({
				name: "High Value Customers",
				criteria: `Lifetime Value >= ${criteria.highValueThreshold || 10000}`,
				customers: highValueCustomers,
				count: highValueCustomers.length,
			});
		}

		// Recent customers
		if (criteria.includeRecent) {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - (criteria.recentDays || 30));

			const recentCustomers = await prisma.customer.findMany({
				where: {
					createdAt: { gte: recentDate },
					isActive: true,
				},
				include: {
					assignedUser: {
						select: { id: true, firstName: true, lastName: true },
					},
					customerTags: {
						include: { tag: true },
					},
				},
			});

			segments.push({
				name: "Recent Customers",
				criteria: `Created within last ${criteria.recentDays || 30} days`,
				customers: recentCustomers,
				count: recentCustomers.length,
			});
		}

		// Customers by status
		if (criteria.segmentByStatus) {
			const statusSegments = await prisma.customer.groupBy({
				by: ["status"],
				where: { isActive: true },
				_count: { id: true },
			});

			for (const statusGroup of statusSegments) {
				const customers = await prisma.customer.findMany({
					where: {
						status: statusGroup.status,
						isActive: true,
					},
					include: {
						assignedUser: {
							select: { id: true, firstName: true, lastName: true },
						},
						customerTags: {
							include: { tag: true },
						},
					},
				});

				segments.push({
					name: `${statusGroup.status} Customers`,
					criteria: `Status = ${statusGroup.status}`,
					customers,
					count: statusGroup._count.id,
				});
			}
		}

		return segments;
	}

	static async exportCustomers(format: "csv" | "excel", filters: any) {
		const where: any = { isActive: true };

		if (filters.status) where.status = filters.status;
		if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId;

		const customers = await prisma.customer.findMany({
			where,
			include: {
				assignedUser: {
					select: { firstName: true, lastName: true, email: true },
				},
				customerTags: {
					include: { tag: true },
				},
			},
		});

		const exportData = customers.map((customer) => ({
			ID: customer.id,
			Email: customer.email,
			"First Name": customer.firstName,
			"Last Name": customer.lastName,
			Company: customer.company || "",
			"Job Title": customer.jobTitle || "",
			Phone: customer.phone || "",
			Status: customer.status,
			Score: customer.score,
			"Lifetime Value": customer.lifetimeValue.toString(),
			"Assigned User": customer.assignedUser
				? `${customer.assignedUser.firstName} ${customer.assignedUser.lastName}`
				: "",
			Tags: customer.customerTags.map((ct) => ct.tag.name).join(", "),
			"Created At": customer.createdAt.toISOString(),
		}));

		if (format === "csv") {
			const csvHeader = Object.keys(exportData[0] || {}).join(",");
			const csvRows = exportData.map((row) =>
				Object.values(row)
					.map((value) => `"${value}"`)
					.join(","),
			);
			const csvContent = [csvHeader, ...csvRows].join("\n");

			return {
				buffer: Buffer.from(csvContent),
				filename: `customers_${new Date().toISOString().split("T")[0]}.csv`,
				contentType: "text/csv",
			};
		} else {
			const workbook = XLSX.utils.book_new();
			const worksheet = XLSX.utils.json_to_sheet(exportData);
			XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

			return {
				buffer,
				filename: `customers_${new Date().toISOString().split("T")[0]}.xlsx`,
				contentType:
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			};
		}
	}

	static async importCustomers(file: Express.Multer.File, importedBy: string) {
		const results = {
			total: 0,
			successful: 0,
			failed: 0,
			errors: [] as string[],
		};

		try {
			let customers: any[] = [];

			if (file.mimetype === "text/csv") {
				// Parse CSV
				const stream = Readable.from(file.buffer);
				customers = await new Promise((resolve, reject) => {
					const rows: any[] = [];
					stream
						.pipe(csv())
						.on("data", (row) => rows.push(row))
						.on("end", () => resolve(rows))
						.on("error", reject);
				});
			} else if (
				file.mimetype.includes("spreadsheet") ||
				file.mimetype.includes("excel")
			) {
				// Parse Excel
				const workbook = XLSX.read(file.buffer);
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				customers = XLSX.utils.sheet_to_json(worksheet);
			}

			results.total = customers.length;

			for (const customerData of customers) {
				try {
					// Map CSV/Excel columns to database fields
					const mappedData = {
						email: customerData.Email || customerData.email,
						firstName: customerData["First Name"] || customerData.firstName,
						lastName: customerData["Last Name"] || customerData.lastName,
						company: customerData.Company || customerData.company,
						jobTitle: customerData["Job Title"] || customerData.jobTitle,
						phone: customerData.Phone || customerData.phone,
						status: customerData.Status || customerData.status || "LEAD",
						score: parseInt(customerData.Score || customerData.score) || 0,
						lifetimeValue:
							parseFloat(
								customerData["Lifetime Value"] || customerData.lifetimeValue,
							) || 0,
						assignedUserId: importedBy,
					};

					if (
						!mappedData.email ||
						!mappedData.firstName ||
						!mappedData.lastName
					) {
						results.errors.push(
							`Missing required fields for customer: ${JSON.stringify(customerData)}`,
						);
						results.failed++;
						continue;
					}

					const existingCustomer = await prisma.customer.findUnique({
						where: { email: mappedData.email },
					});

					if (existingCustomer) {
						results.errors.push(
							`Customer with email ${mappedData.email} already exists`,
						);
						results.failed++;
						continue;
					}

					await prisma.customer.create({
						data: mappedData,
					});

					results.successful++;
				} catch (error) {
					results.errors.push(`Error importing customer: ${error}`);
					results.failed++;
				}
			}

			return results;
		} catch (error) {
			throw createError(`Import failed: ${error}`, 400);
		}
	}
}

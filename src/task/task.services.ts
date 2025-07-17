import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskService {
	static async createTask(taskData) {
		const task = await prisma.task.create({
			data: {
				...taskData,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			include: {
				contact: {
					select: {
						id: true,
						customer: true,
						type: true,
					},
				},
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
					},
				},
				note: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
					},
				},
			},
		});
		return task;
	}

	static async getTasks(options: {
		page: number;
		limit: number;
		search?: string;
		status?: string;
		priority?: string;
		contactId?: string;
		dealId?: string;
		dueDate?: string;
	}) {
		const {
			page,
			limit,
			search,
			status,
			priority,
			contactId,
			dealId,
			dueDate,
		} = options;
		const offset = (page - 1) * limit;

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (status) {
			whereClause.status = status;
		}

		if (priority) {
			whereClause.priority = priority;
		}

		if (contactId) {
			whereClause.contactId = contactId;
		}

		if (dealId) {
			whereClause.dealId = dealId;
		}

		if (dueDate) {
			const date = new Date(dueDate);
			const startOfDay = new Date(date.setHours(0, 0, 0, 0));
			const endOfDay = new Date(date.setHours(23, 59, 59, 999));
			whereClause.dueDate = {
				gte: startOfDay,
				lte: endOfDay,
			};
		}

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: whereClause,
				orderBy: { dueDate: "asc" },
				skip: offset,
				take: limit,
				include: {
					contact: {
						select: {
							id: true,
							customer: true,
							type: true,
						},
					},
					deal: {
						select: {
							id: true,
							title: true,
							value: true,
							stage: true,
						},
					},
					note: {
						select: {
							id: true,
							title: true,
							content: true,
							createdAt: true,
						},
					},
				},
			}),
			prisma.task.count({ where: whereClause }),
		]);

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getTaskById(id: string) {
		const task = await prisma.task.findUnique({
			where: { id },
			include: {
				contact: {
					select: {
						id: true,
						customer: true,
						type: true,
					},
				},
				deal: {
					select: {
						id: true,
						title: true,
						description: true,
						value: true,
						stage: true,
					},
				},
				note: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});
		return task;
	}

	static async updateTask(id: string, updateData) {
		const task = await prisma.task.update({
			where: { id },
			data: {
				...updateData,
				updatedAt: new Date(),
			},
			include: {
				contact: {
					select: {
						id: true,
						customer: true,
						type: true,
					},
				},
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
					},
				},
				note: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
					},
				},
			},
		});
		return task;
	}

	static async deleteTask(id: string) {
		try {
			await prisma.task.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async completeTask(id: string, userId: string) {
		const task = await prisma.task.update({
			where: { id },
			data: {
				status: "COMPLETED",
				completedAt: new Date(),
				updatedAt: new Date(),
			},
			include: {
				contact: {
					select: {
						id: true,
						customer: true,
						type: true,
					},
				},
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
					},
				},
				note: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
					},
				},
			},
		});
		return task;
	}

	static async getTasksByContact(
		contactId: string,
		options: { page: number; limit: number },
	) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: { contactId },
				orderBy: { dueDate: "asc" },
				skip: offset,
				take: limit,
				include: {
					deal: {
						select: {
							id: true,
							title: true,
							value: true,
							stage: true,
						},
					},
					note: {
						select: {
							id: true,
							title: true,
							content: true,
							createdAt: true,
						},
					},
				},
			}),
			prisma.task.count({ where: { contactId } }),
		]);

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getTasksByDeal(
		dealId: string,
		options: { page: number; limit: number },
	) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: { dealId },
				orderBy: { dueDate: "asc" },
				skip: offset,
				take: limit,
				include: {
					contact: {
						select: {
							id: true,
							customer: true,
							type: true,
						},
					},
					note: {
						select: {
							id: true,
							title: true,
							content: true,
							createdAt: true,
						},
					},
				},
			}),
			prisma.task.count({ where: { dealId } }),
		]);

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getOverdueTasks(options: { page: number; limit: number }) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;
		const now = new Date();

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: {
					dueDate: { lt: now },
					status: { not: "COMPLETED" },
				},
				orderBy: { dueDate: "asc" },
				skip: offset,
				take: limit,
				include: {
					contact: {
						select: {
							id: true,
							customer: true,
							type: true,
						},
					},
					deal: {
						select: {
							id: true,
							title: true,
							value: true,
							stage: true,
						},
					},
				},
			}),
			prisma.task.count({
				where: {
					dueDate: { lt: now },
					status: { not: "COMPLETED" },
				},
			}),
		]);

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getTodaysTasks(options: { page: number; limit: number }) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: {
					dueDate: {
						gte: startOfDay,
						lte: endOfDay,
					},
				},
				orderBy: { dueDate: "asc" },
				skip: offset,
				take: limit,
				include: {
					contact: {
						select: {
							id: true,
							customer: true,
							type: true,
						},
					},
					deal: {
						select: {
							id: true,
							title: true,
							value: true,
							stage: true,
						},
					},
				},
			}),
			prisma.task.count({
				where: {
					dueDate: {
						gte: startOfDay,
						lte: endOfDay,
					},
				},
			}),
		]);

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}

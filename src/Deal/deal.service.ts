import { DealStage, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DealService {
	static async createDeal(dealData) {
		const deal = await prisma.deal.create({
			data: {
				...dealData,
			},
			include: {
				contact: {
					select: {
						id: true,
						customers: true,
						type: true,
					},
				},
				tasks: {
					select: {
						id: true,
						title: true,
						status: true,
						dueDate: true,
					},
				},
				interactions: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
					},
				},
				notes: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
					},
				},
			},
		});
		return deal;
	}

	static async getDeals(options: {
		page: number;
		limit: number;
		search?: string;
		stage?: string;
		contactId?: string;
	}) {
		const { page, limit, search, stage, contactId } = options;
		const offset = (page - 1) * limit;

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (stage) {
			whereClause.stage = stage;
		}

		if (contactId) {
			whereClause.contactId = contactId;
		}

		const [deals, total] = await Promise.all([
			prisma.deal.findMany({
				where: whereClause,
				orderBy: { createdAt: "desc" },
				skip: offset,
				take: limit,
				include: {
					contact: {
						select: {
							id: true,
							customers: true,
							type: true,
						},
					},
					tasks: {
						select: {
							id: true,
							title: true,
							status: true,
							dueDate: true,
						},
					},
					interactions: {
						select: {
							id: true,
							type: true,
							subject: true,
							createdAt: true,
						},
					},
					notes: {
						select: {
							id: true,
							title: true,
							content: true,
							createdAt: true,
						},
					},
				},
			}),
			prisma.deal.count({ where: whereClause }),
		]);

		return {
			deals,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getDealById(id: string) {
		const deal = await prisma.deal.findUnique({
			where: { id },
			include: {
				contact: {
					select: {
						id: true,
						customers: true,
						type: true,
					},
				},
				tasks: {
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
						priority: true,
						dueDate: true,
						createdAt: true,
					},
				},
				interactions: {
					select: {
						id: true,
						type: true,
						subject: true,
						content: true,
						createdAt: true,
						completed: true,
					},
				},
				notes: {
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
		return deal;
	}

	static async updateDeal(id: string, updateData) {
		const deal = await prisma.deal.update({
			where: { id },
			data: {
				...updateData,
				updatedAt: new Date(),
			},
			include: {
				contact: {
					select: {
						id: true,
						customers: true,
						type: true,
					},
				},
				tasks: {
					select: {
						id: true,
						title: true,
						status: true,
						dueDate: true,
					},
				},
				interactions: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
					},
				},
				notes: {
					select: {
						id: true,
						title: true,
						content: true,
						createdAt: true,
					},
				},
			},
		});
		return deal;
	}

	static async deleteDeal(id: string) {
		try {
			await prisma.deal.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async getPipelineStats() {
		const stats = await prisma.deal.groupBy({
			by: ["stage"],
			_count: {
				id: true,
			},
			_sum: {
				value: true,
			},
			_avg: {
				value: true,
			},
		});

		const totalDeals = await prisma.deal.count();
		const totalValue = await prisma.deal.aggregate({
			_sum: {
				value: true,
			},
		});

		const wonDeals = await prisma.deal.count({
			where: { stage: "CLOSED_WON" },
		});

		const lostDeals = await prisma.deal.count({
			where: { stage: "CLOSED_LOST" },
		});

		const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

		return {
			byStage: stats.map((stat) => ({
				stage: stat.stage,
				count: stat._count.id,
				totalValue: stat._sum.value || 0,
				averageValue: stat._avg.value || 0,
			})),
			overview: {
				totalDeals,
				totalValue: totalValue._sum.value || 0,
				wonDeals,
				lostDeals,
				winRate: Math.round(winRate * 100) / 100,
			},
		};
	}

	static async updateDealStage(id: string, stage: DealStage) {
		const deal = await prisma.deal.update({
			where: { id },
			data: {
				stage,
				updatedAt: new Date(),
			},
			include: {
				contact: {
					select: {
						id: true,
						customers: true,
						type: true,
					},
				},
			},
		});
		return deal;
	}
}

import { PrismaClient } from "@prisma/client";
import {
	CreateInteractionDto,
	UpdateInteractionDto,
} from "../validations/validations";

const prisma = new PrismaClient();

export class InteractionService {
	static async createInteraction(interactionData) {
		const interaction = await prisma.interaction.create({
			data: {
				...interactionData,
				createdAt: new Date(),
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
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
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
		return interaction;
	}

	static async getInteractions(options: {
		page: number;
		limit: number;
		search?: string;
		type?: string;
		contactId?: string;
		dealId?: string;
		completed?: boolean;
	}) {
		const { page, limit, search, type, contactId, dealId, completed } = options;
		const offset = (page - 1) * limit;

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ subject: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (type) {
			whereClause.type = type;
		}

		if (contactId) {
			whereClause.contactId = contactId;
		}

		if (dealId) {
			whereClause.dealId = dealId;
		}

		if (completed !== undefined) {
			whereClause.completed = completed;
		}

		const [interactions, total] = await Promise.all([
			prisma.interaction.findMany({
				where: whereClause,
				orderBy: { scheduledAt: "desc" },
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
					deal: {
						select: {
							id: true,
							title: true,
							value: true,
							stage: true,
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
			prisma.interaction.count({ where: whereClause }),
		]);

		return {
			interactions,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getInteractionById(id: string) {
		const interaction = await prisma.interaction.findUnique({
			where: { id },
			include: {
				contact: {
					select: {
						id: true,
						customers: true,
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
		return interaction;
	}

	static async updateInteraction(id: string, updateData) {
		const interaction = await prisma.interaction.update({
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
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
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
		return interaction;
	}

	static async deleteInteraction(id: string) {
		try {
			await prisma.interaction.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async completeInteraction(id: string) {
		const interaction = await prisma.interaction.update({
			where: { id },
			data: {
				completed: true,
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
				deal: {
					select: {
						id: true,
						title: true,
						value: true,
						stage: true,
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
		return interaction;
	}

	static async getInteractionsByContact(
		contactId: string,
		options: { page: number; limit: number },
	) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;

		const [interactions, total] = await Promise.all([
			prisma.interaction.findMany({
				where: { contactId },
				orderBy: { scheduledAt: "desc" },
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
			prisma.interaction.count({ where: { contactId } }),
		]);

		return {
			interactions,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getInteractionsByDeal(
		dealId: string,
		options: { page: number; limit: number },
	) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;

		const [interactions, total] = await Promise.all([
			prisma.interaction.findMany({
				where: { dealId },
				orderBy: { scheduledAt: "desc" },
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
			prisma.interaction.count({ where: { dealId } }),
		]);

		return {
			interactions,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}

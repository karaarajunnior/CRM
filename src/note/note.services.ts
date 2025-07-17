import { PrismaClient } from "@prisma/client";
//import { CreateNoteDto, UpdateNoteDto } from "../types/types";

const prisma = new PrismaClient();

export class NoteService {
	static async createNote(noteData) {
		const note = await prisma.note.create({
			data: {
				...noteData,
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
					},
				},
				Task: {
					select: {
						id: true,
						title: true,
						status: true,
					},
				},
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
					},
				},
			},
		});
		return note;
	}

	static async getNotes(options: {
		page: number;
		limit: number;
		search?: string;
		entityType?: string;
		entityId?: string;
	}) {
		const { page, limit, search, entityType, entityId } = options;
		const offset = (page - 1) * limit;

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ content: { contains: search, mode: "insensitive" } },
			];
		}

		if (entityType && entityId) {
			whereClause[`${entityType}Id`] = entityId;
		}

		const [notes, total] = await Promise.all([
			prisma.note.findMany({
				where: whereClause,
				orderBy: { createdAt: "desc" },
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
						},
					},
					Task: {
						select: {
							id: true,
							title: true,
							status: true,
						},
					},
					Interaction: {
						select: {
							id: true,
							type: true,
							subject: true,
						},
					},
				},
			}),
			prisma.note.count({ where: whereClause }),
		]);

		return {
			notes,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getNoteById(id: string) {
		const note = await prisma.note.findUnique({
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
						value: true,
					},
				},
				Task: {
					select: {
						id: true,
						title: true,
						status: true,
					},
				},
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
					},
				},
			},
		});
		return note;
	}

	static async updateNote(id: string, updateData) {
		const note = await prisma.note.update({
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
					},
				},
				Task: {
					select: {
						id: true,
						title: true,
						status: true,
					},
				},
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
					},
				},
			},
		});
		return note;
	}

	static async deleteNote(id: string) {
		try {
			await prisma.note.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async getNotesByEntity(
		entityType: string,
		entityId: string,
		options: { page: number; limit: number },
	) {
		const { page, limit } = options;
		const offset = (page - 1) * limit;

		const whereClause: any = {};
		whereClause[`${entityType}Id`] = entityId;

		const [notes, total] = await Promise.all([
			prisma.note.findMany({
				where: whereClause,
				orderBy: { createdAt: "desc" },
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
						},
					},
					Task: {
						select: {
							id: true,
							title: true,
							status: true,
						},
					},
					Interaction: {
						select: {
							id: true,
							type: true,
							subject: true,
						},
					},
				},
			}),
			prisma.note.count({ where: whereClause }),
		]);

		return {
			notes,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getNotesByContact(
		contactId: string,
		options: { page: number; limit: number },
	) {
		return this.getNotesByEntity("contact", contactId, options);
	}

	static async getNotesByDeal(
		dealId: string,
		options: { page: number; limit: number },
	) {
		return this.getNotesByEntity("deal", dealId, options);
	}

	static async getNotesByTask(
		taskId: string,
		options: { page: number; limit: number },
	) {
		return this.getNotesByEntity("task", taskId, options);
	}

	static async getNotesByInteraction(
		interactionId: string,
		options: { page: number; limit: number },
	) {
		return this.getNotesByEntity("interaction", interactionId, options);
	}
}

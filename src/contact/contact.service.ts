import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ContactService {
	static async createContact(contactData) {
		const contact = await prisma.contact.create({
			data: {
				...contactData,
			},
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});
		return contact;
	}

	static async getAllContacts(page: number = 1, limit: number = 10) {
		const skip = (page - 1) * limit;

		const [contacts, total] = await Promise.all([
			prisma.contact.findMany({
				skip,
				take: limit,
				include: {
					customer: {
						select: {
							id: true,
							firstName: true,
							email: true,
							phone: true,
						},
					},
					task: {
						select: {
							id: true,
							title: true,
							status: true,
							priority: true,
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
					Interaction: {
						select: {
							id: true,
							type: true,
							subject: true,
							createdAt: true,
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
				orderBy: {
					id: "desc",
				},
			}),
			prisma.contact.count(),
		]);

		return {
			contacts,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		};
	}

	static async getContactById(id: string) {
		const contact = await prisma.contact.findUnique({
			where: { id },
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});

		if (!contact) {
			throw new Error("Contact not found");
		}

		return contact;
	}

	static async updateContact(id: string, updateData: any) {
		const contact = await prisma.contact.update({
			where: { id },
			data: updateData,
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});
		return contact;
	}

	static async deleteContact(id: string) {
		const contact = await prisma.contact.delete({
			where: { id },
		});
		return contact;
	}

	static async getContactsByCustomerId(customerId: string) {
		const contacts = await prisma.contact.findMany({
			where: { customerId },
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});
		return contacts;
	}

	static async getContactsByType(type: string) {
		const contacts = await prisma.contact.findMany({
			where: { type },
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});
		return contacts;
	}

	static async searchContacts(searchTerm: string) {
		const contacts = await prisma.contact.findMany({
			where: {
				OR: [
					{ type: { contains: searchTerm } },
					{ value: { contains: searchTerm } },
					{ customer: { firstName: { contains: searchTerm } } },
					{
						customer: { email: { contains: searchTerm } },
					},
				],
			},
			include: {
				customer: {
					select: {
						id: true,
						firstName: true,
						email: true,
						phone: true,
					},
				},
				task: {
					select: {
						id: true,
						title: true,
						status: true,
						priority: true,
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
				Interaction: {
					select: {
						id: true,
						type: true,
						subject: true,
						createdAt: true,
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
		});
		return contacts;
	}
}

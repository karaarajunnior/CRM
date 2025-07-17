import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addTagToCustomer = (customerId: string, tagId: string) =>
	prisma.customerTag.upsert({
		where: { customerId_tagId: { customerId, tagId } },
		update: {},
		create: { customerId, tagId },
	});

export const removeTagFromCustomer = (customerId: string, tagId: string) =>
	prisma.customerTag.delete({
		where: { customerId_tagId: { customerId, tagId } },
	});

export const getTagsForCustomer = (customerId: string) =>
	prisma.customerTag.findMany({
		where: { customerId },
		include: { tag: true },
	});

export const getCustomersForTag = (tagId: string) =>
	prisma.customerTag.findMany({
		where: { tagId },
		include: { customer: true },
	});

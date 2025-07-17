import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createTag = (name: string, color?: string) =>
	prisma.tag.create({ data: { name, color } });

export const listTags = () => prisma.tag.findMany();

export const getTag = (id: string) => prisma.tag.findUnique({ where: { id } });

export const updateTag = (
	id: string,
	data: { name?: string; color?: string },
) => prisma.tag.update({ where: { id }, data });

export const deleteTag = (id: string) => prisma.tag.delete({ where: { id } });

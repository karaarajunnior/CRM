import { Request, Response } from "express";
import * as TagService from "./tag.service";
import { ActivityLogService } from "../utils/ActivityLog/activityLog.service";
import { AuthRequest } from "../types/types";

export const createTag = async (req: AuthRequest, res: Response) => {
	const tag = await TagService.createTag(req.body.name, req.body.color);
	await ActivityLogService.log({
		action: "CREATE",
		entity: "TAG",
		entityId: tag.id,
		userId: req.user!.id,
		changes: tag,
	});
	res.status(201).json(tag);
};

export const listTags = async (_: Request, res: Response) =>
	res.json(await TagService.listTags());

export const getTag = async (req: Request, res: Response) => {
	const tag = await TagService.getTag(req.params.id);
	return tag
		? res.json(tag)
		: res.status(404).json({ message: "Tag not found" });
};

export const updateTag = async (req: AuthRequest, res: Response) => {
	const tag = await TagService.updateTag(req.params.id, req.body);
	await ActivityLogService.log({
		action: "UPDATE",
		entity: "TAG",
		entityId: tag.id,
		userId: req.user!.id,
		changes: req.body,
	});
	res.json(tag);
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
	await TagService.deleteTag(req.params.id);
	await ActivityLogService.log({
		action: "DELETE",
		entity: "TAG",
		entityId: req.params.id,
		userId: req.user!.id,
	});
	res.status(204).send();
};

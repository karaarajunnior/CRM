import { Request, Response } from "express";
import {
	addTagToCustomer,
	removeTagFromCustomer,
	getTagsForCustomer,
	getCustomersForTag,
} from "./customerTag.service";
import { ActivityLogService } from "../utils/ActivityLog/activityLog.service";
import { AuthRequest } from "../types/types";

export const addTag = async (req: AuthRequest, res: Response) => {
	const { customerId, tagId } = req.body;
	const ct = await addTagToCustomer(customerId, tagId);
	await ActivityLogService.log({
		action: "ADD_TAG",
		entity: "CUSTOMER",
		entityId: customerId,
		userId: req.user!.id,
		changes: ct,
	});
	res.status(201).json(ct);
};

export const removeTag = async (req: AuthRequest, res: Response) => {
	const { customerId, tagId } = req.body;
	await removeTagFromCustomer(customerId, tagId);
	await ActivityLogService.log({
		action: "REMOVE_TAG",
		entity: "CUSTOMER",
		entityId: customerId,
		userId: req.user!.id,
		changes: { tagId },
	});
	res.status(204).send();
};

export const getTagsForCustomers = async (req: Request, res: Response) =>
	res.json(await getTagsForCustomer(req.params.customerId));

export const getCustomersForTags = async (req: Request, res: Response) =>
	res.json(await getCustomersForTag(req.params.tagId));

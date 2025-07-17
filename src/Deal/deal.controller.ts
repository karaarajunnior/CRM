import { Request, Response } from "express";
import { DealService } from "./deal.service";

import { Deal, DealResult } from "./type";

export class DealController {
	static async createDeal(req: Request<{}, {}, Deal>, res: Response) {
		try {
			const dealData = req.body;

			if (!dealData) {
				res.send("fields compulsory");
			}
			const deal = await DealService.createDeal(dealData);
			res.status(201).json({
				success: true,
				message: "Deal created successfully",
				data: deal,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to create deal",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getDeals(
		req: Request<
			{},
			{},
			{},
			{
				page: string;
				limit: string;
				stage: string;
				search: string;
				contactId: string;
			}
		>,
		res: Response,
	) {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;
			const search = req.query.search;
			const stage = req.query.stage;
			const contactId = req.query.contactId;

			const result: Partial<DealResult> = await DealService.getDeals({
				page,
				limit,
				search,
				stage,
				contactId,
			});

			res.json({
				success: true,
				message: "Deals retrieved successfully",
				data: result.deals,
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve deals",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getDealById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deal = await DealService.getDealById(id);

			if (!deal) {
				return res.status(404).json({
					success: false,
					message: "Deal not found",
				});
			}

			res.json({
				success: true,
				message: "Deal retrieved successfully",
				data: deal,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve deal",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async updateDeal(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const updateData = req.body;

			const deal = await DealService.updateDeal(id, updateData);

			if (!deal) {
				return res.status(404).json({
					success: false,
					message: "Deal not found",
				});
			}

			res.json({
				success: true,
				message: "Deal updated successfully",
				data: deal,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update deal",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async deleteDeal(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await DealService.deleteDeal(id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "Deal not found",
				});
			}

			res.json({
				success: true,
				message: "Deal deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to delete deal",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getPipelineStats(req: Request, res: Response) {
		try {
			const stats = await DealService.getPipelineStats();
			res.json({
				success: true,
				message: "Pipeline stats retrieved successfully",
				data: stats,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve pipeline stats",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async updateDealStage(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { stage } = req.body;

			const deal = await DealService.updateDealStage(id, stage);

			if (!deal) {
				return res.status(404).json({
					success: false,
					message: "Deal not found",
				});
			}

			res.json({
				success: true,
				message: "Deal stage updated successfully",
				data: deal,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update deal stage",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
}

import { Request, Response } from "express";
import { InteractionService } from "../services/interaction.service";
import { CreateInteractionDto, UpdateInteractionDto } from "../types/types";

export class InteractionController {
	static async createInteraction(req: Request, res: Response) {
		try {
			const interactionData: CreateInteractionDto = req.body;
			const interaction =
				await InteractionService.createInteraction(interactionData);
			res.status(201).json({
				success: true,
				message: "Interaction created successfully",
				data: interaction,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to create interaction",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getInteractions(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const search = req.query.search as string;
			const type = req.query.type as string;
			const contactId = req.query.contactId as string;
			const dealId = req.query.dealId as string;
			const completed = req.query.completed as string;

			const result = await InteractionService.getInteractions({
				page,
				limit,
				search,
				type,
				contactId,
				dealId,
				completed: completed ? completed === "true" : undefined,
			});

			res.json({
				success: true,
				message: "Interactions retrieved successfully",
				data: result.interactions,
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
				message: "Failed to retrieve interactions",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getInteractionById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const interaction = await InteractionService.getInteractionById(id);

			if (!interaction) {
				return res.status(404).json({
					success: false,
					message: "Interaction not found",
				});
			}

			res.json({
				success: true,
				message: "Interaction retrieved successfully",
				data: interaction,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve interaction",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async updateInteraction(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const updateData: UpdateInteractionDto = req.body;

			const interaction = await InteractionService.updateInteraction(
				id,
				updateData,
			);

			if (!interaction) {
				return res.status(404).json({
					success: false,
					message: "Interaction not found",
				});
			}

			res.json({
				success: true,
				message: "Interaction updated successfully",
				data: interaction,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update interaction",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async deleteInteraction(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await InteractionService.deleteInteraction(id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "Interaction not found",
				});
			}

			res.json({
				success: true,
				message: "Interaction deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to delete interaction",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async completeInteraction(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const interaction = await InteractionService.completeInteraction(id);

			if (!interaction) {
				return res.status(404).json({
					success: false,
					message: "Interaction not found",
				});
			}

			res.json({
				success: true,
				message: "Interaction completed successfully",
				data: interaction,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to complete interaction",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
}

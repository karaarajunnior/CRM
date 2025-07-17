import { Request, Response } from "express";
import { NoteService } from "./note.services";

export class NoteController {
	static async createNote(req: Request, res: Response) {
		try {
			const noteData = req.body;
			const note = await NoteService.createNote(noteData);
			res.status(201).json({
				success: true,
				message: "Note created successfully",
				data: note,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to create note",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getNotes(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const search = req.query.search as string;
			const entityType = req.query.entityType as string;
			const entityId = req.query.entityId as string;

			const result = await NoteService.getNotes({
				page,
				limit,
				search,
				entityType,
				entityId,
			});

			res.json({
				success: true,
				message: "Notes retrieved successfully",
				data: result.notes,
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
				message: "Failed to retrieve notes",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getNoteById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const note = await NoteService.getNoteById(id);

			if (!note) {
				return res.status(404).json({
					success: false,
					message: "Note not found",
				});
			}

			res.json({
				success: true,
				message: "Note retrieved successfully",
				data: note,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve note",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async updateNote(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const updateData = req.body;

			const note = await NoteService.updateNote(id, updateData);

			if (!note) {
				return res.status(404).json({
					success: false,
					message: "Note not found",
				});
			}

			res.json({
				success: true,
				message: "Note updated successfully",
				data: note,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update note",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async deleteNote(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await NoteService.deleteNote(id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "Note not found",
				});
			}

			res.json({
				success: true,
				message: "Note deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to delete note",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getNotesByEntity(req: Request, res: Response) {
		try {
			const { entityType, entityId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const result = await NoteService.getNotesByEntity(entityType, entityId, {
				page,
				limit,
			});

			res.json({
				success: true,
				message: "Notes retrieved successfully",
				data: result.notes,
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
				message: "Failed to retrieve notes",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
}

import { Request, Response } from "express";
import { ContactService } from "./contact.service";
import {
	ApiResponse,
	Contact,
	ContactInput,
	ContactUpdateInput,
	PaginatedResult,
} from "../types/types";

export class ContactController {
	static async createContact(
		req: Request<{}, {}, ContactInput>,
		res: Response<ApiResponse<Contact>>,
	): Promise<void> {
		try {
			const contactData = req.body;

			if (
				!contactData.customerId ||
				!contactData.taskId ||
				!contactData.type ||
				!contactData.value ||
				!contactData.noteId
			) {
				res.status(400).json({
					success: false,
					message:
						"Missing needed fields: customerId, taskId, type, value, noteId",
				});
			}

			const contact: Contact = await ContactService.createContact(contactData);

			if (!contact) throw new Error("");

			res.status(201).json({
				success: true,
				message: "Contact created successfully",
				data: contact,
			});
		} catch (error: any) {
			console.error("Error creating contact:", error);
			res.status(500).json({
				success: false,
				message: "Failed to create contact",
				error: error.message,
			});
		}
	}

	static async getAllContacts(
		req: Request<{}, {}, {}, { page?: string; limit?: string }>,
		res: Response<ApiResponse<any>>,
	) {
		try {
			const page: number = parseInt(req.query.page as string) || 1;
			const limit: number = parseInt(req.query.limit as string) || 10;

			const result: PaginatedResult<Contact> =
				await ContactService.getAllContacts(page, limit);

			res.status(200).json({
				success: true,
				message: "Contacts retrieved successfully",
				data: result.contacts,
				pagination: result.pagination,
			});
		} catch (error: any) {
			console.error("Error fetching contacts:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch contacts",
				error: error.message,
			});
		}
	}

	static async getContactById(
		req: Request<{ id: string }>,
		res: Response<ApiResponse<Contact>>,
	) {
		try {
			const { id } = req.params;

			if (!id) throw new Error("id missing in params");
			const contact: Contact = await ContactService.getContactById(id);

			res.status(200).json({
				success: true,
				message: "Contact retrieved successfully",
				data: contact,
			});
		} catch (error: any) {
			console.error("Error fetching contact:", error);
			const statusCode = error.message === "Contact not found" ? 404 : 500;
			res.status(statusCode).json({
				success: false,
				message: error.message || "Failed to fetch contact",
				error: error.message,
			});
		}
	}

	static async updateContact(
		req: Request<{ id: string }, {}, Partial<ContactUpdateInput>>,
		res: Response<ApiResponse<Contact>>,
	) {
		try {
			const { id } = req.params;
			if (!id) throw new Error("id missing in params");
			const updateData = req.body;

			const contact = await ContactService.updateContact(id, updateData);

			res.status(200).json({
				success: true,
				message: "Contact updated successfully",
				data: contact,
			});
		} catch (error: any) {
			console.error("Error updating contact:", error);
			res.status(500).json({
				success: false,
				message: "Failed to update contact",
				error: error.message,
			});
		}
	}

	static async deleteContact(
		req: Request<{ id: string }>,
		res: Response<ApiResponse<null>>,
	) {
		try {
			const { id } = req.params;
			if (!id) throw new Error("id missing in params");

			await ContactService.deleteContact(id);

			res.status(200).json({
				success: true,
				message: "Contact deleted successfully",
			});
		} catch (error: any) {
			console.error("Error deleting contact:", error);
			res.status(500).json({
				success: false,
				message: "Failed to delete contact",
				error: error.message,
			});
		}
	}

	static async getContactsByCustomerId(
		req: Request<{ customerId: string }>,
		res: Response<ApiResponse<Contact[]>>,
	) {
		try {
			const { customerId } = req.params;
			if (!customerId) throw new Error("id missing in params");

			const contacts: Contact[] =
				await ContactService.getContactsByCustomerId(customerId);

			res.status(200).json({
				success: true,
				message: "Customer contacts retrieved successfully",
				data: contacts,
			});
		} catch (error: any) {
			console.error("Error fetching customer contacts:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch customer contacts",
				error: error.message,
			});
		}
	}

	static async getContactsByType(
		req: Request<{ type: string }>,
		res: Response<ApiResponse<Contact[]>>,
	) {
		try {
			const { type } = req.params;
			if (!type) throw new Error("missing types in param");

			const contacts: Contact[] = await ContactService.getContactsByType(type);

			res.status(200).json({
				success: true,
				message: "Contacts by type retrieved successfully",
				data: contacts,
			});
		} catch (error: any) {
			console.error("Error fetching contacts by type:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch contacts by type",
				error: error.message,
			});
		}
	}

	static async searchContacts(
		req: Request<{}, {}, {}, { q?: string }>,
		res: Response<ApiResponse<Contact[]>>,
	) {
		try {
			const { q } = req.query;

			if (!q) {
				return res.status(400).json({
					success: false,
					message: "Search query is required",
				});
			}

			const contacts = await ContactService.searchContacts(q as string);

			res.status(200).json({
				success: true,
				message: "Search results retrieved successfully",
				data: contacts,
			});
		} catch (error: any) {
			console.error("Error searching contacts:", error);
			res.status(500).json({
				success: false,
				message: "Failed to search contacts",
				error: error.message,
			});
		}
	}
}

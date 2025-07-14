import { Request, Response } from "express";
import { TaskService } from "../services/task.services";
import { AuthRequest, CreateTaskDto, UpdateTaskDto } from "../types/types";

export class TaskController {
	static async createTask(req: Request, res: Response) {
		try {
			const taskData = req.body;
			const task = await TaskService.createTask(taskData);
			res.status(201).json({
				success: true,
				message: "Task created successfully",
				data: task,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to create task",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getTasks(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const search = req.query.search as string;
			const status = req.query.status as string;
			const priority = req.query.priority as string;
			const contactId = req.query.contactId as string;
			const dealId = req.query.dealId as string;
			const dueDate = req.query.dueDate as string;

			const result = await TaskService.getTasks({
				page,
				limit,
				search,
				status,
				priority,
				contactId,
				dealId,
				dueDate,
			});

			res.json({
				success: true,
				message: "Tasks retrieved successfully",
				data: result.tasks,
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
				message: "Failed to retrieve tasks",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	static async getTaskById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const task = await TaskService.getTaskById(id);

			if (!task) {
				return res.status(404).json({
					success: false,
					message: "Task not found",
				});
			}

			res.json({ data: task });
		} catch (error) {
			throw error;
		}
	}
	static async updateTask(req: AuthRequest, res: Response) {
		const { id } = req.params;
		const task = await TaskService.updateTask(id, req.body);
		res.json(task);
	}
	static async deleteTask(req: AuthRequest, res: Response) {
		const { id } = req.params;
		await TaskService.deleteTask(id);
		res.status(204).send();
	}
	static async completeTask(req: AuthRequest, res: Response) {
		const { id } = req.params;

		try {
			//only user completes
			const task = await TaskService.completeTask(id, req.user!.id);
			/* anyone with id provided can complete */
			//const task1 = await TaskService.completeTask(id);

			return res.status(200).json(task);
		} catch (err: any) {
			return res.status(404).json({ message: "Task not found" });
		}
	}
}

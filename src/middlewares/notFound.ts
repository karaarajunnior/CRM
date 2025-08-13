import { Request, Response } from "express";
import { createError } from "./errorHandler";

export const notFound = (req: Request, res: Response): void => {
	createError(`Route ${req.originalUrl} not found`, 404);
};

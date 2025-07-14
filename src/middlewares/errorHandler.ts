import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
	statusCode?: number;
	isOperational?: boolean;
}

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	if (process.env.NODE_ENV === "development") {
		console.error("Error:", err);
	}

	res.status(statusCode).json({
		error: {
			message,
			...(process.env.NODE_ENV === "development" && { stack: err.stack }),
		},
	});
};

export const createError = (message: string, statusCode: number): AppError => {
	const error = new Error(message) as AppError;
	error.statusCode = statusCode;
	error.isOperational = true;
	return error;
};

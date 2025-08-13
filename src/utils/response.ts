import type { Response } from "express";

export const successResponse = (res: Response, message: string, data: any) => {
	return res.status(200).json({ succcess: true, message, data });
};

export const errorResponse = (res: Response, status: number, err: any) => {
	return res.status(status).json({ succcess: false, message: err.message });
};

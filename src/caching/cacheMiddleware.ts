import { Request, Response, NextFunction } from "express";
import redisClient from "./redisClient";

export function cacheMiddleware(Prefix: string, TimeToLive: number = 60) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const cacheKey = `${Prefix}:${req.originalUrl}`;

		try {
			const cached = await redisClient.get(cacheKey);
			if (cached) {
				return res.status(200).json(JSON.parse(cached));
			}

			const originalSend = res.json.bind(res);
			res.json = (body) => {
				redisClient.setEx(cacheKey, TimeToLive, JSON.stringify(body));
				return originalSend(body);
			};

			next();
		} catch (error) {
			console.error("Cache error:", error);
			next();
		}
	};
}

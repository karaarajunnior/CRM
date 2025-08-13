import rateLimit from "express-rate-limit";
export const passwordResetLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 3,
	message: {
		error: "Too many password reset attempts. Please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export const methodBasedLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: (req) => {
		if (req.method === "GET") return 100;
		if (req.method === "POST") return 20;
		if (req.method === "PUT") return 10;
		if (req.method === "DELETE") return 5;
		return 10;
	},
	message: {
		error: "Method specific rate limit exceeded",
	},
});

export const basicLimiter = rateLimit({
	windowMs: 3000,
	max: 2,
	message: {
		error: "Too many requests from this IP, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// for scalability and so large applications

import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

const redis = new Redis();

export const rateLimiter = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const ip = req.ip;
	const currentTime = Date.now();
	const limit = 20;
	const key = `ratelimit:${ip}`;

	const windowMs = 2 * 60 * 1000;
	const requests = await redis.incr(key);

	if (requests === 1) {
		await redis.expire(key, windowMs);
	}
	if (requests > limit) {
		res
			.status(429)
			.json({ message: "Too many requests made, window time out, wait abit" });
	}
	next();
};

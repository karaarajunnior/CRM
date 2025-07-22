import { Request, Response, NextFunction } from "express";
import redisClient from "./redisClient";

/*distributed cache */
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
				redisClient.setex(cacheKey, TimeToLive, JSON.stringify(body));
				return originalSend(body);
			};

			next();
		} catch (error) {
			console.error("Cache error:", error);
			next();
		}
	};
}

/* in mem cache */
export class Cache {
	ttl: number;
	cache: Map<any, any>;
	constructor(ttl: number = 15 * 60 * 100) {
		this.cache = new Map();
		this.ttl = ttl;
	}
	put(key, value, ttl: number = this.ttl) {
		const now = new Date().getTime();
		const expiration = now + ttl;
		this.cache.set(key, { value, ttl: expiration });
	}

	get(key) {
		const now = new Date().getTime();
		const cached = this.cache.get(key);

		if (cached && cached.ttl > now) {
			return cached.value;
		}
		this.cache.delete(key);
		return null;
	}

	delete(key) {
		return this.cache.delete(key);
	}

	clear() {
		this.cache.clear();
	}

	keys() {
		return [...this.cache.keys()];
	}

	size() {
		return this.cache.size;
	}
}

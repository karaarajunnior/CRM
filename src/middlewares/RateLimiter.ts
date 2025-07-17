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
	max: (req) => {
		if (req.method === "GET") return 100;
		if (req.method === "POST") return 20;
		if (req.method === "PUT") return 10;
		if (req.method === "DELETE") return 5;
		return 10;
	},
	message: {
		error: "Method-specific rate limit exceeded",
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

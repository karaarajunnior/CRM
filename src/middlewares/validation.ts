import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).json({
			error: {
				message: "Validation failed",
				details: errors.array(),
			},
		});
		return;
	}

	next();
};

export const validate = (validations: ValidationChain[]) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		await Promise.all(validations.map((validation) => validation.run(req)));
		handleValidationErrors(req, res, next);
	};
};

//using zod
// export const validate = (validations: z.ZodType) => {
// 	return async (
// 		req: Request,
// 		res: Response,
// 		next: NextFunction,
// 	): Promise<void> => {
// 		const result = validations.safeParse(req.body);
// 		if (!result.success) {
// 			console.log(result.error);
// 			return handleValidationErrors(req, res, next);
// 		}
// 	};
// };

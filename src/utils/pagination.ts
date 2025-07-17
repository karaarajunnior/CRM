import { PaginationResult } from "../types/types";

export const createPaginationResult = <T>(
	data: T[],
	total: number,
	page: number,
	limit: number,
): PaginationResult<T> => {
	const totalPages = Math.ceil(total / limit);

	return {
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

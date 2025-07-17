export interface Deal {
	id: string;
	title: string;
	stage: string;
	amount?: number;
	contactId: string;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface DealResult {
	total: number;
	page: number;
	limit: number;
	deals: Deal[];
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

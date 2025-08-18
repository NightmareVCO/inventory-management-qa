import type { Product } from '@lib/model/product.model';

export type ProductChangesResponseDTO = {
	content: Product[];
	pageNumber: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
};

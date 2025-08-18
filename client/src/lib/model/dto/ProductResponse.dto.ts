import type { Product } from '@lib/model/product.model';

export type ProductResponseDTO = {
	content: Product[];
	page: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
};

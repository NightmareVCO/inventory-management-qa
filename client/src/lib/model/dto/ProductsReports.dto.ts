import type { Product } from '@lib/model/product.model';

export type ProductsReportDTO = {
	totalProductsWithMinStock: number;
	totalProductsAddedLastWeek: number;
	totalProductsDeletedLastWeek: number;
	topProductsWithMostModifications: Product[];
	valueOfDispatchedProductsByCategory: Record<string, number>;
};

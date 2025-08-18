import type { Product } from '@lib/model/product.model';

export type ProductChanges = {
	id: number;
	product: Product;
	revType: 'ADD' | 'MOD' | 'DEL';
	timestamp: number;
	userEmail: string;
};

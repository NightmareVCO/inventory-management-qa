import type { ProductChanges } from '@lib/model/productChanges.model';

export type UseChangesAccordionProps = {
	productChange: ProductChanges;
};

export function useChangesAccordion({
	productChange,
}: UseChangesAccordionProps) {
	const changeTitle = (productChange: ProductChanges) => {
		switch (productChange.revType) {
			case 'ADD':
				return `Product ${productChange.product.name} was created`;
			case 'MOD': {
				const hasStockChanged =
					productChange.product.quantity !==
					productChange.product.olderQuantity;

				if (hasStockChanged) {
					return `Product ${productChange.product.name} stock changed from ${productChange.product.olderQuantity} to ${productChange.product.quantity}`;
				}

				return `Product ${productChange.product.name} was updated`;
			}
			case 'DEL':
				return `Product ${productChange.product.name} was deleted`;
			default:
				return `Product ${productChange.product.name} has an unknown change type`;
		}
	};

	return {
		changeTitle,
	};
}

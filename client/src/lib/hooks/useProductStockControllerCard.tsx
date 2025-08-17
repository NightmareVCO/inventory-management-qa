import { NEXT_PUBLIC_API_URL } from '@lib/constants/config.constants';
import type { Product } from '@lib/model/product.model';
import { useCallback, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { useDebouncedCallback } from 'use-debounce';
import { updateProductStock } from '../actions/products.action';

const API_URL = NEXT_PUBLIC_API_URL;

export type useProductStockControllerCardProps = {
	product: Product;
	token: string;
	onSuccess?: (product: Product) => void;
	onError?: (error: Error) => void;
};

export default function useProductStockControllerCard({
	product,
	token,
	onSuccess,
	onError,
}: useProductStockControllerCardProps) {
	const [quantity, setQuantity] = useState<number>(+product.quantity);

	const updateQuantity = useSWRMutation(
		`${API_URL}`,
		(key, { arg }: { arg: number }) =>
			updateProductStock({
				url: `${key}/product/${product.id}/stock`,
				quantity: arg,
				headers: { Authorization: `Bearer ${token}` },
			}),
	);

	const performUpdate = async (
		updatedQuantity: number,
	): Promise<undefined | null> => {
		try {
			const result = await updateQuantity.trigger(updatedQuantity);

			if (onSuccess && result) {
				onSuccess(product);
			}

			return result;
		} catch (error) {
			console.error('Error updating product stock:', error);

			if (onError && error instanceof Error) {
				onError(error);
			}

			return null;
		}
	};

	const debouncedUpdate = useDebouncedCallback((finalQuantity: number) => {
		performUpdate(finalQuantity);
	}, 500);

	const handleIncrease = () => {
		setQuantity((prev) => {
			const newQuantity = prev + 1;
			debouncedUpdate(newQuantity);
			return newQuantity;
		});
	};

	const handleDecrease = () => {
		setQuantity((prev) => {
			const newQuantity = Math.max(prev - 1, 0);
			if (newQuantity === 0) return 0;

			debouncedUpdate(newQuantity);
			return newQuantity;
		});
	};

	return {
		quantity,
		handleIncrease,
		handleDecrease,
	};
}

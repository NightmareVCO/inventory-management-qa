import type { Product } from '@lib/model/product.model';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/product`;

type ActionProps = {
	url: string;
	product?: Product;
	quantity?: number;
	headers?: Record<string, string>;
};

export async function createProduct({
	url = API_URL,
	product,
	headers,
}: ActionProps): Promise<Product> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify(product),
	});

	if (!response.ok) {
		throw new Error('Failed to create product');
	}

	return response.json();
}

export async function updateProduct({
	url = API_URL,
	product,
	headers,
}: ActionProps) {
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify(product),
	});

	if (!response.ok) {
		throw new Error('Failed to update product');
	}

	return response.json();
}

export async function updateProductStock({
	url = API_URL,
	quantity,
	headers,
}: ActionProps) {
	const response = await fetch(`${url}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify({
			quantity: quantity,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to update product stock');
	}

	return response.json();
}

export async function deleteProduct({
	url = API_URL,
	productId,
	headers,
}: ActionProps & { productId: string }) {
	const response = await fetch(`${url}/${productId}`, {
		method: 'DELETE',
		headers: {
			...headers,
		},
	});

	if (!response.ok) {
		throw new Error('Failed to delete product');
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

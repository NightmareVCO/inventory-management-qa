import { useDisclosure } from '@chakra-ui/react';
import { NEXT_PUBLIC_API_URL } from '@lib/constants/config.constants';
import { Routes } from '@lib/constants/routes.constants';
import useAuth from '@lib/hooks/useAuth';
import type { ProductResponseDTO } from '@lib/model/dto/ProductResponse.dto';
import type { Product } from '@lib/model/product.model';
import { fetcher } from '@lib/swr/fetcher';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

const API_URL = NEXT_PUBLIC_API_URL;

export function useInventoryPage() {
	const searchParams = useSearchParams();
	const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
		undefined,
	);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	const handleEditProduct = (product: Product) => {
		setSelectedProduct(product);
		onEditOpen();
	};

	const handleDeleteProduct = (product: Product) => {
		setSelectedProduct(product);
		onDeleteOpen();
	};

	const { isAuthChecking, shouldFetch, token, hasPermission } = useAuth({
		redirectAfterLogin: Routes.Inventory,
	});

	const query = searchParams.get('query');
	const category = searchParams.get('category');
	const page = searchParams.get('page');
	const minPrice = searchParams.get('minPrice');
	const maxPrice = searchParams.get('maxPrice');
	const lowStock = searchParams.get('lowStock') === 'true';

	const url = `${API_URL}/product/?${new URLSearchParams({
		search: query ?? '',
		category: category ?? '',
		page: (page && !Number.isNaN(Number(page))
			? Number(page) - 1
			: 0
		).toString(),
		minPrice: minPrice ?? '',
		maxPrice: maxPrice ?? '',
		lowStock: lowStock ? 'true' : '',
	}).toString()}`;

	const headers = token
		? {
				Authorization: `Bearer ${token}`,
			}
		: undefined;

	const {
		data: products = {
			content: [] as Product[],
			page: 0,
			pageSize: 10,
			totalElements: 0,
			totalPages: 0,
		},
		error,
		isLoading,
		isValidating,
		mutate,
	} = useSWR<ProductResponseDTO>(
		shouldFetch ? url : null,
		(url) => fetcher(url, headers ? { headers } : undefined),
		{
			dedupingInterval: 300000,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
		},
	);

	const refreshProducts = () => {
		mutate();
	};

	return {
		selectedProduct,
		setSelectedProduct,
		handleEditProduct,
		handleDeleteProduct,
		refreshProducts,
		isOpen,
		onOpen,
		onClose,
		isEditOpen,
		onEditOpen,
		onEditClose,
		isDeleteOpen,
		onDeleteOpen,
		onDeleteClose,
		products,
		error,
		isLoading,
		isValidating,
		isAuthChecking,
		hasPermission,
	};
}

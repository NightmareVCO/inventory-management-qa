import { NEXT_PUBLIC_API_URL } from '@lib/constants/config.constants';
import { Routes } from '@lib/constants/routes.constants';
import useAuth from '@lib/hooks/useAuth';
import type { ProductChangesResponseDTO } from '@lib/model/dto/ProductChangesResponse.dto';
import type { ProductChanges } from '@lib/model/productChanges.model';
import { fetcher } from '@lib/swr/fetcher';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

const API_URL = NEXT_PUBLIC_API_URL;

export function useChangesPage() {
	const searchParams = useSearchParams();

	const { isAuthChecking, shouldFetch, token } = useAuth({
		redirectAfterLogin: Routes.Inventory,
	});

	const page = searchParams.get('page');

	const url = `${API_URL}/audit/product-revisions?${new URLSearchParams({
		page: (page && !Number.isNaN(Number(page))
			? Number(page) - 1
			: 0
		).toString(),
	}).toString()}`;

	const {
		data: changes = {
			content: [] as ProductChanges[],
			pageNumber: 0,
			pageSize: 0,
			totalElements: 0,
			totalPages: 0,
		},
		error,
		isLoading,
		isValidating,
		mutate,
	} = useSWR<ProductChangesResponseDTO>(
		shouldFetch ? url : null,
		(url) =>
			fetcher(url, {
				headers: { Authorization: `Bearer ${token}` },
			}),
		{
			dedupingInterval: 300000,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
		},
	);

	const refreshChanges = () => {
		mutate();
	};

	console.log('Changes:', changes);

	return {
		changes,
		error,
		isLoading,
		isValidating,
		refreshChanges,
		isAuthChecking,
	};
}

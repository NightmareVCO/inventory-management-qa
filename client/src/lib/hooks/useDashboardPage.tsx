import { NEXT_PUBLIC_API_URL } from '@lib/constants/config.constants';
import { Routes } from '@lib/constants/routes.constants';
import useAuth from '@lib/hooks/useAuth';
import type { ProductsReportDTO } from '@lib/model/dto/ProductsReports.dto';
import { fetcher } from '@lib/swr/fetcher';
import useSWR from 'swr';

const API_URL = NEXT_PUBLIC_API_URL;

export default function useDashboardPage() {
	const { isAuthChecking, shouldFetch, token, hasPermission } = useAuth({
		redirectAfterLogin: Routes.Dashboard,
	});

	const url = `${API_URL}/report/products`;
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	const { data, error, isLoading, isValidating, mutate } =
		useSWR<ProductsReportDTO>(
			shouldFetch ? url : null,
			(url) => fetcher(url, { headers }),
			{
				dedupingInterval: 300000,
				revalidateOnFocus: false,
				revalidateOnReconnect: false,
				revalidateIfStale: false,
			},
		);

	const refreshReport = () => {
		mutate();
	};

	return {
		reportData: data,
		error,
		isLoading,
		isValidating,
		isAuthChecking,
		hasPermission,
		refreshReport,
	};
}

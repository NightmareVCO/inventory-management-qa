'use client';

import { Flex } from '@chakra-ui/react';
import ProductStockControllerCard from '@components/card/ProductStockControllerCard';
import FilterByCategory from '@components/filters/FilterByCategory';
import FilterByLowStock from '@components/filters/FilterByLowStock';
import FilterByMaxAmount from '@components/filters/FilterByMaxAmount';
import FilterByMinAmount from '@components/filters/FilterByMinAmount';
import LoadingScreen from '@components/loading/LoadingScreen';
import SidebarWithHeader from '@components/navigation/sidebar/SidebarWithBanner';
import Pagination from '@components/pagination/Pagination';
import ProductSearch from '@components/search/ProductSearch';
import useInventoryPage from '@lib/hooks/useInventoryPage';
import { Suspense } from 'react';

export default function StockPage() {
	return (
		<main>
			<SidebarWithHeader>
				<Suspense fallback={<LoadingScreen />}>
					<StockContent />
				</Suspense>
			</SidebarWithHeader>
		</main>
	);
}

function StockContent() {
	const { products, isAuthChecking } = useInventoryPage();

	if (isAuthChecking) {
		return <LoadingScreen />;
	}

	return (
		<Flex direction="column" gap={4}>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				gap={4}
				w="100%"
				align={{ base: 'stretch', md: 'flex-end' }}
			>
				<Flex flex={{ base: '1', md: '1' }}>
					<ProductSearch />
				</Flex>

				<Flex
					direction={{ base: 'column', md: 'row' }}
					gap={3}
					flex="1"
					align="stretch"
					justify={{ base: 'flex-start', md: 'flex-end' }}
				>
					<FilterByMinAmount />
					<FilterByMaxAmount />
					<FilterByCategory />
					<FilterByLowStock />
				</Flex>
			</Flex>
			{products.content?.map((product) => (
				<ProductStockControllerCard key={product.id} product={product} />
			))}
			<Pagination
				total={products.totalElements}
				colorScheme={'orange'}
				perPage={products.pageSize}
			/>
		</Flex>
	);
}

'use client';

import { Flex } from '@chakra-ui/react';
import Card from '@components/card/Card';
import LoadingScreen from '@components/loading/LoadingScreen';
import SidebarWithHeader from '@components/navigation/sidebar/SidebarWithBanner';
import { Suspense } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import ProductTable from '@/components/table/ProductTable';
import useDashboardPage from '@/lib/hooks/useDashboardPage';

export default function DashboardPage() {
	return (
		<main>
			<SidebarWithHeader>
				<Suspense fallback={<LoadingScreen />}>
					<DashboardContent />
				</Suspense>
			</SidebarWithHeader>
		</main>
	);
}

function DashboardContent() {
	const { reportData, isLoading, barChartData, isAuthChecking } =
		useDashboardPage();

	if (isAuthChecking || isLoading) {
		return <LoadingScreen />;
	}

	return (
		<Flex direction="column" gap={4}>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				justifyContent={{ base: 'center', md: 'space-between' }}
				alignItems="center"
				gap={4}
				flexGrow={1}
				flexWrap="wrap"
			>
				<Flex
					justifyContent="center"
					alignItems="center"
					gap={4}
					flexWrap="wrap"
					mb={{ base: 4, md: 0 }}
				>
					<Card
						name="Products With Minimum Stock"
						quantity={reportData?.totalProductsWithMinStock ?? 0}
						iconColor="orange.600"
					/>
					<Card
						name="Products Added Last Week"
						quantity={reportData?.totalProductsAddedLastWeek ?? 0}
						iconColor="green.600"
					/>
					<Card
						name="Products Deleted Last Week"
						quantity={reportData?.totalProductsDeletedLastWeek ?? 0}
						iconColor="red.600"
					/>
				</Flex>
			</Flex>
			<ProductTable
				products={reportData?.topProductsWithMostModifications ?? []}
				isLoading={isLoading}
				title="Top 5 Products with Most Modifications"
			/>
			<Flex
				mt={8}
				w="100%"
				h={400}
				bg="white"
				p={4}
				borderRadius="md"
				boxShadow="md"
			>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={barChartData} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" />
						<YAxis dataKey="category" type="category" width={150} />
						<Tooltip />
						<Bar dataKey="value" fill="#17616e" />
					</BarChart>
				</ResponsiveContainer>
			</Flex>
		</Flex>
	);
}

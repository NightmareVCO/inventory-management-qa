'use client';

import { Accordion, Flex } from '@chakra-ui/react';
import AccordionChange from '@components/accordion/ChangesAccordion';
import LoadingScreen from '@components/loading/LoadingScreen';
import SidebarWithHeader from '@components/navigation/sidebar/SidebarWithBanner';
import Pagination from '@components/pagination/Pagination';
import useChangesPage from '@lib/hooks/useChangesPage';
import type { ProductChanges } from '@lib/model/productChanges.model';
import { Suspense } from 'react';

export default function ChangesPage() {
	return (
		<main>
			<SidebarWithHeader>
				<Suspense fallback={<LoadingScreen />}>
					<ChangesContent />
				</Suspense>
			</SidebarWithHeader>
		</main>
	);
}

function ChangesContent() {
	const { changes, isLoading, isAuthChecking } = useChangesPage();

	if (isAuthChecking || isLoading) {
		return <LoadingScreen />;
	}

	return (
		<Flex direction="column" gap={4} bg={'white'} p={4}>
			<Accordion allowMultiple>
				{changes.content?.map((change) => (
					<AccordionChange
						key={change.id}
						productChange={change as ProductChanges}
					/>
				))}
			</Accordion>
			<Pagination
				total={changes.totalElements}
				colorScheme={'orange'}
				perPage={changes.pageSize}
			/>
		</Flex>
	);
}

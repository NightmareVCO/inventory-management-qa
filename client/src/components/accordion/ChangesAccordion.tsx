import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Badge,
	Box,
	Card,
	CardBody,
	Text,
} from '@chakra-ui/react';
import { useChangesAccordion } from '@lib/hooks/useChangesAccordion';
import type { ProductChanges } from '@lib/model/productChanges.model';

export type ChangesAccordionProps = {
	productChange: ProductChanges;
};

export default function AccordionChange({
	productChange,
}: ChangesAccordionProps) {
	const { changeTitle } = useChangesAccordion({ productChange });

	return (
		<AccordionItem>
			<h2>
				<AccordionButton>
					<Box as="span" flex="1" textAlign="left" p={3}>
						<Text fontWeight="medium">{changeTitle(productChange)}</Text>
					</Box>
					View Details
					<AccordionIcon />
				</AccordionButton>
			</h2>
			<AccordionPanel pb={2}>
				<Card shadow={'md'} border={'1px solid'} borderColor={'gray.200'} p={2}>
					<CardBody>
						<Text mb={2} display="flex" alignItems="center">
							<Box as="strong" w="40%">
								Product Name:
							</Box>
							<Box w="fit-content" textAlign="left">
								{productChange.product.name}
							</Box>
						</Text>
						<Text mb={2} display="flex" alignItems="center">
							<Box as="strong" w="40%">
								Change Type:
							</Box>
							<Badge
								colorScheme={
									productChange.revType === 'ADD'
										? 'green'
										: productChange.revType === 'MOD'
											? 'yellow'
											: 'red'
								}
								variant="solid"
								borderRadius="full"
								px={2}
								w="fit-content"
							>
								{productChange.revType === 'ADD'
									? 'Added'
									: productChange.revType === 'MOD'
										? 'Modified'
										: 'Deleted'}
							</Badge>
						</Text>
						<Text mb={2} display="flex" alignItems="center">
							<Box as="strong" w="40%">
								Timestamp:
							</Box>
							<Box w="fit-content" textAlign="left">
								{new Date(productChange.timestamp).toLocaleString()}
							</Box>
						</Text>
						<Text mb={2} display="flex" alignItems="center">
							<Box as="strong" w="40%">
								User Email:
							</Box>
							<Box w="fit-content" textAlign="left">
								{productChange.userEmail}
							</Box>
						</Text>
						{productChange.revType === 'MOD' && (
							<>
								<Text mb={2} display="flex" alignItems="center">
									<Box as="strong" w="40%">
										Previous Quantity:
									</Box>
									<Box w="fit-content" textAlign="left">
										{productChange.product.olderQuantity}
									</Box>
								</Text>
								<Text mb={2} display="flex" alignItems="center">
									<Box as="strong" w="40%">
										Current Quantity:
									</Box>
									<Box w="fit-content" textAlign="left">
										{productChange.product.quantity}
									</Box>
								</Text>
							</>
						)}
					</CardBody>
				</Card>
			</AccordionPanel>
		</AccordionItem>
	);
}

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import type { Notification } from '@lib/model/notification.model';
import { FiBox } from 'react-icons/fi';

export type ProductNotificationProps = {
	notification: Notification;
	onDelete: (uuid: string) => void;
};

export default function ProductNotification({
	notification,
	onDelete,
}: ProductNotificationProps) {
	return (
		<Flex
			p={1}
			w="fit"
			minW="350px"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				bg="white"
				w="100%"
				borderWidth="1px"
				rounded="lg"
				shadow="sm"
				position="relative"
				overflow="hidden"
			>
				<Box p={2}>
					<Flex justifyContent="space-between" alignItems="center">
						<Flex px={4} alignItems="center">
							<Icon as={FiBox} h={5} w={5} color="red.400" mr={3} />
							<Text
								fontSize="md"
								fontWeight="normal"
								lineHeight="tight"
								noOfLines={1}
							>
								Product
							</Text>
							<Text
								fontSize="md"
								fontWeight="bold"
								lineHeight="tight"
								noOfLines={1}
							>
								&nbsp;{notification.productName}&nbsp;
							</Text>
							<Text
								fontSize="md"
								fontWeight="normal"
								lineHeight="tight"
								noOfLines={1}
							>
								is low on stock. Please Re-Stock.
							</Text>
						</Flex>

						<Flex
							bg="gray.100"
							color="gray.800"
							px={3}
							py={1}
							borderRadius="md"
							fontWeight="semibold"
						>
							{`Quantity: ${notification.quantity} (Min: ${notification.threshold})`}
						</Flex>

						<Flex px={4} alignItems="center">
							<Button
								color={'red.400'}
								bg="transparent"
								_hover={{ bg: 'red.100' }}
								onClick={() => {
									onDelete(notification.uuid);
								}}
							>
								<Text fontSize="sm" fontWeight="bold">
									Discard
								</Text>
							</Button>
						</Flex>
					</Flex>
				</Box>
			</Box>
		</Flex>
	);
}

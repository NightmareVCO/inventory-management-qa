import { Box, Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';
import useAuth from '@lib/hooks/useAuth';
import useInventoryPage from '@lib/hooks/useInventoryPage';
import useProductStockControllerCard from '@lib/hooks/useProductStockControllerCard';
import type { Product } from '@lib/model/product.model';
import { FiBox } from 'react-icons/fi';

export type ProductStockControllerCardProps = {
	product: Product;
};

export default function ProductStockControllerCard({
	product,
}: ProductStockControllerCardProps) {
	const toast = useToast();
	const { token } = useAuth({});
	const { refreshProducts } = useInventoryPage();
	const { quantity, handleIncrease, handleDecrease } =
		useProductStockControllerCard({
			product,
			token: token ?? '',
			onSuccess: (product) => {
				toast({
					title: 'Stock updated',
					description: `${product.name} stock has been updated to ${quantity} from ${product.quantity}`,
					status: quantity < +product.quantity ? 'warning' : 'success',
					duration: 5000,
					isClosable: true,
				});

				refreshProducts();
			},
			onError: (error) => {
				toast({
					title: 'Stock update failed',
					description: error.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			},
		});

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
				<Box p={4}>
					<Flex justifyContent="space-between" alignItems="center">
						<Flex px={4} alignItems="center">
							<Icon as={FiBox} h={5} w={5} color="turquoise.800" mr={3} />
							<Text
								fontSize="md"
								fontWeight="semibold"
								lineHeight="tight"
								noOfLines={1}
							>
								{product.name}
							</Text>
						</Flex>
						<Flex px={4} alignItems="center" gap={2}>
							<Button
								color={'red.500'}
								bg="red.100"
								_hover={{ bg: 'red.200' }}
								onClick={handleDecrease}
							>
								<Text fontSize="sm" fontWeight="bold">
									-
								</Text>
							</Button>
							<Box
								px={4}
								py={1}
								borderWidth="1px"
								borderRadius="md"
								textAlign="center"
								fontWeight="semibold"
							>
								{quantity}
							</Box>
							<Button
								color={'green.500'}
								bg="green.100"
								_hover={{ bg: 'green.200' }}
								onClick={handleIncrease}
							>
								<Text fontSize="sm" fontWeight="bold">
									+
								</Text>
							</Button>
						</Flex>
					</Flex>
				</Box>
			</Box>
		</Flex>
	);
}

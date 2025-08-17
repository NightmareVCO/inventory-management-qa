'use client';

import {
	Box,
	Container,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import NavbarImagotipo from '@/components/brand/NavbarImagotipo';

export default function Footer() {
	return (
		<Box
			bg={useColorModeValue('gray.100', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}
		>
			<Container
				as={Stack}
				maxW={'6xl'}
				py={4}
				spacing={4}
				justify={'center'}
				align={'center'}
			>
				<NavbarImagotipo width={209} height={38} />
			</Container>

			<Box
				borderTopWidth={1}
				borderStyle={'solid'}
				borderColor={useColorModeValue('gray.200', 'gray.700')}
			>
				<Container
					as={Stack}
					maxW={'6xl'}
					py={4}
					direction={{ base: 'column', md: 'row' }}
					spacing={4}
					justify={{ base: 'center', md: 'center' }}
					align={{ base: 'center', md: 'center' }}
				>
					<Text>© 2025 Fuji Inventory. All rights reserved</Text>
				</Container>
			</Box>
		</Box>
	);
}

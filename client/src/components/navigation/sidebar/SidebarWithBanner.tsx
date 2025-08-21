'use client';

import {
	Avatar,
	Box,
	type BoxProps,
	CloseButton,
	Drawer,
	DrawerContent,
	Flex,
	type FlexProps,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import ProductNotification from '@components/card/ProductNotificationCard';
import useAuth from '@lib/hooks/useAuth';
import useNotificationProduct from '@lib/hooks/useNotificationProduct';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
	FiBell,
	FiBox,
	FiChevronDown,
	FiGrid,
	FiHome,
	FiLayers,
	FiMenu,
} from 'react-icons/fi';
import { VscBellDot } from 'react-icons/vsc';

interface LinkItemProps {
	name: string;
	href: string;
	icon: IconType;
}

interface NavItemProps extends FlexProps {
	icon: IconType;
	href?: string;
	children: React.ReactNode;
}

interface MobileProps extends FlexProps {
	onOpen: () => void;
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
	{ name: 'Dashboard', href: '/dashboard', icon: FiHome },
	{ name: 'Inventory', href: '/inventory', icon: FiGrid },
	{ name: 'Stock', href: '/stock', icon: FiBox },
	{ name: 'Changes', href: '/changes', icon: FiLayers },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			transition="3s ease"
			bg={useColorModeValue('white', 'gray.900')}
			borderRight="1px"
			borderRightColor={useColorModeValue('gray.200', 'gray.700')}
			w={{ base: 'full', md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
			</Flex>
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon} href={link.href}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Box
			as="a"
			href={href}
			style={{ textDecoration: 'none' }}
			_focus={{ boxShadow: 'none' }}
		>
			<Flex
				align="center"
				p="4"
				mx="4"
				my="2"
				borderRadius="lg"
				// biome-ignore lint/a11y/useSemanticElements: it does not affect accessibility
				role="group"
				bg={isActive ? 'turquoise.700' : 'transparent'}
				color={isActive ? 'white' : 'gray.600'}
				cursor="pointer"
				_hover={{
					bg: 'turquoise.600',
					color: 'white',
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: 'white',
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Box>
	);
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	const { currentUser } = useAuth({});
	const { notifications, handleDeleteNotification } = useNotificationProduct();

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg="white"
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
			justifyContent={{ base: 'space-between', md: 'flex-end' }}
			{...rest}
		>
			<IconButton
				display={{ base: 'flex', md: 'none' }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<HStack spacing={{ base: '0', md: '6' }}>
				<Menu closeOnSelect={false}>
					<MenuButton
						py={2}
						transition="all 0.3s"
						_focus={{ boxShadow: 'none' }}
					>
						{notifications.length > 0 ? (
							<VscBellDot size="24px" color="#fd8916" />
						) : (
							<FiBell size="24px" />
						)}
					</MenuButton>
					{notifications?.length > 0 && (
						<MenuList bg="white" borderColor="gray.200">
							{notifications?.map((notification) => {
								return (
									<MenuItem key={notification.uuid}>
										<ProductNotification
											notification={notification}
											onDelete={handleDeleteNotification}
										/>
									</MenuItem>
								);
							})}
						</MenuList>
					)}
				</Menu>

				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton
							py={2}
							transition="all 0.3s"
							_focus={{ boxShadow: 'none' }}
						>
							<HStack>
								<Avatar
									size={'sm'}
									src={`https://unavatar.io/${currentUser.name.toLowerCase()}`}
								/>
								<VStack
									display={{ base: 'none', md: 'flex' }}
									alignItems="flex-start"
									spacing="1px"
									ml="2"
								>
									<Text fontSize="sm">
										{currentUser.name} {currentUser.lastName}
									</Text>
									<Text fontSize="xs" color="gray.600">
										{currentUser.role ? currentUser.role.join(', ') : 'No Role'}
									</Text>
								</VStack>
								<Box display={{ base: 'none', md: 'flex' }}>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};

type SidebarWithHeaderProps = {
	children?: React.ReactNode;
};

const SidebarWithHeader = ({ children }: SidebarWithHeaderProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box
			minH="calc(100vh - 187px)"
			bg={useColorModeValue('gray.100', 'gray.900')}
		>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: 'none', md: 'block' }}
			/>
			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav onOpen={onOpen} />
			<Box
				ml={{ base: 0, md: 60 }}
				p="4"
				height="calc(100vh - 187px)"
				overflowY="auto"
				sx={{
					'&::-webkit-scrollbar': {
						width: '8px',
						borderRadius: '8px',
						backgroundColor: 'rgba(0, 0, 0, 0.05)',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
						borderRadius: '8px',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.2)',
						},
					},
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default SidebarWithHeader;

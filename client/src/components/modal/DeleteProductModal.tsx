'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useToast,
} from '@chakra-ui/react';
import useAuth from '@lib/hooks/useAuth';
import useDeleteProduct from '@lib/hooks/useDeleteModal';
import useInventoryPage from '@lib/hooks/useInventoryPage';
import type { Product } from '@lib/model/product.model';
import { useRef } from 'react';

type DeleteProductModalProps = {
	isOpen: boolean;
	onClose: () => void;
	product: Product | undefined;
	onDelete?: (productId: string) => void;
};

export default function DeleteProductModal({
	isOpen,
	onClose,
	product,
	onDelete,
}: DeleteProductModalProps) {
	const toast = useToast();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const { refreshProducts } = useInventoryPage();
	const { token, hasAdminPermission } = useAuth({});

	const { deleteProductById, isDeleting } = useDeleteProduct({
		isAdmin: hasAdminPermission,
		onSuccess: (productId) => {
			if (product) {
				toast({
					title: 'Product deleted',
					description: `${product.name} has been deleted successfully`,
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
			}

			refreshProducts();

			if (onDelete) {
				onDelete(productId);
			}

			onClose();
		},
		// biome-ignore lint/suspicious/noExplicitAny: n/a
		onError: (error: any) => {
			toast({
				title: 'Delete failed',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		},
		token: token ?? '',
	});

	const handleDelete = async () => {
		if (!product || !product.id) return;

		await deleteProductById(product.id);
	};

	if (!product) return null;

	return (
		<AlertDialog
			isOpen={isOpen}
			//@ts-ignore
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isCentered
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Delete Product
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure you want to delete <strong>{product.name}</strong>?
						This action cannot be undone.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme="red"
							onClick={handleDelete}
							isLoading={isDeleting}
							isDisabled={!hasAdminPermission}
							ml={3}
							_hover={{
								bg: 'red.500',
							}}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}

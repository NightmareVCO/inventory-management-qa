'use client';

import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import useFilterByCategory from '@lib/hooks/useFilterByCategory';

export const PRODUCT_CATEGORIES = [
	'ELECTRONICS',
	'CLOTHING',
	'FOOD',
	'BOOKS',
	'TOYS',
	'FURNITURE',
	'OTHER',
];

interface FilterByCategoryProps {
	label?: string;
	placeholder?: string;
}

export default function FilterByCategory({
	label = 'Category',
	placeholder = 'All Categories',
}: FilterByCategoryProps) {
	const { value, handleChange } = useFilterByCategory();

	return (
		<FormControl>
			<FormLabel fontSize="sm" mb={1}>
				{label}
			</FormLabel>
			<Select
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				size="md"
				borderRadius="md"
				bg="white"
				focusBorderColor="turquoise.700"
			>
				{PRODUCT_CATEGORIES.map((category) => (
					<option key={category} value={category}>
						{category}
					</option>
				))}
			</Select>
		</FormControl>
	);
}

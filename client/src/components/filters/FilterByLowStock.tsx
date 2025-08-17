'use client';

import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import useFilterByLowStock from '@lib/hooks/useFilterByLowStock';

interface FilterByMaxAmountProps {
	label?: string;
}

export default function FilterByLowStock({
	label = 'Low Stock',
}: FilterByMaxAmountProps) {
	const { value, handleChange } = useFilterByLowStock();

	return (
		<Box p={2} w="fit" minW="100px" alignItems="center" justifyContent="center">
			<FormControl>
				<FormLabel fontSize="sm" mb={1}>
					{label}
				</FormLabel>
				<Switch
					isChecked={value}
					onChange={(e) => handleChange(e.target.checked)}
				/>
			</FormControl>
		</Box>
	);
}

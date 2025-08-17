'use client';

import {
	FormControl,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from '@chakra-ui/react';
import useFilterByMaxAmount from '@lib/hooks/useFilterByMaxAmount';

interface FilterByMaxAmountProps {
	label?: string;
}

export default function FilterByMaxAmount({
	label = 'Max Price',
}: FilterByMaxAmountProps) {
	const { value, handleChange } = useFilterByMaxAmount();

	return (
		<FormControl>
			<FormLabel fontSize="sm" mb={1}>
				{label}
			</FormLabel>
			<NumberInput
				value={value}
				onChange={handleChange}
				min={0}
				precision={2}
				size="md"
				borderRadius="md"
				bg="white"
				focusBorderColor="turquoise.700"
			>
				<NumberInputField placeholder={label} />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
		</FormControl>
	);
}

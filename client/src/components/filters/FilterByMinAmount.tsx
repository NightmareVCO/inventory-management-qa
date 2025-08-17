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
import useFilterByMinAmount from '@/lib/hooks/useFilterByMinAmount';

interface FilterByMinAmountProps {
	label?: string;
}

export default function FilterByMinAmount({
	label = 'Min Price',
}: FilterByMinAmountProps) {
	const { value, handleChange } = useFilterByMinAmount();

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

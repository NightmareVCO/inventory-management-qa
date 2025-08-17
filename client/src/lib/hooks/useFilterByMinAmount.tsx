import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useFilterByMinAmount() {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const [value, setValue] = useState(searchParams.get('minPrice') || '');

	useEffect(() => {
		setValue(searchParams.get('minPrice') || '');
	}, [searchParams]);

	const updateURL = useDebouncedCallback((newValue: string) => {
		const params = new URLSearchParams(searchParams);

		if (newValue && Number.parseFloat(newValue) > 0) {
			params.set('minPrice', newValue);
		} else {
			params.delete('minPrice');
		}

		replace(`${pathname}?${params.toString()}`);
	}, 500);

	const handleChange = (valueString: string) => {
		setValue(valueString);
		updateURL(valueString);
	};

	return {
		value,
		handleChange,
	};
}

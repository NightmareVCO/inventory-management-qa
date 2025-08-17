import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useFilterByMaxAmount() {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const [value, setValue] = useState(searchParams.get('maxPrice') || '');

	useEffect(() => {
		setValue(searchParams.get('maxPrice') || '');
	}, [searchParams]);

	const updateURL = useDebouncedCallback((newValue: string) => {
		const params = new URLSearchParams(searchParams);

		if (newValue && Number.parseFloat(newValue) > 0) {
			params.set('maxPrice', newValue);
		} else {
			params.delete('maxPrice');
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

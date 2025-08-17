import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useFilterByLowStock() {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const [value, setValue] = useState(searchParams.get('lowStock') === 'true');

	useEffect(() => {
		setValue(searchParams.get('lowStock') === 'true');
	}, [searchParams]);

	const updateURL = useDebouncedCallback((newValue: boolean) => {
		const params = new URLSearchParams(searchParams);

		if (newValue) {
			params.set('lowStock', 'true');
		} else {
			params.delete('lowStock');
		}

		replace(`${pathname}?${params.toString()}`);
	}, 300);

	const handleChange = (newValue: boolean) => {
		setValue(newValue);
		updateURL(newValue);
	};

	return {
		value,
		handleChange,
	};
}

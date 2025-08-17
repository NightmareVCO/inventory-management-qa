import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useFilterByCategory() {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const [value, setValue] = useState(searchParams.get('category') || '');

	useEffect(() => {
		setValue(searchParams.get('category') || '');
	}, [searchParams]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setValue(value);

		const params = new URLSearchParams(searchParams);

		if (value) {
			params.set('category', value);
		} else {
			params.delete('category');
		}

		replace(`${pathname}?${params.toString()}`);
	};

	return {
		value,
		handleChange,
	};
}

export const fetcher = (url: string, options: RequestInit = {}) => {
	const headers = {
		...(options.headers || {}),
		Authorization:
			(options.headers as Record<string, string>)?.Authorization || '',
	};

	return fetch(url, { ...options, headers }).then((res) => {
		console.log('Request Options:', res);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return res.json();
	});
};

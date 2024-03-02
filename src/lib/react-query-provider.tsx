"use client";

// from https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
	children: React.ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

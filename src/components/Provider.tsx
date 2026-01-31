"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthSessionManager } from "@/features/auth/components/auth-session-manager";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60,
						refetchOnWindowFocus: false, // Tắt tự động fetch khi switch tab
						retry: 1,
					},
					mutations: {
						retry: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthSessionManager />
			{children}
		</QueryClientProvider>
	);
}

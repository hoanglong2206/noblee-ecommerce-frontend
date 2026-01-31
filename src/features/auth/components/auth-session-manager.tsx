"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../service";
import { authQueryKeys } from "../query";
import { userQueryKeys } from "@/features/user/query";
import {
	AUTH_TOKEN_EVENT,
	clearStoredAccessToken,
	getMsUntilExpiry,
	getStoredAccessToken,
	isTokenExpired,
} from "../token";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthUser } from "../type";

const GUEST_ROUTES = new Set(["/login", "/register"]);
const TOKEN_SKEW_MS = 5_000;

export function AuthSessionManager(): null {
	const router = useRouter();
	const pathname = usePathname();
	const queryClient = useQueryClient();
	const logoutTimerRef = useRef<number>(0);
	const setUser = useAuthStore((state) => state.setUser);
	const clearUser = useAuthStore((state) => state.clearUser);
	const markHydrated = useAuthStore((state) => state.markHydrated);
	const user = useAuthStore((state) => state.user);
	const isHydrated = useAuthStore((state) => state.isHydrated);

	const clearSession = useCallback(() => {
		clearStoredAccessToken();
		clearUser();
		queryClient.removeQueries({ queryKey: authQueryKeys.base });
		queryClient.removeQueries({ queryKey: userQueryKeys.base });
	}, [clearUser, queryClient]);

	const scheduleLogout = useCallback(
		(token: string) => {
			if (logoutTimerRef.current) {
				window.clearTimeout(logoutTimerRef.current);
			}
			const msUntilExpiry = getMsUntilExpiry(token, TOKEN_SKEW_MS);
			if (msUntilExpiry === null) {
				return;
			}
			if (msUntilExpiry <= 0) {
				void (async () => {
					await authService
						.logout()
						.catch(() => undefined)
						.finally(() => {
							clearSession();
							router.replace("/login");
						});
				})();
				return;
			}
			logoutTimerRef.current = window.setTimeout(() => {
				void (async () => {
					await authService.logout().catch(() => undefined);
					clearSession();
					router.replace("/login");
				})();
			}, msUntilExpiry);
		},
		[clearSession, router],
	);

	const bootstrap = useCallback(async () => {
		const token = getStoredAccessToken();
		if (!token) {
			clearSession();
			markHydrated();
			return;
		}
		if (isTokenExpired(token, TOKEN_SKEW_MS)) {
			await authService.logout().catch(() => undefined);
			clearSession();
			markHydrated();
			router.replace("/login");
			return;
		}
		scheduleLogout(token);
		const cachedUser = queryClient.getQueryData(authQueryKeys.me());
		if (cachedUser) {
			setUser(cachedUser as AuthUser);
			markHydrated();
			return;
		}
		try {
			const result = await authService.refreshTokens();
			setUser(result.user);
			queryClient.setQueryData(authQueryKeys.me(), result.user);
			queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
			markHydrated();
		} catch (error) {
			await authService.logout().catch(() => undefined);
			clearSession();
			markHydrated();
			router.replace("/login");
		}
	}, [
		clearSession,
		markHydrated,
		queryClient,
		router,
		scheduleLogout,
		setUser,
	]);

	useEffect(() => {
		void bootstrap();
	}, [bootstrap]);

	useEffect(() => {
		const handleTokenChanged = () => {
			void bootstrap();
		};
		window.addEventListener(AUTH_TOKEN_EVENT, handleTokenChanged);
		return () => {
			window.removeEventListener(AUTH_TOKEN_EVENT, handleTokenChanged);
			if (logoutTimerRef.current) {
				window.clearTimeout(logoutTimerRef.current);
			}
		};
	}, [bootstrap]);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}
		if (user && GUEST_ROUTES.has(pathname)) {
			router.replace("/");
		}
	}, [isHydrated, pathname, router, user]);

	return null;
}

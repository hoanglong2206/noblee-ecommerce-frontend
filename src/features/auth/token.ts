import { Buffer } from "buffer";
const ACCESS_TOKEN_KEY = "access_token";
export const AUTH_TOKEN_EVENT = "auth-token-changed";

const dispatchTokenEvent = (token: string | null): void => {
	if (typeof window === "undefined") {
		return;
	}
	window.dispatchEvent(
		new CustomEvent(AUTH_TOKEN_EVENT, {
			detail: { token },
		}),
	);
};

export const storeAccessToken = (token?: string | null): void => {
	if (typeof window === "undefined") {
		return;
	}
	const current = localStorage.getItem(ACCESS_TOKEN_KEY);
	if (!token) {
		if (current !== null) {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			dispatchTokenEvent(null);
		}
		return;
	}
	if (current !== token) {
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
		dispatchTokenEvent(token);
	}
};

export const getStoredAccessToken = (): string | null => {
	if (typeof window === "undefined") {
		return null;
	}
	return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearStoredAccessToken = (): void => {
	storeAccessToken(null);
};

const decodeBase64 = (input: string): string => {
	if (typeof window !== "undefined" && typeof window.atob === "function") {
		return window.atob(input);
	}
	return Buffer.from(input, "base64").toString("utf-8");
};

type JwtPayload = {
	exp?: number;
	[key: string]: unknown;
};

export const decodeAccessToken = (token: string): JwtPayload | null => {
	try {
		const [, payload] = token.split(".");
		if (!payload) {
			return null;
		}
		const json = decodeBase64(payload);
		return JSON.parse(json) as JwtPayload;
	} catch (error) {
		console.error("Failed to decode token:", error);
		return null;
	}
};

export const getTokenExpiry = (token: string): number | null => {
	const payload = decodeAccessToken(token);
	if (!payload?.exp) {
		return null;
	}
	return payload.exp * 1000;
};

export const isTokenExpired = (token: string, skewMs = 0): boolean => {
	const expiry = getTokenExpiry(token);
	if (!expiry) {
		return true;
	}
	return Date.now() >= expiry - skewMs;
};

export const getMsUntilExpiry = (token: string, skewMs = 0): number | null => {
	const expiry = getTokenExpiry(token);
	if (!expiry) {
		return null;
	}
	return expiry - Date.now() - skewMs;
};

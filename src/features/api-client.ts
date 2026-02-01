import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import https from "https";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthResponse } from "@/features/auth/type";

type ApiErrorPayload = {
	message?: string;
	errors?: Record<string, string[] | string>;
	statusCode?: number;
};

export type ApiError = {
	status: number;
	message: string;
	details?: Record<string, string[] | string>;
	isNetworkError: boolean;
	raw: AxiosError<ApiErrorPayload>;
};

type TokenResolver = () => string | null;

const getNormalizedBaseUrl = () => {
	const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
	return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const BASE_URL = getNormalizedBaseUrl();
const REQUEST_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 15000);
const HTTPS_AGENT = new https.Agent({
	rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false,
});

type PersistedAuthState = {
	state?: {
		accessToken?: string | null;
		accessTokenExpiresIn?: number | null;
	};
};

const readPersistedAuthState = (): PersistedAuthState["state"] | null => {
	if (typeof window === "undefined") {
		return null;
	}
	const authStorage = localStorage.getItem("auth-storage");
	if (!authStorage) {
		return null;
	}
	try {
		const parsed = JSON.parse(authStorage) as PersistedAuthState;
		return parsed.state ?? null;
	} catch {
		return null;
	}
};

const resolveTokenFallback: TokenResolver = () => {
	if (typeof window === "undefined") {
		return null;
	}
	const persisted = readPersistedAuthState();
	if (!persisted || !persisted.accessToken) {
		return null;
	}
	const expiresAt = persisted.accessTokenExpiresIn ?? null;
	if (!expiresAt || Date.now() >= expiresAt) {
		return null;
	}
	return persisted.accessToken;
};

const resolveToken: TokenResolver = () => {
	const store = useAuthStore.getState();
	if (
		store.accessToken &&
		store.accessTokenExpiresIn &&
		!store.isTokenExpired()
	) {
		return store.accessToken;
	}
	return resolveTokenFallback();
};

export const apiClient: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	timeout: REQUEST_TIMEOUT,
	httpsAgent: HTTPS_AGENT,
});

const refreshClient = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	timeout: REQUEST_TIMEOUT,
	httpsAgent: HTTPS_AGENT,
});

const normalizeError = (error: AxiosError<ApiErrorPayload>): ApiError => {
	const status = error.response?.status ?? 0;
	const payload = error.response?.data;
	return {
		status,
		message: payload?.message ?? error.message,
		details: payload?.errors,
		isNetworkError: !error.response,
		raw: error,
	};
};

apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = resolveToken();
		if (token) {
			config.headers = config.headers ?? {};
			if (!config.headers.Authorization) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

type RetriableAxiosConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

const applyRefreshedTokens = (tokens: AuthResponse["tokens"]): string => {
	useAuthStore
		.getState()
		.login(tokens.accessToken, tokens.accessTokenExpiresIn);
	return tokens.accessToken;
};

const requestTokenRefresh = async (): Promise<string | null> => {
	try {
		const response = await refreshClient.post<AuthResponse>("/auth/refresh");
		const data = response.data;
		return applyRefreshedTokens(data.tokens);
	} catch (error) {
		useAuthStore.getState().logout();
		if (axios.isAxiosError(error)) {
			throw normalizeError(error);
		}
		throw error;
	}
};

const ensureRefreshPromise = (): Promise<string | null> => {
	if (!refreshPromise) {
		refreshPromise = requestTokenRefresh().catch((error) => {
			refreshPromise = null;
			throw error;
		});
		refreshPromise.finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ApiErrorPayload>) => {
		if (!axios.isAxiosError(error)) {
			return Promise.reject(error);
		}
		const status = error.response?.status;
		const originalRequest = error.config as RetriableAxiosConfig | undefined;
		const shouldAttemptRefresh =
			status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			originalRequest.url &&
			!originalRequest.url.includes("/auth/login") &&
			!originalRequest.url.includes("/auth/register") &&
			!originalRequest.url.includes("/auth/otp") &&
			!originalRequest.url.includes("/auth/refresh");
		if (shouldAttemptRefresh) {
			try {
				const newToken = await ensureRefreshPromise();
				if (newToken) {
					originalRequest._retry = true;
					originalRequest.headers = originalRequest.headers ?? {};
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return apiClient(originalRequest);
				}
				useAuthStore.getState().logout();
			} catch (refreshError) {
				if (axios.isAxiosError(refreshError)) {
					return Promise.reject(refreshError);
				}
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(normalizeError(error));
	},
);

export const isApiError = (error: unknown): error is ApiError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"message" in error &&
		"raw" in error
	);
};

export default apiClient;

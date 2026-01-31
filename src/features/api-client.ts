import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import https from "https";

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

const resolveTokenFallback: TokenResolver = () => {
	if (typeof window === "undefined") {
		return null;
	}
	try {
		return localStorage.getItem("access_token");
	} catch {
		return null;
	}
};

const resolveToken: TokenResolver = resolveTokenFallback;

export const apiClient: AxiosInstance = axios.create({
	baseURL: getNormalizedBaseUrl(),
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 15000),
	httpsAgent: new https.Agent({
		rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false,
	}),
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
	(config: InternalAxiosRequestConfig) => {
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

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ApiErrorPayload>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (!originalRequest._retry && error.response?.status === 401) {
			originalRequest._retry = true;
			try {
				const { data } = await apiClient.post("/auth/refresh");

				if (data?.accessToken) {
					localStorage.setItem("access_token", data.accessToken);
					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				if (typeof window !== "undefined") {
					localStorage.removeItem("access_token");
					window.location.href = "/login";
				}
				return Promise.reject(
					normalizeError(refreshError as AxiosError<ApiErrorPayload>),
				);
			}
		}

		if (error.response?.status === 403) {
			if (typeof window !== "undefined") {
				window.location.href = "/forbidden";
			}
		}
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

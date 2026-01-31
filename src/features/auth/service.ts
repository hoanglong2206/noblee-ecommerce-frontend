import { apiClient, isApiError, type ApiError } from "@/features/api-client";
import { AxiosResponse, isAxiosError } from "axios";
import {
	AuthResponse,
	AuthUser,
	LoginPayload,
	LogoutResponse,
	RegisterPayload,
	RefreshTokenPayload,
	SendOtpPayload,
	SendOtpResponse,
	SetAccountDisabledPayload,
	UpdateRolePayload,
	VerifyOtpPayload,
	VerifyOtpResponse,
} from "./type";
import { clearStoredAccessToken, storeAccessToken } from "./token";

type ApiErrorPayload = {
	message?: string;
	errors?: Record<string, string[] | string>;
	statusCode?: number;
};

const ensureResponse = <T>(response?: AxiosResponse<T>): T => {
	if (!response) {
		throw new Error("No response received from API.");
	}
	return response.data;
};

const throwApiError = (error: unknown): never => {
	if (isApiError(error)) {
		throw error;
	}
	if (isAxiosError<ApiErrorPayload>(error)) {
		const payload = error.response?.data;
		const normalized: ApiError = {
			status: error.response?.status ?? 0,
			message: payload?.message ?? error.message ?? "Request failed.",
			details: payload?.errors,
			isNetworkError: !error.response,
			raw: error,
		};
		throw normalized;
	}
	throw error instanceof Error
		? error
		: new Error("Unexpected error occurred while calling API.");
};

const sendOtp = async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
	try {
		const response = await apiClient.post<SendOtpResponse>(
			"/auth/otp/send",
			payload,
		);
		return ensureResponse(response);
	} catch (error) {
		return throwApiError(error);
	}
};

const resendOtp = async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
	try {
		const response = await apiClient.post<SendOtpResponse>(
			"/auth/otp/resend",
			payload,
		);
		return ensureResponse(response);
	} catch (error) {
		return throwApiError(error);
	}
};

const verifyOtp = async (
	payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> => {
	try {
		const response = await apiClient.post<VerifyOtpResponse>(
			"/auth/otp/verify",
			payload,
		);
		return ensureResponse(response);
	} catch (error) {
		return throwApiError(error);
	}
};

const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
	try {
		const response = await apiClient.post<AuthResponse>(
			"/auth/register",
			payload,
		);
		const data = ensureResponse(response);
		storeAccessToken(data.tokens.accessToken);
		return data;
	} catch (error) {
		return throwApiError(error);
	}
};

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
	try {
		const response = await apiClient.post<AuthResponse>("/auth/login", payload);
		const data = ensureResponse(response);
		storeAccessToken(data.tokens.accessToken);
		return data;
	} catch (error) {
		return throwApiError(error);
	}
};

const refreshTokens = async (
	payload?: RefreshTokenPayload,
): Promise<AuthResponse> => {
	try {
		const response = await apiClient.post<AuthResponse>(
			"/auth/refresh",
			payload,
		);
		const data = ensureResponse(response);
		storeAccessToken(data.tokens.accessToken);
		return data;
	} catch (error) {
		return throwApiError(error);
	}
};

const logout = async (): Promise<void> => {
	try {
		const response = await apiClient.post<LogoutResponse>("/auth/logout");
		ensureResponse(response);
		clearStoredAccessToken();
	} catch (error) {
		clearStoredAccessToken();
		return throwApiError(error);
	}
};

const updateRole = async (payload: UpdateRolePayload): Promise<AuthUser> => {
	try {
		const response = await apiClient.patch<{ message: string; user: AuthUser }>(
			"/auth/role",
			payload,
		);
		const data = ensureResponse(response);
		return data.user;
	} catch (error) {
		return throwApiError(error);
	}
};

const setAccountDisabled = async (
	payload: SetAccountDisabledPayload,
): Promise<AuthUser> => {
	try {
		const response = await apiClient.patch<{ message: string; user: AuthUser }>(
			"/auth/disable",
			payload,
		);
		const data = ensureResponse(response);
		return data.user;
	} catch (error) {
		return throwApiError(error);
	}
};

export const authService = {
	sendOtp,
	resendOtp,
	verifyOtp,
	register,
	login,
	refreshTokens,
	logout,
	updateRole,
	setAccountDisabled,
};

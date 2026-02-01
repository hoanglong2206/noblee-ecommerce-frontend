import { apiClient, isApiError, type ApiError } from "@/features/api-client";
import { AxiosResponse, isAxiosError } from "axios";
import {
	CreateAddressInput,
	DeleteAddressInput,
	SetDefaultAddressInput,
	UpdateAddressVariables,
	UpdateAvatarInput,
	UpdateAvatarResult,
	UpdateUserProfileInput,
	UserAddress,
	UserProfile,
} from "./type";

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

const getProfile = async (): Promise<UserProfile> => {
	try {
		const response = await apiClient.get<{ profile: UserProfile }>("/users/me");
		const data = ensureResponse(response);
		return data.profile;
	} catch (error) {
		return throwApiError(error);
	}
};

const updateProfile = async (
	input: UpdateUserProfileInput,
): Promise<UserProfile> => {
	try {
		const response = await apiClient.patch<{
			message: string;
			profile: UserProfile;
		}>("/users/me", input);
		const data = ensureResponse(response);
		return data.profile;
	} catch (error) {
		return throwApiError(error);
	}
};

const updateAvatar = async (
	input: UpdateAvatarInput,
): Promise<UpdateAvatarResult> => {
	try {
		const response = await apiClient.post<{
			message: string;
			avatarUrl: string;
			publicId?: string;
		}>("/users/me/avatar", input);
		const data = ensureResponse(response);
		return {
			avatarUrl: data.avatarUrl,
			publicId: data.publicId,
		};
	} catch (error) {
		return throwApiError(error);
	}
};

const getAddresses = async (): Promise<UserAddress[]> => {
	try {
		const response = await apiClient.get<{ addresses: UserAddress[] }>(
			"/users/addresses",
		);
		const data = ensureResponse(response);
		return data.addresses;
	} catch (error) {
		return throwApiError(error);
	}
};

const createAddress = async (
	input: CreateAddressInput,
): Promise<UserAddress> => {
	try {
		const response = await apiClient.post<{
			message: string;
			address: UserAddress;
		}>("/users/addresses", input);
		const data = ensureResponse(response);
		return data.address;
	} catch (error) {
		return throwApiError(error);
	}
};

const updateAddress = async (
	variables: UpdateAddressVariables,
): Promise<UserAddress> => {
	try {
		const response = await apiClient.patch<{
			message: string;
			address: UserAddress;
		}>(`/users/addresses/${variables.addressId}`, variables.input);
		const data = ensureResponse(response);
		return data.address;
	} catch (error) {
		return throwApiError(error);
	}
};

const deleteAddress = async ({
	addressId,
}: DeleteAddressInput): Promise<void> => {
	try {
		await apiClient.delete(`/users/addresses/${addressId}`);
	} catch (error) {
		return throwApiError(error);
	}
};

const setDefaultAddress = async (
	variables: SetDefaultAddressInput,
): Promise<UserAddress> => {
	try {
		const response = await apiClient.patch<{
			message: string;
			address: UserAddress;
		}>(`/users/addresses/${variables.addressId}/default`);
		const data = ensureResponse(response);
		return data.address;
	} catch (error) {
		return throwApiError(error);
	}
};

export const userService = {
	getProfile,
	updateProfile,
	updateAvatar,
	getAddresses,
	createAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
};

import {
	useMutation,
	useQueryClient,
	type UseMutationOptions,
} from "@tanstack/react-query";
import { type ApiError } from "@/features/api-client";
import { authService } from "./service";
import {
	AuthResponse,
	AuthUser,
	LoginPayload,
	RefreshTokenPayload,
	RegisterPayload,
	SendOtpPayload,
	SendOtpResponse,
	SetAccountDisabledPayload,
	UpdateRolePayload,
	VerifyOtpPayload,
	VerifyOtpResponse,
} from "./type";
import { userQueryKeys } from "@/features/user/query";
import { useAuthStore } from "@/store/useAuthStore";

export const authQueryKeys = {
	base: ["auth"] as const,
	me: () => ["auth", "me"] as const,
};

export const useSendOtpMutation = (
	options?: UseMutationOptions<
		SendOtpResponse,
		ApiError,
		SendOtpPayload,
		unknown
	>,
) => {
	return useMutation<SendOtpResponse, ApiError, SendOtpPayload, unknown>({
		mutationFn: authService.sendOtp,
		...options,
	});
};

export const useResendOtpMutation = (
	options?: UseMutationOptions<
		SendOtpResponse,
		ApiError,
		SendOtpPayload,
		unknown
	>,
) => {
	return useMutation<SendOtpResponse, ApiError, SendOtpPayload, unknown>({
		mutationFn: authService.resendOtp,
		...options,
	});
};

export const useVerifyOtpMutation = (
	options?: UseMutationOptions<
		VerifyOtpResponse,
		ApiError,
		VerifyOtpPayload,
		unknown
	>,
) => {
	return useMutation<VerifyOtpResponse, ApiError, VerifyOtpPayload, unknown>({
		mutationFn: authService.verifyOtp,
		...options,
	});
};

export const useRegisterMutation = (
	options?: UseMutationOptions<
		AuthResponse,
		ApiError,
		RegisterPayload,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	const setUser = useAuthStore((state) => state.setUser);
	return useMutation<AuthResponse, ApiError, RegisterPayload, unknown>({
		mutationFn: authService.register,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			setUser(data.user);
			queryClient.setQueryData(authQueryKeys.me(), data.user);
			queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useLoginMutation = (
	options?: UseMutationOptions<AuthResponse, ApiError, LoginPayload, unknown>,
) => {
	const queryClient = useQueryClient();
	const setUser = useAuthStore((state) => state.setUser);
	return useMutation<AuthResponse, ApiError, LoginPayload, unknown>({
		mutationFn: authService.login,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			setUser(data.user);
			queryClient.setQueryData(authQueryKeys.me(), data.user);
			queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useRefreshTokensMutation = (
	options?: UseMutationOptions<
		AuthResponse,
		ApiError,
		RefreshTokenPayload | undefined,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	const setUser = useAuthStore((state) => state.setUser);
	return useMutation<
		AuthResponse,
		ApiError,
		RefreshTokenPayload | undefined,
		unknown
	>({
		mutationFn: authService.refreshTokens,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			setUser(data.user);
			queryClient.setQueryData(authQueryKeys.me(), data.user);
			queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useLogoutMutation = (
	options?: UseMutationOptions<void, ApiError, void, unknown>,
) => {
	const queryClient = useQueryClient();
	const clearUser = useAuthStore((state) => state.clearUser);
	return useMutation<void, ApiError, void, unknown>({
		mutationFn: authService.logout,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			clearUser();
			queryClient.removeQueries({ queryKey: authQueryKeys.base });
			queryClient.removeQueries({ queryKey: userQueryKeys.base });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useUpdateRoleMutation = (
	options?: UseMutationOptions<AuthUser, ApiError, UpdateRolePayload, unknown>,
) => {
	return useMutation<AuthUser, ApiError, UpdateRolePayload, unknown>({
		mutationFn: authService.updateRole,
		...options,
	});
};

export const useSetAccountDisabledMutation = (
	options?: UseMutationOptions<
		AuthUser,
		ApiError,
		SetAccountDisabledPayload,
		unknown
	>,
) => {
	return useMutation<AuthUser, ApiError, SetAccountDisabledPayload, unknown>({
		mutationFn: authService.setAccountDisabled,
		...options,
	});
};

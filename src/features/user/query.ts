import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions,
	type UseMutationOptions,
} from "@tanstack/react-query";
import { type ApiError } from "@/features/api-client";
import { userService } from "./service";
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

export const userQueryKeys = {
	base: ["user"] as const,
	profile: () => ["user", "profile"] as const,
	addresses: () => ["user", "addresses"] as const,
};

type ProfileQueryKey = ReturnType<typeof userQueryKeys.profile>;
type AddressesQueryKey = ReturnType<typeof userQueryKeys.addresses>;

export const useUserProfileQuery = (
	options?: UseQueryOptions<
		UserProfile,
		ApiError,
		UserProfile,
		ProfileQueryKey
	>,
) => {
	return useQuery<UserProfile, ApiError, UserProfile, ProfileQueryKey>({
		queryKey: userQueryKeys.profile(),
		queryFn: userService.getProfile,
		...options,
	});
};

export const useUserAddressesQuery = (
	options?: UseQueryOptions<
		UserAddress[],
		ApiError,
		UserAddress[],
		AddressesQueryKey
	>,
) => {
	return useQuery<UserAddress[], ApiError, UserAddress[], AddressesQueryKey>({
		queryKey: userQueryKeys.addresses(),
		queryFn: userService.getAddresses,
		...options,
	});
};

export const useUpdateUserProfileMutation = (
	options?: UseMutationOptions<
		UserProfile,
		ApiError,
		UpdateUserProfileInput,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<UserProfile, ApiError, UpdateUserProfileInput, unknown>({
		mutationFn: userService.updateProfile,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.setQueryData(userQueryKeys.profile(), data);
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useUpdateAvatarMutation = (
	options?: UseMutationOptions<
		UpdateAvatarResult,
		ApiError,
		UpdateAvatarInput,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<UpdateAvatarResult, ApiError, UpdateAvatarInput, unknown>({
		mutationFn: userService.updateAvatar,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			const current = queryClient.getQueryData<UserProfile>(
				userQueryKeys.profile(),
			);
			if (current) {
				queryClient.setQueryData(userQueryKeys.profile(), {
					...current,
					avatarUrl: data.avatarUrl,
				});
			} else {
				queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
			}
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useCreateAddressMutation = (
	options?: UseMutationOptions<
		UserAddress,
		ApiError,
		CreateAddressInput,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<UserAddress, ApiError, CreateAddressInput, unknown>({
		mutationFn: userService.createAddress,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useUpdateAddressMutation = (
	options?: UseMutationOptions<
		UserAddress,
		ApiError,
		UpdateAddressVariables,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<UserAddress, ApiError, UpdateAddressVariables, unknown>({
		mutationFn: userService.updateAddress,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useDeleteAddressMutation = (
	options?: UseMutationOptions<void, ApiError, DeleteAddressInput, unknown>,
) => {
	const queryClient = useQueryClient();
	return useMutation<void, ApiError, DeleteAddressInput, unknown>({
		mutationFn: userService.deleteAddress,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useSetDefaultAddressMutation = (
	options?: UseMutationOptions<
		UserAddress,
		ApiError,
		SetDefaultAddressInput,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<UserAddress, ApiError, SetDefaultAddressInput, unknown>({
		mutationFn: userService.setDefaultAddress,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

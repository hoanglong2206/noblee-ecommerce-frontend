import { useEffect, useRef } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions,
	type UseMutationOptions,
} from "@tanstack/react-query";
import { type ApiError } from "@/features/api-client";
import { roleService } from "./service";
import {
	CreatePermissionInput,
	CreateRoleInput,
	Permission,
	Role,
	UpdatePermissionInput,
	UpdateRoleInput,
} from "./type";

export const roleQueryKeys = {
	base: ["roles"] as const,
	list: () => ["roles", "list"] as const,
	detail: (roleId: string) => ["roles", "detail", roleId] as const,
};

export const permissionQueryKeys = {
	base: ["permissions"] as const,
	list: () => ["permissions", "list"] as const,
	detail: (permissionId: string) =>
		["permissions", "detail", permissionId] as const,
};

type RoleListKey = ReturnType<typeof roleQueryKeys.list>;
type RoleDetailKey = ReturnType<typeof roleQueryKeys.detail>;
type PermissionListKey = ReturnType<typeof permissionQueryKeys.list>;
type PermissionDetailKey = ReturnType<typeof permissionQueryKeys.detail>;

type BaseQueryOptions<
	TQueryFnData,
	TError,
	TData,
	TQueryKey extends readonly unknown[],
> = Omit<
	UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
	"queryKey" | "queryFn"
>;

type QueryOptionsWithCallbacks<
	TQueryFnData,
	TError,
	TData,
	TQueryKey extends readonly unknown[],
> = BaseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
	onError?: (error: TError) => void;
};

const useErrorCallback = <TError>(
	error: TError | null,
	callback?: (error: TError) => void,
) => {
	const lastErrorRef = useRef<TError | null>(null);

	useEffect(() => {
		if (!callback) {
			lastErrorRef.current = error ?? null;
			return;
		}

		if (!error) {
			lastErrorRef.current = null;
			return;
		}

		if (lastErrorRef.current === error) {
			return;
		}

		lastErrorRef.current = error;
		callback(error);
	}, [callback, error]);
};

type RolesQueryOptions = QueryOptionsWithCallbacks<
	Role[],
	ApiError,
	Role[],
	RoleListKey
>;

type PermissionsQueryOptions = QueryOptionsWithCallbacks<
	Permission[],
	ApiError,
	Permission[],
	PermissionListKey
>;

export const useRolesQuery = (options?: RolesQueryOptions) => {
	const { onError: handleError, ...restOptions } = options ?? {};
	const queryOptions: BaseQueryOptions<Role[], ApiError, Role[], RoleListKey> =
		restOptions;
	const query = useQuery<Role[], ApiError, Role[], RoleListKey>({
		queryKey: roleQueryKeys.list(),
		queryFn: roleService.getRoles,
		...queryOptions,
	});
	const { error } = query;

	useErrorCallback(error, handleError);

	return query;
};

type RoleDetailOptions = QueryOptionsWithCallbacks<
	Role,
	ApiError,
	Role,
	RoleDetailKey
>;

type PermissionDetailOptions = QueryOptionsWithCallbacks<
	Permission,
	ApiError,
	Permission,
	PermissionDetailKey
>;

export const useRoleQuery = (roleId: string, options?: RoleDetailOptions) => {
	const { onError: handleError, enabled, ...restOptions } = options ?? {};
	const queryOptions: BaseQueryOptions<Role, ApiError, Role, RoleDetailKey> =
		restOptions;
	const query = useQuery<Role, ApiError, Role, RoleDetailKey>({
		queryKey: roleQueryKeys.detail(roleId),
		queryFn: () => roleService.getRole(roleId),
		...queryOptions,
		enabled: Boolean(roleId) && (enabled ?? true),
	});
	const { error } = query;

	useErrorCallback(error, handleError);

	return query;
};

export const usePermissionsQuery = (options?: PermissionsQueryOptions) => {
	const { onError: handleError, ...restOptions } = options ?? {};
	const queryOptions: BaseQueryOptions<
		Permission[],
		ApiError,
		Permission[],
		PermissionListKey
	> = restOptions;
	const query = useQuery<
		Permission[],
		ApiError,
		Permission[],
		PermissionListKey
	>({
		queryKey: permissionQueryKeys.list(),
		queryFn: roleService.getPermissions,
		...queryOptions,
	});
	const { error } = query;

	useErrorCallback(error, handleError);

	return query;
};

export const usePermissionQuery = (
	permissionId: string,
	options?: PermissionDetailOptions,
) => {
	const { onError: handleError, enabled, ...restOptions } = options ?? {};
	const queryOptions: BaseQueryOptions<
		Permission,
		ApiError,
		Permission,
		PermissionDetailKey
	> = restOptions;
	const query = useQuery<Permission, ApiError, Permission, PermissionDetailKey>(
		{
			queryKey: permissionQueryKeys.detail(permissionId),
			queryFn: () => roleService.getPermission(permissionId),
			...queryOptions,
			enabled: Boolean(permissionId) && (enabled ?? true),
		},
	);
	const { error } = query;

	useErrorCallback(error, handleError);

	return query;
};

export const useCreateRoleMutation = (
	options?: UseMutationOptions<Role, ApiError, CreateRoleInput, unknown>,
) => {
	const queryClient = useQueryClient();
	return useMutation<Role, ApiError, CreateRoleInput, unknown>({
		mutationFn: roleService.createRole,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: roleQueryKeys.list() });
			queryClient.setQueryData(roleQueryKeys.detail(data.id), data);
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useUpdateRoleMutation = (
	options?: UseMutationOptions<
		Role,
		ApiError,
		{ roleId: string; input: UpdateRoleInput },
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<
		Role,
		ApiError,
		{ roleId: string; input: UpdateRoleInput },
		unknown
	>({
		mutationFn: ({ roleId, input }) => roleService.updateRole(roleId, input),
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: roleQueryKeys.list() });
			queryClient.setQueryData(roleQueryKeys.detail(data.id), data);
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useDeleteRoleMutation = (
	options?: UseMutationOptions<void, ApiError, { roleId: string }, unknown>,
) => {
	const queryClient = useQueryClient();
	return useMutation<void, ApiError, { roleId: string }, unknown>({
		mutationFn: ({ roleId }) => roleService.deleteRole(roleId),
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: roleQueryKeys.list() });
			queryClient.removeQueries({
				queryKey: roleQueryKeys.detail(variables.roleId),
			});
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useCreatePermissionMutation = (
	options?: UseMutationOptions<
		Permission,
		ApiError,
		CreatePermissionInput,
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<Permission, ApiError, CreatePermissionInput, unknown>({
		mutationFn: roleService.createPermission,
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: permissionQueryKeys.list() });
			queryClient.setQueryData(permissionQueryKeys.detail(data.id), data);
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useUpdatePermissionMutation = (
	options?: UseMutationOptions<
		Permission,
		ApiError,
		{ permissionId: string; input: UpdatePermissionInput },
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<
		Permission,
		ApiError,
		{ permissionId: string; input: UpdatePermissionInput },
		unknown
	>({
		mutationFn: ({ permissionId, input }) =>
			roleService.updatePermission(permissionId, input),
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: permissionQueryKeys.list() });
			queryClient.setQueryData(permissionQueryKeys.detail(data.id), data);
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

export const useDeletePermissionMutation = (
	options?: UseMutationOptions<
		void,
		ApiError,
		{ permissionId: string },
		unknown
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation<void, ApiError, { permissionId: string }, unknown>({
		mutationFn: ({ permissionId }) =>
			roleService.deletePermission(permissionId),
		...options,
		onSuccess: (data, variables, context, mutation) => {
			queryClient.invalidateQueries({ queryKey: permissionQueryKeys.list() });
			queryClient.removeQueries({
				queryKey: permissionQueryKeys.detail(variables.permissionId),
			});
			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

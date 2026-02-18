import { apiClient, isApiError, type ApiError } from "@/features/api-client";
import { AxiosResponse, isAxiosError } from "axios";
import {
	CreatePermissionInput,
	CreateRoleInput,
	Permission,
	Role,
	UpdatePermissionInput,
	UpdateRoleInput,
} from "./type";

type ApiErrorPayload = {
	message?: string;
	errors?: Record<string, string[] | string>;
	statusCode?: number;
};

type RoleResponse = {
	role: Role;
	message?: string;
};

type RolesResponse = {
	roles: Role[];
};

type PermissionResponse = {
	permission: Permission;
	message?: string;
};

type PermissionsResponse = {
	permissions: Permission[];
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

const mapCreateRolePayload = (input: CreateRoleInput) => {
	const payload: Record<string, unknown> = {
		displayName: input.name,
	};
	if (input.description !== undefined) {
		payload.description = input.description;
	}
	if (input.isSystem !== undefined) {
		payload.isSystem = input.isSystem;
	}
	if (input.isActive !== undefined) {
		payload.isActive = input.isActive;
	}
	if (input.permissionIds !== undefined) {
		payload.permissionIds = input.permissionIds;
	}
	if (input.permissionNames !== undefined) {
		payload.permissionNames = input.permissionNames;
	}
	return payload;
};

const mapUpdateRolePayload = (input: UpdateRoleInput) => {
	const payload: Record<string, unknown> = {};
	if (input.name !== undefined) {
		payload.displayName = input.name;
	}
	if (input.description !== undefined) {
		payload.description = input.description;
	}
	if (input.isSystem !== undefined) {
		payload.isSystem = input.isSystem;
	}
	if (input.isActive !== undefined) {
		payload.isActive = input.isActive;
	}
	if (input.permissionIds !== undefined) {
		payload.permissionIds = input.permissionIds;
	}
	if (input.permissionNames !== undefined) {
		payload.permissionNames = input.permissionNames;
	}
	return payload;
};

const mapPermissionPayload = (
	input: CreatePermissionInput | UpdatePermissionInput,
): Record<string, unknown> => {
	const payload: Record<string, unknown> = {};
	if ("displayName" in input && input.displayName !== undefined) {
		payload.displayName = input.displayName;
	}
	if ("description" in input && input.description !== undefined) {
		payload.description = input.description;
	}
	if ("resource" in input && input.resource !== undefined) {
		payload.resource = input.resource;
	}
	if ("action" in input && input.action !== undefined) {
		payload.action = input.action;
	}
	if ("isActive" in input && input.isActive !== undefined) {
		payload.isActive = input.isActive;
	}
	return payload;
};

const getRoles = async (): Promise<Role[]> => {
	try {
		const response = await apiClient.get<RolesResponse>("/roles");
		const data = ensureResponse(response);
		return data.roles;
	} catch (error) {
		return throwApiError(error);
	}
};

const getRole = async (roleId: string): Promise<Role> => {
	try {
		const response = await apiClient.get<RoleResponse>(`/roles/${roleId}`);
		const data = ensureResponse(response);
		return data.role;
	} catch (error) {
		return throwApiError(error);
	}
};

const createRole = async (input: CreateRoleInput): Promise<Role> => {
	try {
		const response = await apiClient.post<RoleResponse>(
			"/roles",
			mapCreateRolePayload(input),
		);
		const data = ensureResponse(response);
		return data.role;
	} catch (error) {
		return throwApiError(error);
	}
};

const updateRole = async (
	roleId: string,
	input: UpdateRoleInput,
): Promise<Role> => {
	try {
		const response = await apiClient.patch<RoleResponse>(
			`/roles/${roleId}`,
			mapUpdateRolePayload(input),
		);
		const data = ensureResponse(response);
		return data.role;
	} catch (error) {
		return throwApiError(error);
	}
};

const deleteRole = async (roleId: string): Promise<void> => {
	try {
		await apiClient.delete(`/roles/${roleId}`);
	} catch (error) {
		return throwApiError(error);
	}
};

const getPermissions = async (): Promise<Permission[]> => {
	try {
		const response = await apiClient.get<PermissionsResponse>("/permissions");
		const data = ensureResponse(response);
		return data.permissions;
	} catch (error) {
		return throwApiError(error);
	}
};

const getPermission = async (permissionId: string): Promise<Permission> => {
	try {
		const response = await apiClient.get<PermissionResponse>(
			`/permissions/${permissionId}`,
		);
		const data = ensureResponse(response);
		return data.permission;
	} catch (error) {
		return throwApiError(error);
	}
};

const createPermission = async (
	input: CreatePermissionInput,
): Promise<Permission> => {
	try {
		const response = await apiClient.post<PermissionResponse>(
			"/permissions",
			mapPermissionPayload(input),
		);
		const data = ensureResponse(response);
		return data.permission;
	} catch (error) {
		return throwApiError(error);
	}
};

const updatePermission = async (
	permissionId: string,
	input: UpdatePermissionInput,
): Promise<Permission> => {
	try {
		const response = await apiClient.patch<PermissionResponse>(
			`/permissions/${permissionId}`,
			mapPermissionPayload(input),
		);
		const data = ensureResponse(response);
		return data.permission;
	} catch (error) {
		return throwApiError(error);
	}
};

const deletePermission = async (permissionId: string): Promise<void> => {
	try {
		await apiClient.delete(`/permissions/${permissionId}`);
	} catch (error) {
		return throwApiError(error);
	}
};

export const roleService = {
	getRoles,
	getRole,
	createRole,
	updateRole,
	deleteRole,
	getPermissions,
	getPermission,
	createPermission,
	updatePermission,
	deletePermission,
};

export const resources = [
	"user",
	"product",
	"order",
	"payment",
	"voucher",
	"category",
	"inventory",
	"report",
	"setting",
	"staff",
	"customer",
	"review",
	"audit_log",
] as const;

export const actions = [
	"manage",
	"create",
	"read",
	"update",
	"delete",
	"approve",
	"reject",
	"export",
	"import",
	"publish",
] as const;

export type Resource = (typeof resources)[number];
export type Action = (typeof actions)[number];
export type PermissionName = `${Resource}:${Action}`;

export type Permission = {
	id: string;
	displayName: string;
	description?: string | null;
	resource: Resource;
	action: Action;
	isActive: boolean;
	name: PermissionName;
	createdAt: string;
};

export type Role = {
	id: string;
	name: string;
	description?: string | null;
	permissions: PermissionName[];
	permissionDetails: Permission[];
	color?: string | null;
	userCount: number;
	isActive: boolean;
	isSystem: boolean;
	createdAt: string;
};

export type CreateRoleInput = {
	name: string;
	description?: string | null;
	isSystem?: boolean;
	isActive?: boolean;
	permissionIds?: string[];
	permissionNames?: PermissionName[];
};

export type UpdateRoleInput = {
	name?: string;
	description?: string | null;
	isSystem?: boolean;
	isActive?: boolean;
	permissionIds?: string[];
	permissionNames?: PermissionName[];
};

export type CreatePermissionInput = {
	displayName: string;
	description?: string | null;
	resource: Resource;
	action: Action;
	isActive?: boolean;
};

export type UpdatePermissionInput = {
	displayName?: string;
	description?: string | null;
	resource?: Resource;
	action?: Action;
	isActive?: boolean;
};

export type Attribute = {
	id: string;
	name: string;
	type: "user" | "resource" | "environment";
	dataType: "string" | "number" | "boolean" | "enum" | "ip_range";
	possibleValues?: string[];
	description: string;
	isSystem: boolean;
};

export type PolicyCondition = {
	attribute: string;
	operator:
		| "equals"
		| "not_equals"
		| "contains"
		| "greater_than"
		| "less_than"
		| "in"
		| "between";
	value: string;
};

export type Policy = {
	id: string;
	name: string;
	description: string;
	effect: "allow" | "deny";
	resource: string;
	action: string;
	priority: number;
	roles: string[];
	conditions: PolicyCondition[];
	isActive: boolean;
};

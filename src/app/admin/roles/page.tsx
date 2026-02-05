"use client";

import { useMemo, useState } from "react";

import { RoleListPanel, RolePermissionPanel } from "@/components/app/admin";
import { permissionsList, roleMapping } from "@/features/roles/data";
import {
	type Action,
	type DefaultRole,
	type PermissionName,
	type Resource,
	type RoleMapping as RoleMappingType,
} from "@/features/roles/type";

type RoleListItem = {
	id: string;
	name: string;
	isCustom: boolean;
};

type RolePermissionEntry = RoleMappingType[DefaultRole][number];

type ResourceActionsMap = Partial<Record<Resource, Action[]>>;

const buildResourceActionsMap = (
	permissions: typeof permissionsList,
): ResourceActionsMap => {
	const map: ResourceActionsMap = {};

	permissions.forEach((permission) => {
		if (!map[permission.resource]) {
			map[permission.resource] = [];
		}

		const actions = map[permission.resource]!;
		if (!actions.includes(permission.action)) {
			actions.push(permission.action);
		}
	});

	return map;
};

const cloneConditions = (
	conditions: RolePermissionEntry["conditions"],
): RolePermissionEntry["conditions"] | undefined => {
	if (!conditions) {
		return undefined;
	}

	const cloned: RolePermissionEntry["conditions"] = {};
	Object.entries(conditions).forEach(([key, value]) => {
		cloned[key] = Array.isArray(value) ? [...value] : value;
	});
	return cloned;
};

const createPermissionEntry = (
	permission: PermissionName,
	conditions?: RolePermissionEntry["conditions"],
): RolePermissionEntry => ({
	permission,
	...(conditions ? { conditions: cloneConditions(conditions) } : {}),
});

const clonePermissionEntry = (
	entry: RolePermissionEntry,
): RolePermissionEntry =>
	createPermissionEntry(entry.permission, entry.conditions);

const dedupePermissions = (
	permissions: RolePermissionEntry[],
): RolePermissionEntry[] => {
	const map = new Map<PermissionName, RolePermissionEntry>();
	permissions.forEach((entry) => {
		map.set(entry.permission, entry);
	});
	return Array.from(map.values());
};

const sortPermissions = (
	permissions: RolePermissionEntry[],
): RolePermissionEntry[] =>
	dedupePermissions(permissions).sort((a, b) =>
		a.permission.localeCompare(b.permission),
	);

const normalizePermissionsForState = (
	permissions: RolePermissionEntry[],
	resourceActions: ResourceActionsMap,
): RolePermissionEntry[] => {
	const expanded: RolePermissionEntry[] = [];

	permissions.forEach((entry) => {
		if (entry.permission === "*:*") {
			Object.entries(resourceActions).forEach(([resource, actions]) => {
				if (!actions || !actions.length) {
					return;
				}

				actions.forEach((action) => {
					expanded.push(
						createPermissionEntry(`${resource}:${action}` as PermissionName),
					);
				});
			});

			expanded.push(clonePermissionEntry(entry));
			return;
		}

		const [resource, action] = entry.permission.split(":");

		if (action === "*") {
			const actions = resourceActions[resource as Resource];
			if (actions && actions.length) {
				actions.forEach((itemAction) => {
					expanded.push(
						createPermissionEntry(
							`${resource}:${itemAction}` as PermissionName,
							entry.conditions,
						),
					);
				});
				return;
			}
		}

		expanded.push(clonePermissionEntry(entry));
	});

	return sortPermissions(expanded);
};

const buildInitialRoles = (): RoleListItem[] =>
	(Object.keys(roleMapping) as Array<DefaultRole>).map((role) => ({
		id: role,
		name: role.split("_").join(" "),
		isCustom: role !== "super_admin",
	}));

const buildInitialRolePermissions = (
	resourceActions: ResourceActionsMap,
): Record<string, RolePermissionEntry[]> => {
	const initial: Record<string, RolePermissionEntry[]> = {};

	(
		Object.entries(roleMapping) as Array<[DefaultRole, RolePermissionEntry[]]>
	).forEach(([role, permissions]) => {
		initial[role] = normalizePermissionsForState(
			permissions.map(clonePermissionEntry),
			resourceActions,
		);
	});

	return initial;
};

const generateUniqueRoleId = (baseId: string, existingIds: Set<string>) => {
	let counter = 1;
	let candidate = `${baseId}_copy`;

	while (existingIds.has(candidate)) {
		counter += 1;
		candidate = `${baseId}_copy${counter}`;
	}

	return candidate;
};

const formatCopyName = (name: string) =>
	`${name} copy`.replace(/\s+/g, " ").trim();

export default function RolesPage() {
	const resourceActionsMap = useMemo(
		() => buildResourceActionsMap(permissionsList),
		[],
	);

	const [roles, setRoles] = useState<RoleListItem[]>(() => buildInitialRoles());
	const [selectedRoleId, setSelectedRoleId] = useState<string>("super_admin");
	const [rolePermissionsByRole, setRolePermissionsByRole] = useState<
		Record<string, RolePermissionEntry[]>
	>(() => buildInitialRolePermissions(resourceActionsMap));

	const handleSelectRole = (roleId: string) => {
		setSelectedRoleId(roleId);
	};

	const handleDeleteRole = (roleId: string) => {
		setRoles((previous) => {
			const updated = previous.filter((role) => role.id !== roleId);
			if (selectedRoleId === roleId) {
				const fallbackRole = updated[0]?.id ?? "super_admin";
				setSelectedRoleId(fallbackRole);
			}
			return updated;
		});

		setRolePermissionsByRole((previous) => {
			if (!(roleId in previous)) {
				return previous;
			}

			const { [roleId]: _, ...rest } = previous;
			return rest;
		});
	};

	const handleDuplicateRole = (roleId: string) => {
		const existingIds = new Set(roles.map((role) => role.id));
		const newRoleId = generateUniqueRoleId(roleId, existingIds);
		const sourceRole = roles.find((role) => role.id === roleId);
		const newRoleName = formatCopyName(sourceRole?.name ?? roleId);

		setRoles((previous) => [
			...previous,
			{
				id: newRoleId,
				name: newRoleName,
				isCustom: true,
			},
		]);

		setRolePermissionsByRole((previous) => {
			const sourcePermissions = previous[roleId] ?? [];
			let clonedPermissions = sourcePermissions.map(clonePermissionEntry);

			const hasGlobalWildcard = clonedPermissions.some(
				(entry) => entry.permission === "*:*",
			);

			if (hasGlobalWildcard) {
				clonedPermissions = clonedPermissions.filter(
					(entry) => entry.permission !== "*:*",
				);
				clonedPermissions = normalizePermissionsForState(
					clonedPermissions,
					resourceActionsMap,
				);
			}

			return {
				...previous,
				[newRoleId]: sortPermissions(clonedPermissions),
			};
		});

		setSelectedRoleId(newRoleId);
	};

	const handleToggleAction = (
		roleId: string,
		resource: Resource,
		action: Action,
		checked: boolean,
	) => {
		const permissionName = `${resource}:${action}` as PermissionName;

		setRolePermissionsByRole((previous) => {
			const current = previous[roleId] ?? [];
			const withoutGlobal = current.filter(
				(entry) => entry.permission !== "*:*",
			);
			const hadGlobalWildcard = withoutGlobal.length !== current.length;
			const exists = withoutGlobal.some(
				(entry) => entry.permission === permissionName,
			);

			let updated = withoutGlobal;

			if (checked) {
				if (!exists) {
					updated = sortPermissions([
						...withoutGlobal,
						createPermissionEntry(permissionName),
					]);
				} else if (hadGlobalWildcard) {
					updated = sortPermissions(withoutGlobal);
				} else {
					return previous;
				}
			} else {
				if (exists) {
					updated = withoutGlobal.filter(
						(entry) => entry.permission !== permissionName,
					);
				} else if (hadGlobalWildcard) {
					updated = withoutGlobal;
				} else {
					return previous;
				}
			}

			return {
				...previous,
				[roleId]: updated,
			};
		});
	};

	const handleToggleResource = (
		roleId: string,
		resource: Resource,
		grantAll: boolean,
	) => {
		const actions = resourceActionsMap[resource] ?? [];
		if (!actions.length) {
			return;
		}

		const actionNames = actions.map(
			(action) => `${resource}:${action}` as PermissionName,
		);

		setRolePermissionsByRole((previous) => {
			const current = previous[roleId] ?? [];
			const withoutGlobal = current.filter(
				(entry) => entry.permission !== "*:*",
			);
			const hadGlobalWildcard = withoutGlobal.length !== current.length;
			const currentNames = new Set(
				withoutGlobal.map((entry) => entry.permission),
			);

			if (grantAll) {
				const additions = actionNames.filter((name) => !currentNames.has(name));

				if (!additions.length && !hadGlobalWildcard) {
					return previous;
				}

				const merged = sortPermissions([
					...withoutGlobal,
					...additions.map((name) => createPermissionEntry(name)),
				]);

				return {
					...previous,
					[roleId]: merged,
				};
			}

			const namesToRemove = new Set(actionNames);
			const filtered = withoutGlobal.filter(
				(entry) => !namesToRemove.has(entry.permission),
			);

			if (filtered.length === withoutGlobal.length && !hadGlobalWildcard) {
				return previous;
			}

			return {
				...previous,
				[roleId]: filtered,
			};
		});
	};

	const selectedRoleName = roles.find(
		(role) => role.id === selectedRoleId,
	)?.name;

	return (
		<div className="flex h-full flex-col gap-4 overflow-hidden bg-muted/50 p-6">
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				<div className="col-span-1">
					<RoleListPanel
						roles={roles}
						selectedRoleId={selectedRoleId}
						onSelectRole={handleSelectRole}
						onDeleteRole={handleDeleteRole}
						onDuplicateRole={handleDuplicateRole}
						permissionsByRole={rolePermissionsByRole}
						resourceActions={resourceActionsMap}
					/>
				</div>
				<div className="xl:col-span-2">
					<RolePermissionPanel
						roleId={selectedRoleId}
						roleName={selectedRoleName}
						permissionsByRole={rolePermissionsByRole}
						resourceActions={resourceActionsMap}
						onToggleAction={handleToggleAction}
						onToggleResource={handleToggleResource}
					/>
				</div>
			</div>
		</div>
	);
}

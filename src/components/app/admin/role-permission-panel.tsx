"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import {
	type Action,
	type DefaultRole,
	type Resource,
	type RoleMapping,
} from "@/features/roles/type";

type RolePermissionEntry = RoleMapping[DefaultRole][number];

type ResourceActionsMap = Partial<Record<Resource, Action[]>>;

type PermissionConditions = RolePermissionEntry["conditions"];

type AssignedAction = {
	action: Action;
	conditions?: PermissionConditions;
};

type RolePermissionPanelProps = {
	roleId: string;
	roleName?: string;
	permissionsByRole: Record<string, RolePermissionEntry[]>;
	resourceActions: ResourceActionsMap;
	onToggleAction: (
		roleId: string,
		resource: Resource,
		action: Action,
		checked: boolean,
	) => void;
	onToggleResource: (
		roleId: string,
		resource: Resource,
		grantAll: boolean,
	) => void;
};

type AssignedDetails = {
	assignedRecord: Partial<Record<Resource, AssignedAction[]>>;
	extras: RolePermissionEntry[];
	hasGlobalAccess: boolean;
	selectedCount: number;
};

const formatResourceLabel = (resource: string) =>
	resource
		.split("_")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");

const formatActionLabel = (action: string) =>
	action
		.split("_")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");

const formatPermissionLabel = (permission: string) => {
	if (permission === "*:*") {
		return "All resources";
	}

	const [resource, action] = permission.split(":");
	if (!resource || !action) {
		return permission;
	}

	if (action === "*") {
		return `${formatResourceLabel(resource)} • All actions`;
	}

	return `${formatResourceLabel(resource)} • ${formatActionLabel(action)}`;
};

const formatConditionValue = (
	value: string | number | boolean | Array<string | number | boolean>,
): string => {
	if (Array.isArray(value)) {
		return value.map((item) => formatConditionValue(item)).join(", ");
	}

	if (typeof value === "boolean") {
		return value ? "true" : "false";
	}

	return String(value);
};

const formatConditions = (conditions: PermissionConditions): string => {
	if (!conditions) {
		return "";
	}

	return Object.entries(conditions)
		.map(([key, value]) => `${key}: ${formatConditionValue(value)}`)
		.join(" • ");
};

const buildAssignedDetails = (
	permissions: RolePermissionEntry[],
	resourceActions: ResourceActionsMap,
): AssignedDetails => {
	const assignedRecord: Partial<Record<Resource, AssignedAction[]>> = {};
	const extras: RolePermissionEntry[] = [];
	let hasGlobalAccess = false;
	let selectedCount = 0;

	const knownResources = new Set(
		Object.keys(resourceActions) as Array<Resource>,
	);
	const actionConditions = new Map<
		Resource,
		Map<Action, PermissionConditions>
	>();
	const fullAccessResources = new Map<Resource, PermissionConditions>();

	permissions.forEach((entry) => {
		if (entry.permission === "*:*") {
			hasGlobalAccess = true;
			extras.push(entry);
			return;
		}

		const [resource, action] = entry.permission.split(":");
		if (!resource || !action) {
			return;
		}

		if (action === "*") {
			if (knownResources.has(resource as Resource)) {
				fullAccessResources.set(resource as Resource, entry.conditions);
			} else {
				extras.push(entry);
			}
			return;
		}

		if (!knownResources.has(resource as Resource)) {
			extras.push(entry);
			return;
		}

		if (!actionConditions.has(resource as Resource)) {
			actionConditions.set(
				resource as Resource,
				new Map<Action, PermissionConditions>(),
			);
		}

		actionConditions
			.get(resource as Resource)!
			.set(action as Action, entry.conditions);
	});

	if (hasGlobalAccess) {
		Object.entries(resourceActions).forEach(([resource, actions]) => {
			if (!actions || !actions.length) {
				return;
			}

			const sortedActions = actions
				.slice()
				.sort((a, b) => a.localeCompare(b)) as Action[];
			assignedRecord[resource as Resource] = sortedActions.map((item) => ({
				action: item,
			}));
			selectedCount += sortedActions.length;
		});

		return {
			assignedRecord,
			extras,
			hasGlobalAccess,
			selectedCount,
		};
	}

	fullAccessResources.forEach((conditions, resource) => {
		const actions = resourceActions[resource];
		if (!actions || !actions.length) {
			return;
		}

		const sortedActions = actions
			.slice()
			.sort((a, b) => a.localeCompare(b)) as Action[];
		assignedRecord[resource] = sortedActions.map((item) => ({
			action: item,
			conditions,
		}));
		selectedCount += sortedActions.length;
	});

	actionConditions.forEach((map, resource) => {
		if (assignedRecord[resource]) {
			return;
		}

		const sortedActions = Array.from(map.entries()).sort((a, b) =>
			a[0].localeCompare(b[0]),
		) as Array<[Action, PermissionConditions]>;
		assignedRecord[resource] = sortedActions.map(([action, conditions]) => ({
			action,
			conditions,
		}));
		selectedCount += sortedActions.length;
	});

	return {
		assignedRecord,
		extras,
		hasGlobalAccess,
		selectedCount,
	};
};

type PermissionAllProps = {
	roleId: string;
	resources: Resource[];
	resourceActions: ResourceActionsMap;
	assignedRecord: Partial<Record<Resource, AssignedAction[]>>;
	disableEditing: boolean;
	showDetails: boolean;
	onToggleAction: (
		resource: Resource,
		action: Action,
		checked: boolean,
	) => void;
	onToggleResource: (resource: Resource, grantAll: boolean) => void;
};

const PermissionAll = ({
	roleId,
	resources,
	resourceActions,
	assignedRecord,
	disableEditing,
	showDetails,
	onToggleAction,
	onToggleResource,
}: PermissionAllProps) => {
	if (!resources.length) {
		return (
			<div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
				No resources match the current filters.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{resources.map((resource) => {
				const actions = resourceActions[resource] ?? [];
				const selectedActions = assignedRecord[resource] ?? [];
				const totalCount = actions.length;
				const selectedCount = selectedActions.length;
				const isFullAccess = totalCount > 0 && selectedCount === totalCount;
				const isPartialAccess = selectedCount > 0 && !isFullAccess;

				const statusBadge = (() => {
					if (totalCount === 0) {
						return null;
					}

					if (isFullAccess) {
						return { label: "All actions", variant: "default" as const };
					}

					if (isPartialAccess) {
						return {
							label: `${selectedCount}/${totalCount} selected`,
							variant: "secondary" as const,
						};
					}

					return { label: "No actions", variant: "outline" as const };
				})();

				return (
					<div
						key={`${roleId}-${resource}`}
						className="space-y-4 rounded-lg border p-4"
					>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<span className="font-semibold capitalize">
									{formatResourceLabel(resource)}
								</span>
								{statusBadge && (
									<Badge variant={statusBadge.variant}>
										{statusBadge.label}
									</Badge>
								)}
							</div>
							<Button
								variant="ghost"
								size="sm"
								disabled={disableEditing || totalCount === 0}
								onClick={() => onToggleResource(resource, !isFullAccess)}
							>
								{isFullAccess ? "Revoke all" : "Grant all"}
							</Button>
						</div>

						{totalCount === 0 ? (
							<p className="text-sm text-muted-foreground">
								No actions defined for this resource yet.
							</p>
						) : (
							showDetails && (
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
									{actions.map((action) => {
										const actionEntry = selectedActions.find(
											(item) => item.action === action,
										);
										const isChecked = Boolean(actionEntry);
										return (
											<label
												key={`${resource}-${action}`}
												className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60"
											>
												<Checkbox
													checked={isChecked}
													disabled={disableEditing}
													onCheckedChange={(checked) =>
														onToggleAction(resource, action, Boolean(checked))
													}
												/>
												<div className="flex items-center gap-2">
													<span className="capitalize">
														{formatActionLabel(action)}
													</span>
													{actionEntry?.conditions ? (
														<Badge variant="outline" className="text-xs">
															Condition
														</Badge>
													) : null}
												</div>
											</label>
										);
									})}
								</div>
							)
						)}
					</div>
				);
			})}
		</div>
	);
};

type PermissionSelectedProps = {
	assignedRecord: Partial<Record<Resource, AssignedAction[]>>;
	extras: RolePermissionEntry[];
	visibleResources: Resource[];
	isFilteringActive: boolean;
};

const PermissionSelected = ({
	assignedRecord,
	extras,
	visibleResources,
	isFilteringActive,
}: PermissionSelectedProps) => {
	const visibleSet = useMemo(
		() => new Set<Resource>(visibleResources),
		[visibleResources],
	);

	const resourceEntries = useMemo(() => {
		const entries = Object.entries(assignedRecord).filter(([resource]) => {
			if (!isFilteringActive) {
				return true;
			}
			return visibleSet.has(resource as Resource);
		});
		return entries.sort(([a], [b]) => a.localeCompare(b));
	}, [assignedRecord, isFilteringActive, visibleSet]);

	const filteredExtras = useMemo(() => {
		if (!isFilteringActive) {
			return extras;
		}
		return extras.filter((entry) => {
			if (entry.permission === "*:*") {
				return false;
			}
			const [resource] = entry.permission.split(":");
			if (!resource) {
				return false;
			}
			return visibleSet.has(resource as Resource);
		});
	}, [extras, isFilteringActive, visibleSet]);

	if (!resourceEntries.length && !filteredExtras.length) {
		return (
			<div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
				No permissions selected yet.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{resourceEntries.map(([resource, actions]) => (
				<div key={resource} className="space-y-2">
					<div className="font-semibold capitalize">
						{formatResourceLabel(resource)}
					</div>
					<div className="flex flex-wrap gap-2">
						{(actions ?? []).map(({ action, conditions }) => (
							<Badge key={`${resource}-${action}`} variant="secondary">
								{formatActionLabel(action)}
								{conditions ? " *" : ""}
							</Badge>
						))}
					</div>
				</div>
			))}

			{filteredExtras.length > 0 && (
				<div className="space-y-2">
					<div className="font-semibold">Other permissions</div>
					<div className="flex flex-wrap gap-2">
						{filteredExtras.map((entry) => (
							<Badge key={entry.permission} variant="outline">
								{formatPermissionLabel(entry.permission)}
								{entry.conditions ? " *" : ""}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export const RolePermissionPanel = ({
	roleId,
	roleName,
	permissionsByRole,
	resourceActions,
	onToggleAction,
	onToggleResource,
}: RolePermissionPanelProps) => {
	const [selectedResource, setSelectedResource] = useState<Resource | "all">(
		"all",
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [showDetails, setShowDetails] = useState(true);

	const { assignedRecord, extras, hasGlobalAccess, selectedCount } =
		useMemo(() => {
			const resolvedPermissions = permissionsByRole[roleId] ?? [];
			return buildAssignedDetails(resolvedPermissions, resourceActions);
		}, [permissionsByRole, roleId, resourceActions]);

	const allResources = useMemo(
		() =>
			(Object.keys(resourceActions) as Array<Resource>).sort((a, b) =>
				a.localeCompare(b),
			),
		[resourceActions],
	);

	const normalizedSearch = searchTerm.trim().toLowerCase();

	const dropdownResources = useMemo(() => {
		if (selectedResource === "all") {
			return allResources;
		}

		if (allResources.includes(selectedResource)) {
			return [selectedResource];
		}

		return allResources;
	}, [allResources, selectedResource]);

	const filteredResources = useMemo(() => {
		if (!normalizedSearch) {
			return dropdownResources;
		}

		return dropdownResources.filter((resource) => {
			const resourceLabel = formatResourceLabel(resource).toLowerCase();
			if (resourceLabel.includes(normalizedSearch)) {
				return true;
			}

			const actions = resourceActions[resource] ?? [];
			return actions.some((action) =>
				formatActionLabel(action).toLowerCase().includes(normalizedSearch),
			);
		});
	}, [dropdownResources, normalizedSearch, resourceActions]);

	const isFilteringActive =
		selectedResource !== "all" || normalizedSearch.length > 0;

	const disableEditing = roleId === "super_admin";
	const showGlobalNotice = hasGlobalAccess;
	const displayRoleName = roleName
		? roleName
		: roleId
				.split("_")
				.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
				.join(" ");

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Permissions for {displayRoleName}</CardTitle>
						<CardDescription>
							{selectedCount} actions selected across {allResources.length}{" "}
							resources
						</CardDescription>
						{disableEditing ? (
							<p className="mt-2 text-xs text-muted-foreground">
								System roles retain global access and cannot be edited here.
							</p>
						) : showGlobalNotice ? (
							<p className="mt-2 text-xs text-muted-foreground">
								This role includes global permissions. Toggle any action to
								convert its access into granular entries.
							</p>
						) : null}
					</div>
					<Button>
						<Save className=" h-4 w-4" />
						Save Permissions
					</Button>
				</div>
			</CardHeader>
			<CardContent className="max-h-[calc(100vh-220px)] overflow-y-auto">
				<Tabs defaultValue="all" className="w-full">
					<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<TabsList>
							<TabsTrigger value="all">Permissions</TabsTrigger>
							<TabsTrigger value="selected">Selected</TabsTrigger>
						</TabsList>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="relative w-full sm:w-62.5">
								<Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
								<Input
									placeholder="Search permissions..."
									className="w-full pl-10"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
								/>
							</div>
							<Select
								value={selectedResource}
								onValueChange={(value) =>
									setSelectedResource(value as Resource | "all")
								}
							>
								<SelectTrigger className="w-full sm:w-50">
									<SelectValue placeholder="Select resource" />
								</SelectTrigger>
								<SelectContent side="bottom" align="start" position="popper">
									<SelectItem value="all">All Resources</SelectItem>
									{allResources.map((resource) => (
										<SelectItem
											key={resource}
											value={resource}
											className="capitalize"
										>
											{formatResourceLabel(resource)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowDetails((prev) => !prev)}
							>
								{showDetails ? (
									<>
										<EyeOff className="h-4 w-4" />
									</>
								) : (
									<>
										<Eye className="h-4 w-4" />
									</>
								)}
							</Button>
						</div>
					</div>

					<TabsContent value="all" className="space-y-6">
						<PermissionAll
							roleId={roleId}
							resources={filteredResources}
							resourceActions={resourceActions}
							assignedRecord={assignedRecord}
							disableEditing={disableEditing}
							showDetails={showDetails}
							onToggleAction={(resource, action, checked) =>
								onToggleAction(roleId, resource, action, checked)
							}
							onToggleResource={(resource, grantAll) =>
								onToggleResource(roleId, resource, grantAll)
							}
						/>
					</TabsContent>

					<TabsContent value="selected">
						<PermissionSelected
							assignedRecord={assignedRecord}
							extras={extras}
							visibleResources={filteredResources}
							isFilteringActive={isFilteringActive}
						/>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

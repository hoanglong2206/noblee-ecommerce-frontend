"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Shield, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { stringToColor } from "@/lib/utils";
import {
	type Action,
	type DefaultRole,
	type Resource,
	type RoleMapping,
} from "@/features/roles/type";

type RolePermissionEntry = RoleMapping[DefaultRole][number];

type ResourceActionsMap = Partial<Record<Resource, Action[]>>;

type RoleListItem = {
	id: string;
	name: string;
	isCustom: boolean;
};

type RoleListPanelProps = {
	roles: RoleListItem[];
	selectedRoleId: string;
	onSelectRole: (roleId: string) => void;
	onDeleteRole: (roleId: string) => void;
	onDuplicateRole: (roleId: string) => void;
	permissionsByRole: Record<string, RolePermissionEntry[]>;
	resourceActions: ResourceActionsMap;
};

const formatResourceLabel = (resource: string) => resource.split("_").join(" ");

const sortBadgeLabels = (labels: string[]) =>
	labels.slice().sort((a, b) => {
		if (a === "__all__") return -1;
		if (b === "__all__") return 1;
		return a.localeCompare(b);
	});

const computeFullAccessResources = (
	permissions: RolePermissionEntry[],
	resourceActions: ResourceActionsMap,
) => {
	if (!permissions.length) {
		return [] as string[];
	}

	if (permissions.some((entry) => entry.permission === "*:*")) {
		return ["__all__"];
	}

	const labels = new Set<string>();
	const actionTotals = new Map<string, number>();

	Object.entries(resourceActions).forEach(([resource, actions]) => {
		if (actions && actions.length) {
			actionTotals.set(resource, actions.length);
		}
	});

	const selections = new Map<string, Set<string>>();

	permissions.forEach((entry) => {
		const [resource, action] = entry.permission.split(":");
		if (!resource || !action) {
			return;
		}

		if (action === "*") {
			labels.add(resource);
			return;
		}

		if (!actionTotals.has(resource)) {
			return;
		}

		if (!selections.has(resource)) {
			selections.set(resource, new Set());
		}

		selections.get(resource)!.add(action);
	});

	selections.forEach((actions, resource) => {
		const expected = actionTotals.get(resource);
		if (expected && actions.size === expected) {
			labels.add(resource);
		}
	});

	return Array.from(labels);
};

export const RoleListPanel = ({
	roles,
	selectedRoleId,
	onSelectRole,
	onDeleteRole,
	onDuplicateRole,
	permissionsByRole,
	resourceActions,
}: RoleListPanelProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredRoles = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		if (!normalizedSearch) {
			return roles;
		}

		return roles.filter(
			(role) =>
				role.name.toLowerCase().includes(normalizedSearch) ||
				role.id.toLowerCase().includes(normalizedSearch),
		);
	}, [roles, searchTerm]);

	const renderBadges = (roleId: string) => {
		const fullAccessResources = sortBadgeLabels(
			computeFullAccessResources(
				permissionsByRole[roleId] ?? [],
				resourceActions,
			),
		);

		if (!fullAccessResources.length) {
			return null;
		}

		const renderBadge = (resourceKey: string) => (
			<Badge key={resourceKey} variant="secondary">
				{resourceKey === "__all__"
					? "All resources"
					: formatResourceLabel(resourceKey)}
			</Badge>
		);

		if (fullAccessResources.length <= 3) {
			return (
				<>
					{fullAccessResources.map((resourceKey) => renderBadge(resourceKey))}
				</>
			);
		}

		const primaryResources = fullAccessResources.slice(0, 2);
		const remainingCount = fullAccessResources.length - primaryResources.length;

		return (
			<>
				{primaryResources.map((resourceKey) => renderBadge(resourceKey))}
				<Badge key="extra-count" variant="outline">
					+{remainingCount}
				</Badge>
			</>
		);
	};

	return (
		<Card className="bg-background">
			<CardHeader className="space-y-4">
				<CardTitle>Roles</CardTitle>
				<div className="flex items-center justify-between gap-4">
					<Input
						type="text"
						placeholder="Search roles..."
						className="max-w-xs"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
					<Button size="icon" variant="outline">
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 max-h-screen overflow-y-auto">
					{filteredRoles.length === 0 ? (
						<div className="py-6 text-center text-sm text-muted-foreground">
							No roles found.
						</div>
					) : (
						filteredRoles.map((role) => (
							<div
								key={role.id}
								className={`p-3 rounded-lg border transition-colors ${
									selectedRoleId === role.id
										? "bg-primary/10 border-primary"
										: "hover:bg-muted/50"
								}`}
								onClick={() => onSelectRole(role.id)}
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										onSelectRole(role.id);
									}
								}}
							>
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-2 w-full">
										<div
											className="w-10 h-10 rounded-lg flex items-center justify-center"
											style={{ backgroundColor: stringToColor(role.name) }}
										>
											<Shield className="h-5 w-5 text-background" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<div className="flex items-center capitalize gap-2 font-medium">
													{role.name}
													{role.id === "super_admin" && (
														<Badge variant="destructive">System</Badge>
													)}
												</div>
												{role.isCustom && (
													<div className="flex gap-1">
														<Button
															size="icon-sm"
															variant="ghost"
															className="text-green-500 hover:text-green-600"
															onClick={(event) => {
																event.stopPropagation();
																onDuplicateRole(role.id);
															}}
														>
															<Copy className="h-4 w-4" />
														</Button>
														<Button
															size="icon-sm"
															variant="ghost"
															className="text-red-500 hover:text-red-600"
															onClick={(event) => {
																event.stopPropagation();
																onDeleteRole(role.id);
															}}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												)}
											</div>
											<div className="flex items-center gap-2 mt-1">
												{role.id === "super_admin" ? (
													<Badge variant="secondary">All permissions</Badge>
												) : (
													renderBadges(role.id)
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};

"use client";

import { AdminHeader } from "@/components/app/admin";
import {
	Plus,
	Shield,
	Users,
	CheckCircle2,
	MoreHorizontal,
	Search,
	Pencil,
	Trash2,
	Key,
	SquarePen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	actions,
	resources,
	type Action,
	type Permission,
	type Resource,
	type Role,
} from "@/features/roles/type";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
	DeleteConfirmModal,
	PermissionFormModal,
	RoleFormModal,
} from "@/components/app/modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useCreatePermissionMutation,
	useCreateRoleMutation,
	useDeletePermissionMutation,
	useDeleteRoleMutation,
	usePermissionsQuery,
	useRolesQuery,
	useUpdatePermissionMutation,
	useUpdateRoleMutation,
} from "@/features/roles/query";
import { isApiError } from "@/features/api-client";
import { useToastStore } from "@/store/useToastStore";
import type { RoleFormValues } from "@/components/app/modal/role-modal";
import type { PermissionFormValues } from "@/components/app/modal/permission-modal";

export default function RolesPage() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const [selectedResource, setSelectedResource] = useState<string>("all");
	const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
	const [permissionModalOpen, setPermissionModalOpen] =
		useState<boolean>(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [editingPermission, setEditingPermission] = useState<Permission | null>(
		null,
	);
	const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
	const [deleteTarget, setDeleteTarget] = useState<{
		type: "role" | "permission";
		id: string;
		name: string;
	} | null>(null);
	const [switchTargetId, setSwitchTargetId] = useState<string | null>(null);

	const { addToast } = useToastStore();

	const { data: rolesData, isLoading: isRolesLoading } = useRolesQuery({
		onError: (error) => {
			const message = error.message ?? "Failed to load roles.";
			addToast(message, "error");
		},
	});

	const { data: permissionsData, isLoading: isPermissionsLoading } =
		usePermissionsQuery({
			onError: (error) => {
				const message = error.message ?? "Failed to load permissions.";
				addToast(message, "error");
			},
		});

	const rolesList = useMemo(() => rolesData ?? [], [rolesData]);
	const permissionsList = useMemo(
		() => permissionsData ?? [],
		[permissionsData],
	);

	useEffect(() => {
		if (!rolesList.length) {
			setSelectedRoleId(null);
			return;
		}
		if (
			!selectedRoleId ||
			!rolesList.some((role) => role.id === selectedRoleId)
		) {
			setSelectedRoleId(rolesList[0].id);
		}
	}, [rolesList, selectedRoleId]);

	const selectedRole = useMemo(
		() =>
			selectedRoleId
				? (rolesList.find((role) => role.id === selectedRoleId) ?? null)
				: null,
		[rolesList, selectedRoleId],
	);

	const resolveRoleColor = useCallback(
		(role: Role) => role.color ?? "hsl(217, 90%, 60%)",
		[],
	);

	const filteredRoles = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) {
			return rolesList;
		}
		return rolesList.filter((role) => role.name.toLowerCase().includes(term));
	}, [rolesList, searchTerm]);

	const filteredPermissions = useMemo(() => {
		if (selectedResource === "all") {
			return permissionsList;
		}
		return permissionsList.filter(
			(permission) => permission.resource === selectedResource,
		);
	}, [permissionsList, selectedResource]);

	const selectedRoleColor = selectedRole
		? resolveRoleColor(selectedRole)
		: undefined;

	const hasPermission = useCallback(
		(role: Role, resource: string, action: string) =>
			role.permissionDetails.some(
				(perm) => perm.resource === resource && perm.action === action,
			),
		[],
	);

	const createRoleMutation = useCreateRoleMutation();
	const updateRoleMutation = useUpdateRoleMutation();
	const toggleRoleMutation = useUpdateRoleMutation();
	const deleteRoleMutation = useDeleteRoleMutation();

	const createPermissionMutation = useCreatePermissionMutation();
	const updatePermissionMutation = useUpdatePermissionMutation();
	const deletePermissionMutation = useDeletePermissionMutation();

	const isRoleFormSubmitting =
		roleModalOpen &&
		(editingRole ? updateRoleMutation.isPending : createRoleMutation.isPending);

	const isPermissionFormSubmitting =
		permissionModalOpen &&
		(editingPermission
			? updatePermissionMutation.isPending
			: createPermissionMutation.isPending);

	const handleRoleModalChange = (open: boolean) => {
		setRoleModalOpen(open);
		if (!open) {
			setEditingRole(null);
		}
	};

	const handlePermissionModalChange = (open: boolean) => {
		setPermissionModalOpen(open);
		if (!open) {
			setEditingPermission(null);
		}
	};

	const handleRoleSubmit = async (values: RoleFormValues) => {
		const payload = {
			name: values.name.trim(),
			description: values.description?.trim()
				? values.description.trim()
				: undefined,
			permissionIds: values.permissions,
		};
		try {
			if (editingRole) {
				await updateRoleMutation.mutateAsync({
					roleId: editingRole.id,
					input: payload,
				});
				addToast(`Role "${editingRole.name}" updated.`);
			} else {
				const role = await createRoleMutation.mutateAsync(payload);
				addToast(`Role "${role.name}" created.`);
				setSelectedRoleId(role.id);
			}
		} catch (error) {
			const message = isApiError(error)
				? error.message
				: "Failed to save role.";
			addToast(message, "error");
			throw error;
		}
	};

	const handlePermissionSubmit = async (values: PermissionFormValues) => {
		const payload = {
			displayName: values.name.trim(),
			description: values.description?.trim()
				? values.description.trim()
				: undefined,
			resource: values.resource as Resource,
			action: values.action as Action,
		};
		try {
			if (editingPermission) {
				await updatePermissionMutation.mutateAsync({
					permissionId: editingPermission.id,
					input: payload,
				});
				addToast(`Permission "${values.name}" updated.`);
			} else {
				await createPermissionMutation.mutateAsync({
					...payload,
					isActive: true,
				});
				addToast(`Permission "${values.name}" created.`);
			}
		} catch (error) {
			const message = isApiError(error)
				? error.message
				: "Failed to save permission.";
			addToast(message, "error");
			throw error;
		}
	};

	const handleToggleRole = async (role: Role, next: boolean) => {
		setSwitchTargetId(role.id);
		try {
			await toggleRoleMutation.mutateAsync({
				roleId: role.id,
				input: { isActive: next },
			});
			addToast(`Role "${role.name}" ${next ? "activated" : "deactivated"}.`);
		} catch (error) {
			const message = isApiError(error)
				? error.message
				: "Failed to update role state.";
			addToast(message, "error");
		} finally {
			setSwitchTargetId(null);
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) {
			return;
		}
		try {
			if (deleteTarget.type === "role") {
				await deleteRoleMutation.mutateAsync({ roleId: deleteTarget.id });
				addToast(`Role "${deleteTarget.name}" deleted.`);
				if (selectedRoleId === deleteTarget.id) {
					setSelectedRoleId(null);
				}
			} else {
				await deletePermissionMutation.mutateAsync({
					permissionId: deleteTarget.id,
				});
				addToast(`Permission "${deleteTarget.name}" deleted.`);
			}
		} catch (error) {
			const message = isApiError(error)
				? error.message
				: `Failed to delete ${deleteTarget.type}.`;
			addToast(message, "error");
		} finally {
			setDeleteOpen(false);
			setDeleteTarget(null);
		}
	};

	const openCreateRole = () => {
		setEditingRole(null);
		setRoleModalOpen(true);
	};

	const openEditRole = (role: Role) => {
		setEditingRole(role);
		setRoleModalOpen(true);
	};

	const openCreatePermission = () => {
		setEditingPermission(null);
		setPermissionModalOpen(true);
	};

	const openEditPermission = (permission: Permission) => {
		setEditingPermission(permission);
		setPermissionModalOpen(true);
	};

	const openDeletePermission = (permission: Permission) => {
		setDeleteTarget({
			type: "permission",
			id: permission.id,
			name: permission.displayName,
		});
		setDeleteOpen(true);
	};

	return (
		<div className="flex h-full flex-col gap-4 bg-muted/50 p-6 overflow-auto">
			<AdminHeader
				title="Roles & Permissions"
				description="Manage role-based access control (RBAC). Assign permissions to roles, then roles to users."
				badge="RBAC"
			/>

			<div className="rounded-xl p-5 border border-l-3 border-l-primary flex gap-3">
				<Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
				<div>
					<p className="text-sm font-semibold text-foreground mb-1">
						Role-Based Access Control (RBAC)
					</p>
					<p className="text-xs text-muted-foreground leading-relaxed">
						RBAC assigns permissions to{" "}
						<strong className="text-foreground">roles</strong>, and roles to
						users. A user inherits all permissions from their assigned roles.
						This provides a structured, easy-to-audit access model. Combined
						with ABAC policies, it enables fine-grained control.
					</p>
				</div>
			</div>
			{/* Permissions Registry */}
			<div className="rounded-xl p-5 border border-border bg-linear-to-br from-background to-background/50">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-semibold text-foreground">
						Permissions Registry
					</h3>
					<div className="flex items-center gap-2">
						{/* Select Resource + All */}
						<Select
							value={selectedResource}
							onValueChange={setSelectedResource}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Select a resource" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="all">All Resources</SelectItem>
								{resources.map((resource) => (
									<SelectItem key={resource} value={resource}>
										{resource.charAt(0).toUpperCase() + resource.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button onClick={openCreatePermission} size="sm" variant="outline">
							<Plus className="h-3 w-3 mr-1" /> Add Permission
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2 max-h-[15vh] overflow-y-auto">
					{isPermissionsLoading ? (
						Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className="h-16 rounded-lg" />
						))
					) : filteredPermissions.length ? (
						filteredPermissions.map((perm) => (
							<PermissionCard
								key={perm.id}
								perm={perm}
								isAction={true}
								openEditPermission={openEditPermission}
								openDeletePermission={openDeletePermission}
							/>
						))
					) : (
						<p className="text-xs text-muted-foreground py-2 text-center">
							No permissions found for this resource.
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
				{/* Roles List */}
				<div className="lg:col-span-1 flex flex-col space-y-4 border rounded-xl p-5 bg-background">
					<div className="flex items-center justify-between gap-2">
						<div className="relative flex-1 max-w-xs">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search roles..."
								className="pl-9 bg-muted/50"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Button size="icon" variant="outline" onClick={openCreateRole}>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex-1 space-y-2 overflow-y-auto max-h-[60vh]">
						{isRolesLoading ? (
							Array.from({ length: 6 }).map((_, index) => (
								<Skeleton key={index} className="h-24 rounded-xl" />
							))
						) : filteredRoles.length ? (
							filteredRoles.map((role) => {
								const color = resolveRoleColor(role);
								return (
									<div
										key={role.id}
										onClick={() => setSelectedRoleId(role.id)}
										className={cn(
											"p-4 cursor-pointer bg-card/80 backdrop-blur-xl select-none border border-border/50 rounded-xl hover:border-primary/30 transition-all hover:shadow-blue-400/30 shadow-sm",
											selectedRole?.id === role.id && "border-primary/50",
										)}
									>
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3 flex-1">
												<div
													className="h-10 w-10 rounded-lg flex items-center justify-center"
													style={{ backgroundColor: `${color}20` }}
												>
													<Shield className="h-5 w-5" style={{ color }} />
												</div>
												<div>
													<h3 className="font-semibold">{role.name}</h3>
													<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
														{role.description ?? "No description"}
													</p>
												</div>
											</div>
											<DropdownMenu>
												<DropdownMenuTrigger
													asChild
													onClick={(e) => e.stopPropagation()}
												>
													<Button
														variant="ghost"
														size="icon-xs"
														className="focus-visible:ring-0"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															openEditRole(role);
														}}
													>
														<Pencil className="h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															setDeleteTarget({
																type: "role",
																id: role.id,
																name: role.name,
															});
															setDeleteOpen(true);
														}}
														className="text-destructive"
													>
														<Trash2 className="h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
											<div className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												{role.userCount} users
											</div>
											<div className="flex items-center gap-1">
												<CheckCircle2 className="h-3 w-3" />
												{role.permissionDetails.length} permissions
											</div>
										</div>
									</div>
								);
							})
						) : (
							<p className="text-xs text-muted-foreground py-4 text-center">
								No roles match the current search.
							</p>
						)}
					</div>
				</div>

				{/* Permissions Matrix */}
				<div className="lg:col-span-3">
					{selectedRole ? (
						<div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl p-6 h-full flex flex-col">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div
										className="h-12 w-12 rounded-lg flex items-center justify-center"
										style={{ backgroundColor: `${selectedRoleColor}20` }}
									>
										<Shield
											className="h-6 w-6"
											style={{ color: selectedRoleColor }}
										/>
									</div>
									<div>
										<h2 className="text-xl font-semibold">
											{selectedRole.name}
										</h2>
										<p className="text-sm text-muted-foreground">
											{selectedRole.description ?? "No description"}
										</p>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<Button
										variant="outline"
										size="icon-sm"
										onClick={() => openEditRole(selectedRole)}
									>
										<SquarePen className="h-4 w-4" />
									</Button>
									<Switch
										checked={selectedRole.isActive}
										onCheckedChange={(checked) =>
											handleToggleRole(selectedRole, checked)
										}
										disabled={switchTargetId === selectedRole.id}
										aria-label={`Toggle ${selectedRole.name} status`}
									/>
								</div>
							</div>
							<Tabs defaultValue="resourceAccessMatrix" className="space-y-2">
								<TabsList className="bg-secondary/50">
									<TabsTrigger value="resourceAccessMatrix">
										<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
											Resource Access Matrix
										</h3>
									</TabsTrigger>
									<TabsTrigger value="assignedPermissions">
										<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
											Assigned Permissions
										</h3>
									</TabsTrigger>
								</TabsList>
								<TabsContent
									value="resourceAccessMatrix"
									className="overflow-y-auto flex-1"
								>
									<div className="overflow-auto max-h-[48vh]">
										<table className="w-full min-w-max table-auto">
											<thead className="sticky top-0 bg-background z-10">
												<tr className="border-b border-border">
													<th className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left py-3">
														Resource
													</th>
													{actions.map((action) => (
														<th
															key={action}
															className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center py-3"
														>
															{action}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{resources.map((resource) => (
													<tr
														key={resource}
														className="border-b border-border/50 hover:bg-muted/20"
													>
														<td className="py-3 font-medium capitalize">
															{resource}
														</td>
														{actions.map((action) => (
															<td key={action} className="py-3 text-center">
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger asChild>
																			<div className="inline-flex items-center justify-center">
																				{hasPermission(
																					selectedRole,
																					resource,
																					action,
																				) ? (
																					<div className="h-6 w-6 rounded-full bg-green-300/80 flex items-center justify-center">
																						<CheckCircle2 className="h-4 w-4 text-green-600" />
																					</div>
																				) : (
																					<div className="h-6 w-6 rounded-full bg-muted/30 flex items-center justify-center">
																						<span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
																					</div>
																				)}
																			</div>
																		</TooltipTrigger>
																		<TooltipContent sideOffset={5}>
																			{hasPermission(
																				selectedRole,
																				resource,
																				action,
																			)
																				? `Can ${action} ${resource}`
																				: `No ${action} permission for ${resource}`}
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</TabsContent>
								<TabsContent
									value="assignedPermissions"
									className="overflow-y-auto flex-1 max-h-[48vh]"
								>
									{selectedRole
										? (() => {
												const groupedPermissions =
													selectedRole.permissionDetails.reduce(
														(groups: { [key: string]: Permission[] }, perm) => {
															if (!groups[perm.resource]) {
																groups[perm.resource] = [];
															}
															groups[perm.resource].push(perm);
															return groups;
														},
														{},
													);

												const sortedResources =
													Object.keys(groupedPermissions).sort(); // Sort alphabet để đẹp

												if (sortedResources.length === 0) {
													return (
														<p className="text-sm text-muted-foreground text-center py-4">
															No permissions assigned to this role.
														</p>
													);
												}

												return sortedResources.map((resource) => (
													<div key={resource}>
														<h4 className="text-sm font-semibold text-foreground mb-2 capitalize">
															{resource}
														</h4>
														<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
															{groupedPermissions[resource]
																.sort((a, b) =>
																	a.action.localeCompare(b.action),
																) // Sort actions alphabet
																.map((perm) => (
																	<PermissionCard
																		key={perm.id}
																		perm={perm}
																		isAction={false}
																	/>
																))}
														</div>
													</div>
												));
											})()
										: null}
								</TabsContent>
							</Tabs>
						</div>
					) : (
						<div className="glass-card p-12 text-center animate-fade-in">
							<Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">Select a Role</h3>
							<p className="text-sm text-muted-foreground">
								Choose a role from the list to view its permissions
							</p>
						</div>
					)}
				</div>
			</div>

			<PermissionFormModal
				key={editingPermission?.id ?? "new-permission"}
				open={permissionModalOpen}
				onOpenChange={handlePermissionModalChange}
				editPermission={editingPermission}
				onSubmit={handlePermissionSubmit}
				isSubmitting={isPermissionFormSubmitting}
			/>
			<RoleFormModal
				key={editingRole?.id ?? "new-role"}
				open={roleModalOpen}
				onOpenChange={handleRoleModalChange}
				editRole={editingRole}
				permissions={permissionsList}
				isSubmitting={isRoleFormSubmitting}
				isLoadingPermissions={isPermissionsLoading}
				onSubmit={handleRoleSubmit}
			/>
			<DeleteConfirmModal
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);
					if (!open) {
						setDeleteTarget(null);
					}
				}}
				title={deleteTarget ? `Delete ${deleteTarget.type}` : "Delete item"}
				description={
					deleteTarget
						? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
						: "Select an item to delete."
				}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}

const PermissionCard = ({
	perm,
	isAction,
	openDeletePermission,
	openEditPermission,
}: {
	perm: Permission;
	isAction: boolean;
	openDeletePermission?: (perm: Permission) => void;
	openEditPermission?: (perm: Permission) => void;
}) => {
	return (
		<div
			key={perm.id}
			className="flex items-center gap-3 rounded-lg bg-secondary/40 p-3 group select-none"
		>
			<div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
				<span className="text-xs font-mono font-semibold text-primary uppercase">
					{perm.action.slice(0, 3)}
				</span>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-foreground truncate">
					{perm.displayName}
				</p>
				<p className="text-xs font-mono text-muted-foreground truncate">
					{perm.resource} → {perm.action}
				</p>
			</div>
			{isAction && (
				<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<Button
						size="icon"
						variant="ghost"
						className="h-6 w-6"
						onClick={() => {
							if (openEditPermission) {
								openEditPermission(perm);
							}
						}}
					>
						<Pencil className="h-3 w-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-6 w-6"
						onClick={() => {
							if (openDeletePermission) {
								openDeletePermission(perm);
							}
						}}
					>
						<Trash2 className="h-3 w-3 text-destructive" />
					</Button>
				</div>
			)}
		</div>
	);
};

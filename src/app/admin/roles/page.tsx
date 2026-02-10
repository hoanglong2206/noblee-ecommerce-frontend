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
import { useMemo, useState } from "react";
import { actions, resources, Role } from "@/features/roles/type";
import { roles, permissions } from "@/features/roles/data";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmModal, RoleFormModal } from "@/components/app/modal";

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasPermission = (role: Role, resource: string, action: string) => {
    const perm = permissions.find(
      (p) => p.resource === resource && p.action === action,
    );
    return perm ? role.permissions.includes(perm.id) : false;
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleModalOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden bg-muted/50 p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Roles List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 border rounded-xl p-5 bg-background overflow-hidden">
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
          <div className="flex-1 space-y-2 overflow-y-auto">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "p-4 cursor-pointer bg-card/80 backdrop-blur-xl select-none border border-border/50 rounded-xl hover:border-primary/30 transition-all hover:shadow-blue-400/30 shadow-sm",
                  selectedRole?.id === role.id && "border-primary/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Shield
                        className="h-5 w-5"
                        style={{ color: role.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{role.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {role.description}
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
                          handleDeleteClick(role);
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
                    {role.permissions.length} permissions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3 overflow-y-auto">
          {selectedRole ? (
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedRole.color}20` }}
                  >
                    <Shield
                      className="h-6 w-6"
                      style={{ color: selectedRole.color }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedRole.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedRole.description}
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
                  <Switch checked={selectedRole.isActive} />
                </div>
              </div>

              <div className="mb-6 overflow-y-auto flex-1">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Permissions Matrix
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
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
              </div>
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

      <RoleFormModal
        key={editingRole?.id ?? "new-role"}
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        editRole={editingRole}
      />
      <DeleteConfirmModal
        open={!!roleToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setRoleToDelete(null);
          }
        }}
        title="Delete Role"
        description={`Are you sure you want to delete "${roleToDelete?.name}"? This will remove the role from all assigned users.`}
        onConfirm={() => {
          setRoleToDelete(null);
        }}
      />
    </div>
  );
}

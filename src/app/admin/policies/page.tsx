"use client";
import { AdminHeader } from "@/components/app/admin";
import {
  Plus,
  Search,
  FileKey,
  MoreHorizontal,
  SquarePen,
  Trash2,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSSProperties, useMemo, useState } from "react";
import { Policy } from "@/features/roles/type";
import { cn, getOperatorDisplay } from "@/lib/utils";
import { policies, roles } from "@/features/roles/data";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmModal, PolicyFormModal } from "@/components/app/modal";

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const [policyDelete, setPolicyDelete] = useState<Policy | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState<boolean>(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [policies, searchTerm]);

  const openCreatePolicy = () => {
    setEditingPolicy(null);
    setPolicyModalOpen(true);
  };

  const openEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setPolicyModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden bg-muted/50 p-6">
      <AdminHeader
        title="Authorization Policies"
        description="Manage attribute-based access control (ABAC) policies that add contextual rules on top of RBAC."
        badge="ABAC"
      />

      <div className="rounded-xl p-5 border border-l-3 border-l-primary flex gap-3">
        <FileKey className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Attribute-Based Access Control (ABAC)
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            ABAC policies evaluate{" "}
            <strong className="text-foreground">attributes</strong> (user,
            resource, environment) to make access decisions. Policies can
            enforce conditions like "only users with clearance ≥ 3 can read
            confidential docs" or "API access only during business hours."
            Policies are evaluated by priority — higher priority wins.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Policies List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 border rounded-xl p-5 bg-background overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                className="pl-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="icon" variant="outline" onClick={openCreatePolicy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className={cn(
                  "p-4 cursor-pointer bg-card/80 backdrop-blur-xl select-none border border-border/50 rounded-xl hover:border-primary/30 transition-all hover:shadow-blue-400/30 shadow-sm",
                  selectedPolicy?.id === policy.id && "border-primary/50",
                  !policy.isActive && "opacity-50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        policy.effect === "allow" && "bg-green-500/20",
                        policy.effect === "deny" && "bg-red-500/20",
                      )}
                    >
                      {policy.effect === "allow" ? (
                        <CircleCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <CircleX className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{policy.name}</h3>
                      </div>
                      <div className="flex items-center justify-between gap-2 ">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            policy.effect === "allow"
                              ? "border-green-500/30 text-green-500"
                              : "border-destructive/30 text-destructive",
                          )}
                        >
                          {policy.effect.toUpperCase()}
                        </Badge>
                      </div>
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
                          openEditPolicy(policy);
                        }}
                      >
                        <SquarePen className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setPolicyDelete(policy);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies Details */}
        <div className="lg:col-span-3 overflow-y-auto">
          {selectedPolicy ? (
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl gap-6 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center",
                      selectedPolicy.effect === "allow"
                        ? "bg-success/10"
                        : "bg-destructive/10",
                    )}
                  >
                    <FileKey
                      className={cn(
                        "h-6 w-6",
                        selectedPolicy.effect === "allow"
                          ? "text-success"
                          : "text-destructive",
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {selectedPolicy.name}
                      </h2>
                      {!selectedPolicy.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedPolicy.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="outline"
                    size={"icon"}
                    onClick={() => openEditPolicy(selectedPolicy)}
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  <Switch checked={selectedPolicy.isActive} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Effect
                  </span>

                  <div className="mt-1 -ml-1 select-none">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm",
                        selectedPolicy.effect === "allow"
                          ? "border-green-500/30 text-green-500"
                          : "border-destructive/30 text-destructive",
                      )}
                    >
                      {selectedPolicy.effect.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Resource
                  </span>
                  <p className="text-lg font-semibold mt-1 font-mono">
                    {selectedPolicy.resource}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Action
                  </span>
                  <p className="text-lg font-semibold mt-1 font-mono">
                    {selectedPolicy.action}
                  </p>
                </div>
              </div>

              <div className="">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Applicable Roles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/50">
                    {selectedPolicy.roles.map((role, index) => {
                      const policyRole = roles.find((r) => r.id === role);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 flex-wrap select-none"
                        >
                          <Badge
                            variant="outline"
                            className="font-mono text-xs border-(--role-color)/50 text-(--role-color)"
                            style={
                              {
                                "--role-color": policyRole?.color,
                              } as CSSProperties
                            }
                          >
                            {policyRole?.name}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Conditions
                </h3>
                <div className="space-y-3">
                  {selectedPolicy.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/50 select-none"
                    >
                      <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted/50 rounded">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">
                          {condition.attribute}
                        </Badge>
                        <span className="text-lg font-semibold text-primary">
                          {getOperatorDisplay(condition.operator)}
                        </span>
                        <Badge className="font-mono text-xs bg-primary/20 text-primary border-0">
                          {Array.isArray(condition.value)
                            ? condition.value.join(", ")
                            : String(condition.value)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center animate-fade-in">
              <FileKey className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Policy</h3>
              <p className="text-sm text-muted-foreground">
                Choose a policy from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
      <PolicyFormModal
        key={editingPolicy?.id ?? "new-policy"}
        open={policyModalOpen}
        onOpenChange={setPolicyModalOpen}
        editPolicy={editingPolicy}
      />
      <DeleteConfirmModal
        open={!!policyDelete}
        onOpenChange={(open) => !open && setPolicyDelete(null)}
        title="Delete Policy"
        description={`Are you sure you want to delete "${policyDelete?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          setPolicyDelete(null);
        }}
      />
    </div>
  );
}

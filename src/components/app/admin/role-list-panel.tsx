"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Shield, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { roleMapping } from "@/features/roles/data";
import { stringToColor } from "@/lib/utils";

export const RoleListPanel = () => {
  const [selectedRole, setSelectedRole] = useState<string>("super_admin");
  const [roles, setRoles] = useState<
    Array<{
      id: string;
      name: string;
      isCustom: boolean;
    }>
  >([]);

  useEffect(() => {
    Object.keys(roleMapping).forEach((role) => {
      const name = role.split("_").join(" ");
      if (role === "super_admin") {
        setRoles((prev) => [
          ...prev,
          { id: role, name: name, isCustom: false },
        ]);
      } else {
        setRoles((prev) => [...prev, { id: role, name: name, isCustom: true }]);
      }
    });
  }, []);

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
    if (selectedRole === roleId) {
      setSelectedRole("super_admin");
    }
  };

  // Duplicate role
  const handleDuplicateRole = (role: {
    id: string;
    name: string;
    isCustom: boolean;
  }) => {
    const newRole = {
      id: `${role.id}_copy`,
      name: `${role.name}_copy`,
      isCustom: true,
    };
    setRoles((prev) => [...prev, newRole]);
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
          />
          <Button size={"icon"} variant={"outline"}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-screen overflow-y-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`p-3 rounded-lg border transition-colors ${
                selectedRole === role.id
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stringToColor(role.name) }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2 capitalize">
                      {role.name}
                      {role.id === "super_admin" && (
                        <Badge variant="destructive">System</Badge>
                      )}
                    </div>
                    <div>
                      {role.id === "super_admin" ? (
                        <Badge variant="secondary">All permissions</Badge>
                      ) : (
                        roleMapping[role.id as keyof typeof roleMapping]
                          ?.slice(0, 3)
                          .map((permission) => (
                            <Badge
                              key={permission.permission}
                              variant="secondary"
                            >
                              {permission.permission}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>
                </div>
                {role.isCustom && (
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-green-500 hover:text-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateRole(role);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

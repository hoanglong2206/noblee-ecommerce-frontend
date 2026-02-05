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
import { useState } from "react";
import { Resource } from "@/features/roles/type";
import { permissionsList } from "@/features/roles/data";

export const RolePermissionPanel = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | "all">(
    "all",
  );

  const allResources = Array.from(
    new Set(permissionsList.map((p) => p.resource)),
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Permissions for</CardTitle>
            <CardDescription>
              Select permissions to assign to this role
            </CardDescription>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Permissions</TabsTrigger>
              <TabsTrigger value="selected">Selected</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-10 w-[250px]"
                />
              </div>
              <Select
                value={selectedResource}
                onValueChange={(value: Resource | "all") =>
                  setSelectedResource(value)
                }
              >
                <SelectTrigger className="w-full sm:w-[200px]">
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
                      {resource.split("_").join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Details
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-6">
            <PermissionAll />
          </TabsContent>

          <TabsContent value="selected">
            <PermissionSelected />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PermissionAll = () => {
  return <div>s</div>;
};

const PermissionSelected = () => {
  return <div>s</div>;
};

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  actions,
  Policy,
  PolicyCondition,
  resources,
} from "@/features/roles/type";
import { attributes, roles } from "@/features/roles/data";
import { getOperatorDisplay } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CSSProperties } from "react";

const OPERATORS = [
  "equals",
  "not_equals",
  "contains",
  "greater_than",
  "less_than",
  "in",
  "between",
] as const;
const RESOURCES = ["*", ...resources];
const ACTIONS = ["*", ...actions];

const conditionSchema = z.object({
  attribute: z.string().min(1, "Required"),
  operator: z.enum(OPERATORS),
  value: z.string().min(1, "Required"),
});

const policySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  description: z.string().trim().min(1, "Description is required").max(200),
  effect: z.enum(["allow", "deny"]),
  resource: z.string().min(1, "Resource is required"),
  action: z.string().min(1, "Action is required"),
  priority: z.number().min(1).max(100),
  isActive: z.boolean(),
  roles: z.array(z.string()),
  conditions: z.array(conditionSchema),
});

type PolicyFormValues = z.infer<typeof policySchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPolicy?: Policy | null;
};

export function PolicyFormModal({ open, onOpenChange, editPolicy }: Props) {
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: editPolicy
      ? {
          name: editPolicy.name,
          description: editPolicy.description,
          effect: editPolicy.effect,
          resource: editPolicy.resource,
          action: editPolicy.action,
          priority: editPolicy.priority,
          isActive: editPolicy.isActive,
          roles: editPolicy.roles,
          conditions: editPolicy.conditions.map((c) => ({
            attribute: c.attribute,
            operator: c.operator,
            value: c.value,
          })),
        }
      : {
          name: "",
          description: "",
          effect: "allow" as const,
          resource: "*",
          action: "*",
          priority: 50,
          isActive: true,
          roles: [],
          conditions: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conditions",
  });

  const selectedRoles = form.watch("roles");

  const onSubmit = (values: PolicyFormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      effect: values.effect,
      resource: values.resource,
      action: values.action,
      priority: values.priority,
      isActive: values.isActive,
      roles: values.roles,
      conditions: values.conditions.map((c) => ({
        attribute: c.attribute,
        operator: c.operator as PolicyCondition["operator"],
        value: c.value,
      })),
    };

    console.log(payload);

    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editPolicy ? "Edit Policy" : "Create Policy"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pol-name">Name</Label>
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive/80 italic font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <Input
                id="pol-name"
                placeholder="e.g. Restrict API Access"
                {...form.register("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pol-priority">Priority (1-100)</Label>
              <Input
                id="pol-priority"
                type="number"
                min={1}
                max={100}
                {...form.register("priority", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pol-desc">Description</Label>
              {form.formState.errors.description && (
                <p className="text-xs text-destructive/80 italic font-medium">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <Input
              id="pol-desc"
              placeholder="What this policy enforces..."
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Effect</Label>
              <Select
                value={form.watch("effect")}
                onValueChange={(v) =>
                  form.setValue("effect", v as "allow" | "deny")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resource</Label>
              <Select
                value={form.watch("resource")}
                onValueChange={(v) => form.setValue("resource", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {RESOURCES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === "*"
                        ? "* (All)"
                        : r
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={form.watch("action")}
                onValueChange={(v) => form.setValue("action", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a === "*"
                        ? "* (All)"
                        : a
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(v) => form.setValue("isActive", v)}
            />
            <Label>Active</Label>
          </div>

          {/* Applicable Roles */}
          <div className="space-y-2">
            <Label>
              Applicable Roles{" "}
              <span className="text-muted-foreground text-[10px]">
                (empty = all roles)
              </span>
            </Label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-border p-3 bg-secondary/30">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("roles");
                      form.setValue(
                        "roles",
                        checked
                          ? [...current, role.id]
                          : current.filter((id) => id !== role.id),
                      );
                    }}
                    className="size-4.5 cursor-pointer rounded-md border-(--role-color)/50 data-[state=checked]:border-(--role-color) data-[state=checked]:bg-(--role-color)/80"
                    style={
                      {
                        "--role-color": role.color,
                      } as CSSProperties
                    }
                  />
                  <Badge
                    variant="outline"
                    className="font-mono text-xs border-(--role-color)/50 text-(--role-color)"
                    style={
                      {
                        "--role-color": role.color,
                      } as CSSProperties
                    }
                  >
                    {role.name}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Conditions</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  append({ attribute: "", operator: "equals", value: "" })
                }
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No conditions — policy always applies to matched roles.
              </p>
            )}
            <div className="space-y-2 overflow-y-auto max-h-27">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-center p-1.5 rounded-lg bg-secondary/30 border border-border"
                >
                  <Select
                    value={form.watch(`conditions.${index}.attribute`)}
                    onValueChange={(v) =>
                      form.setValue(`conditions.${index}.attribute`, v)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-1/3">
                      <SelectValue placeholder="Attribute" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {attributes.map((a) => (
                        <SelectItem key={a.id} value={a.name}>
                          {a.name
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={form.watch(`conditions.${index}.operator`)}
                    onValueChange={(v) =>
                      form.setValue(
                        `conditions.${index}.operator`,
                        v as (typeof OPERATORS)[number],
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-1/3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {OPERATORS.map((op) => (
                        <SelectItem key={op} value={op}>
                          {op
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}{" "}
                          ({getOperatorDisplay(op)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="w-1/3">
                    <Input
                      className="h-8 text-xs"
                      placeholder="Value"
                      {...form.register(`conditions.${index}.value`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editPolicy ? "Update" : "Create"} Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

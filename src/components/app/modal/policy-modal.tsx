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

const OPERATORS = [
  "equals",
  "not_equals",
  "contains",
  "greater_than",
  "less_than",
  "in",
  "between",
] as const;
const RESOURCES = [
  "*",
  "documents",
  "users",
  "analytics",
  "billing",
  "api",
  "audit",
  "settings",
  "data",
];
const ACTIONS = ["*", "read", "write", "delete", "manage", "access", "export"];

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
  enabled: z.boolean(),
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
  const { roles, attributes, addPolicy, updatePolicy } = useAuthStore();

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
          enabled: editPolicy.enabled,
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
          enabled: true,
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
      enabled: values.enabled,
      roles: values.roles,
      conditions: values.conditions.map((c) => ({
        attribute: c.attribute,
        operator: c.operator as PolicyCondition["operator"],
        value: c.value,
      })),
    };
    if (editPolicy) {
      updatePolicy(editPolicy.id, payload);
    } else {
      addPolicy(payload);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editPolicy ? "Edit Policy" : "Create Policy"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pol-name">Name</Label>
              <Input
                id="pol-name"
                placeholder="e.g. Restrict API Access"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
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
            <Label htmlFor="pol-desc">Description</Label>
            <Input
              id="pol-desc"
              placeholder="What this policy enforces..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === "*" ? "* (All)" : r}
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a === "*" ? "* (All)" : a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.watch("enabled")}
              onCheckedChange={(v) => form.setValue("enabled", v)}
            />
            <Label>Enabled</Label>
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
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-xs text-foreground">{role.name}</span>
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
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-start p-2 rounded-lg bg-secondary/30 border border-border"
                >
                  <div className="flex-1 space-y-1">
                    <Select
                      value={form.watch(`conditions.${index}.attribute`)}
                      onValueChange={(v) =>
                        form.setValue(`conditions.${index}.attribute`, v)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributes.map((a) => (
                          <SelectItem key={a.id} value={a.name}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Select
                      value={form.watch(`conditions.${index}.operator`)}
                      onValueChange={(v) =>
                        form.setValue(
                          `conditions.${index}.operator`,
                          v as (typeof OPERATORS)[number],
                        )
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
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
              onClick={() => onOpenChange(false)}
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

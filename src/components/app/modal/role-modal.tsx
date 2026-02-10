import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/features/roles/type";
import { permissions } from "@/features/roles/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CSSProperties } from "react";

const roleSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  description: z.string().trim().min(1, "Description is required").max(200),
  permissions: z.array(z.string()),
  color: z.string().min(1, "Color is required"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRole?: Role | null;
};

export function RoleFormModal({ open, onOpenChange, editRole }: Props) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: editRole
      ? {
          name: editRole.name,
          description: editRole.description,
          color: editRole.color,
          permissions: editRole.permissions,
        }
      : { name: "", description: "", color: "", permissions: [] },
  });

  const onSubmit = (values: RoleFormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      color: values.color,
      permissions: values.permissions,
    };

    console.log(payload);
    onOpenChange(false);
    form.reset();
  };

  const selectedPerms = form.watch("permissions");
  const selectedColor = form.watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editRole ? "Edit Role" : "Create Role"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Name</Label>
              {form.formState.errors.name && (
                <p className="text-xs text-destructive/80 italic font-medium">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <Input
              id="name"
              placeholder="e.g. Moderator"
              {...form.register("name")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              {form.formState.errors.description && (
                <p className="text-xs text-destructive/80 italic font-medium">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <Input
              id="description"
              placeholder="What this role does..."
              {...form.register("description")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Color</Label>
              {form.formState.errors.color && (
                <p className="text-xs text-destructive/80 italic font-medium">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <ColorPicker
                value={selectedColor}
                onChange={(value) => form.setValue("color", value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border border-border p-3 bg-secondary/30">
              {permissions.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedPerms.includes(perm.id)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("permissions");
                      form.setValue(
                        "permissions",
                        checked
                          ? [...current, perm.id]
                          : current.filter((id) => id !== perm.id),
                      );
                    }}
                  />
                  <span className="text-xs text-foreground">
                    {perm.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                    {perm.resource}:{perm.action}
                  </span>
                </label>
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
            <Button type="submit">{editRole ? "Update" : "Create"} Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const colorList: {
  label: string;
  value: string;
}[] = [
  { label: "Red", value: "hsl(0, 91%, 71%)" }, // #f87171
  { label: "Orange", value: "hsl(31, 96%, 72%)" }, // #fdba74
  { label: "Yellow", value: "hsl(53, 96%, 65%)" }, // #fce94f
  { label: "Blue", value: "hsl(199, 94%, 74%)" }, // #7dd3fc
  { label: "Gray", value: "hsl(218, 11%, 65%)" }, // #9ca3af
  { label: "Purple", value: "hsl(270, 95%, 75%)" }, // #c084fc
  { label: "Fuchsia", value: "hsl(292, 89%, 73%)" }, // #e879f9
  { label: "Pink", value: "hsl(0, 91%, 82%)" }, // #fca5a5
  { label: "Green", value: "hsl(164, 55%, 73%)" }, // #94e2cd
  { label: "Teal", value: "hsl(172, 66%, 50%)" }, // #2dd4bf
  { label: "Indigo", value: "hsl(234, 89%, 74%)" }, // #818cf8
  { label: "Sky", value: "hsl(198, 93%, 60%)" }, // #38bdf8
  { label: "Lime", value: "hsl(83, 78%, 55%)" }, // #a3e635
  { label: "Amber", value: "hsl(43, 96%, 56%)" }, // #fbbf24
  { label: "Rose", value: "hsl(351, 95%, 71%)" }, // #fb7185
];
interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ value = "", onChange }: ColorPickerProps) => {
  return (
    <RadioGroup
      className="flex flex-wrap gap-1.5"
      value={value}
      onValueChange={onChange}
    >
      {colorList.map((color) => (
        <Tooltip key={color.value}>
          <TooltipTrigger asChild>
            <div>
              <RadioGroupItem
                value={color.value}
                id={color.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={color.value}
                className="flex w-8 h-8 items-center justify-center rounded-full
								border-2 border-muted cursor-pointer
                transition-colors duration-200 ease-in-out
								hover:ring-2 hover:ring-(--checked-color)/80
								peer-data-[state=checked]:ring-2
								peer-data-[state=checked]:ring-(--checked-color)"
                style={
                  {
                    backgroundColor: color.value,
                    "--checked-color": color.value,
                  } as CSSProperties
                }
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={5}
            style={{
              borderColor: color.value,
            }}
            className="bg-background select-none"
          >
            <p
              style={{
                color: color.value,
              }}
            >
              {color.label}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </RadioGroup>
  );
};

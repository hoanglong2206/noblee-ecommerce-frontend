import { useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { actions, type Permission, resources } from "@/features/roles/type";

const permissionSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(80),
	description: z.string().trim().min(1, "Description is required").max(200),
	resource: z.string().min(1, "Resource is required"),
	action: z.string().min(1, "Action is required"),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editPermission?: Permission | null;
	isSubmitting?: boolean;
	onSubmit: (values: PermissionFormValues) => Promise<void>;
};

export function PermissionFormModal({
	open,
	onOpenChange,
	editPermission,
	isSubmitting,
	onSubmit,
}: Props) {
	const form = useForm<PermissionFormValues>({
		resolver: zodResolver(permissionSchema),
		defaultValues: {
			name: "",
			description: "",
			resource: "",
			action: "",
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset({
				name: "",
				description: "",
				resource: "",
				action: "",
			});
			return;
		}
		if (editPermission) {
			form.reset({
				name: editPermission.displayName,
				description: editPermission.description ?? "",
				resource: editPermission.resource,
				action: editPermission.action,
			});
		} else {
			form.reset({
				name: "",
				description: "",
				resource: "",
				action: "",
			});
		}
	}, [open, editPermission, form]);

	const handleSubmit = async (values: PermissionFormValues) => {
		try {
			await onSubmit(values);
			onOpenChange(false);
		} catch (error) {
			return;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md bg-card border-border">
				<DialogHeader>
					<DialogTitle className="text-foreground">
						{editPermission ? "Edit Permission" : "Create Permission"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="perm-name">Name</Label>
							{form.formState.errors.name && (
								<p className="text-xs text-destructive/80 italic font-medium">
									{form.formState.errors.name.message}
								</p>
							)}
						</div>
						<Input
							id="perm-name"
							placeholder="e.g. Read Invoices"
							{...form.register("name")}
							disabled={isSubmitting}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="perm-desc">Description</Label>
							{form.formState.errors.description && (
								<p className="text-xs text-destructive/80 italic font-medium">
									{form.formState.errors.description.message}
								</p>
							)}
						</div>
						<Input
							id="perm-desc"
							placeholder="What this permission grants..."
							{...form.register("description")}
							disabled={isSubmitting}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label>Resource</Label>
								{form.formState.errors.resource && (
									<p className="text-xs text-destructive/80 italic font-medium">
										{form.formState.errors.resource.message}
									</p>
								)}
							</div>
							<Select
								value={form.watch("resource")}
								onValueChange={(v) => form.setValue("resource", v)}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select..." />
								</SelectTrigger>
								<SelectContent position="popper">
									{resources.map((r) => (
										<SelectItem key={r} value={r}>
											{r
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
							<div className="flex items-center justify-between">
								<Label>Action</Label>
								{form.formState.errors.action && (
									<p className="text-xs text-destructive/80 italic font-medium">
										{form.formState.errors.action.message}
									</p>
								)}
							</div>
							<Select
								value={form.watch("action")}
								onValueChange={(v) => form.setValue("action", v)}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select..." />
								</SelectTrigger>
								<SelectContent position="popper">
									{actions.map((a) => (
										<SelectItem key={a} value={a}>
											{a
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

					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => {
								onOpenChange(false);
							}}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Saving...
								</>
							) : editPermission ? (
								"Update Permission"
							) : (
								"Create Permission"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

import { RoleListPanel, RolePermissionPanel } from "@/components/app/admin";

export default function RolesPage() {
	return (
		<div className="flex flex-col gap-4 p-6 overflow-hidden bg-muted/50 h-full">
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
				<div className="col-span-1">
					<RoleListPanel />
				</div>
				<div className="xl:col-span-2">
					<RolePermissionPanel />
				</div>
			</div>
		</div>
	);
}

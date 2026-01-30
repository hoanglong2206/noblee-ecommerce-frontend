export default function RolesPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Roles</h1>
				<p className="text-muted-foreground">
					Define admin roles, permissions, and audit responsibilities.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Build role assignment and access control tooling here.
			</div>
		</section>
	);
}

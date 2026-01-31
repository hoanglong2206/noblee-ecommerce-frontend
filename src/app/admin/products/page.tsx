export default function ProductsPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Products</h1>
				<p className="text-muted-foreground">
					Oversee inventory, pricing, and channel availability.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Add filters, tables, and product quick actions here.
			</div>
		</section>
	);
}

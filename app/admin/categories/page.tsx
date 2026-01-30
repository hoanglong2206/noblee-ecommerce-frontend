export default function CategoriesPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Categories</h1>
				<p className="text-muted-foreground">
					Organize product categories, collections, and navigation labels.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Hook up category creation and sorting tools here.
			</div>
		</section>
	);
}

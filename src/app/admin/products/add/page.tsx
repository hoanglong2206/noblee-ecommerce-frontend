export default function ProductAddPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Add Product</h1>
				<p className="text-muted-foreground">
					Configure product details, media, and fulfillment settings.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Connect product creation forms and validation flows here.
			</div>
		</section>
	);
}

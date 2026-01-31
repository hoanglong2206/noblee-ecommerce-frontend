export default function ProductReviewsPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Product Reviews</h1>
				<p className="text-muted-foreground">
					Moderate customer feedback and highlight actionable insights.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Integrate review moderation queues and sentiment charts here.
			</div>
		</section>
	);
}

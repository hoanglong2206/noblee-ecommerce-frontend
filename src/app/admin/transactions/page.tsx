export default function TransactionsPage() {
	return (
		<section className="flex flex-col gap-4 p-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Transactions</h1>
				<p className="text-muted-foreground">
					Monitor payouts, settlements, and financial reconciliation.
				</p>
			</header>
			<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
				Display transaction summaries and detailed ledgers here.
			</div>
		</section>
	);
}

"use client";

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

import {
	StatsHeader,
	StatsHeaderProps,
	CustomerTable,
} from "@/components/app/admin";
import { Button } from "@/components/ui/button";
import { customersData } from "@/lib/data";

const statsData: StatsHeaderProps["stats"] = [
	{
		label: "Total Customers",
		value: "12,456",
		icon: Users,
		color: "bg-blue-500",
		change: "+12.5%",
	},
	{
		label: "Active Customers",
		value: "10,234",
		icon: UserCheck,
		color: "bg-green-500",
		change: "+8.2%",
	},
	{
		label: "Inactive",
		value: "1,892",
		icon: UserX,
		color: "bg-yellow-500",
		change: "-3.1%",
	},
	{
		label: "Growth Rate",
		value: "23.5%",
		icon: TrendingUp,
		color: "bg-primary",
		change: "+5.4%",
	},
];

export default function CustomersPage() {
	return (
		<div className="flex flex-col gap-4 p-6 h-full overflow-hidden">
			<StatsHeader stats={statsData} />
			<div className="rounded-lg border border-border bg-background p-4 overflow-y-auto shadow-sm">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Customer Overview</h2>
					<Button size="sm" variant="outline">
						Export
					</Button>
				</div>
				<CustomerTable data={customersData} />
			</div>
		</div>
	);
}

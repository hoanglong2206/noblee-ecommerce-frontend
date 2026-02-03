import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

import {
	StatsHeader,
	StatsHeaderProps,
	CustomerTable,
	CustomerRow,
} from "@/components/app/admin";
import { Button } from "@/components/ui/button";

const customersData: CustomerRow[] = [
	{
		id: "cus_1",
		fullName: "Emily Johnson",
		email: "emily.johnson@example.com",
		phoneNumber: "+1 555-123-4567",
		gender: "female",
		dateOfBirth: "1990-04-12",
		avatarUrl: null,
		bio: "Loyal customer since 2023",
		createdAt: "2023-01-05T09:15:00Z",
		updatedAt: "2025-12-22T14:10:00Z",
		status: "Active",
		totalOrders: 36,
		totalSpend: "$4,580",
		location: "San Francisco, USA",
		lastActive: "2 hours ago",
	},
	{
		id: "cus_2",
		fullName: "Michael Chen",
		email: "michael.chen@example.com",
		phoneNumber: "+1 555-876-2345",
		gender: "male",
		dateOfBirth: "1987-08-21",
		avatarUrl: null,
		bio: null,
		createdAt: "2022-11-18T11:30:00Z",
		updatedAt: "2026-01-20T09:05:00Z",
		status: "Active",
		totalOrders: 58,
		totalSpend: "$7,910",
		location: "New York, USA",
		lastActive: "5 minutes ago",
	},
	{
		id: "cus_3",
		fullName: "Sara Ahmed",
		email: "sara.ahmed@example.com",
		phoneNumber: "+971 55 123 4567",
		gender: "female",
		dateOfBirth: "1995-02-10",
		avatarUrl: null,
		bio: "Enjoys seasonal collections",
		createdAt: "2024-02-02T08:40:00Z",
		updatedAt: "2025-12-15T16:45:00Z",
		status: "Inactive",
		totalOrders: 9,
		totalSpend: "$1,240",
		location: "Dubai, UAE",
		lastActive: "3 months ago",
	},
	{
		id: "cus_4",
		fullName: "Lucas Martin",
		email: "lucas.martin@example.com",
		phoneNumber: "+33 1 23 45 67 89",
		gender: "male",
		dateOfBirth: "1992-11-03",
		avatarUrl: null,
		bio: null,
		createdAt: "2021-05-28T10:05:00Z",
		updatedAt: "2026-01-10T18:20:00Z",
		status: "Active",
		totalOrders: 82,
		totalSpend: "$9,320",
		location: "Paris, France",
		lastActive: "1 day ago",
	},
	{
		id: "cus_5",
		fullName: "Ava Thompson",
		email: "ava.thompson@example.com",
		phoneNumber: "+61 2 5550 1234",
		gender: "female",
		dateOfBirth: "1998-07-16",
		avatarUrl: null,
		bio: "Prefers express shipping",
		createdAt: "2023-07-09T07:20:00Z",
		updatedAt: "2025-11-02T12:30:00Z",
		status: "Active",
		totalOrders: 27,
		totalSpend: "$3,480",
		location: "Sydney, Australia",
		lastActive: "12 hours ago",
	},
	{
		id: "cus_6",
		fullName: "Diego Fernández",
		email: "diego.fernandez@example.com",
		phoneNumber: "+34 91 123 45 67",
		gender: "male",
		dateOfBirth: "1985-01-29",
		avatarUrl: null,
		bio: null,
		createdAt: "2020-09-14T13:55:00Z",
		updatedAt: "2026-01-25T10:40:00Z",
		status: "Inactive",
		totalOrders: 14,
		totalSpend: "$2,150",
		location: "Madrid, Spain",
		lastActive: "6 months ago",
	},
];

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
		<div className="flex flex-col gap-4 p-6 overflow-hidden">
			<StatsHeader stats={statsData} />
			<div className="rounded-lg border border-border bg-background p-4 overflow-y-auto">
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

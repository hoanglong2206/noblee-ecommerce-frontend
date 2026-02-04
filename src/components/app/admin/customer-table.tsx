"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/app/admin/data-table";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/features/user/type";

export type CustomerRow = UserProfile & {
  isDisable: boolean;
  totalOrders: number;
  totalSpend: string;
  location: string;
  lastActive: string;
};

type CustomerTableProps = {
  data: CustomerRow[];
};

export function CustomerTable({ data }: CustomerTableProps) {
  const columns = useMemo<ColumnDef<CustomerRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Customer",
        cell: ({ row }) => {
          const profile = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {profile.fullName}
              </span>
              <span className="text-sm text-muted-foreground">
                {profile.email}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "isDisable",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.isDisable ? "secondary" : "success"}>
            {row.original.isDisable ? "Inactive" : "Active"}
          </Badge>
        ),
      },
      {
        accessorKey: "totalOrders",
        header: "Orders",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.totalOrders}</span>
        ),
      },
      {
        accessorKey: "totalSpend",
        header: "Total Spend",
        cell: ({ row }) => <span>{row.original.totalSpend}</span>,
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <span>{row.original.location}</span>,
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.lastActive}
          </span>
        ),
      },
    ],
    [],
  );

  return <DataTable data={data} columns={columns} getRowId={(row) => row.id} />;
}

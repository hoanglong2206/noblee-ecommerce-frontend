"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import type {
	ColumnDef,
	Row,
	RowSelectionState,
	SortingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableProps<TData, TValue> = {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	getRowId?: (originalRow: TData, index: number) => string;
	renderActions?: (row: Row<TData>) => ReactNode;
	onRowSelectionChange?: (selectedRows: TData[]) => void;
	pageSize?: number;
	isHasCheckbox?: boolean;
	isHasAction?: boolean;
	searchPlaceholder?: string;
	onSearchChange?: (query: string) => void;
};

type CheckboxProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	indeterminate?: boolean;
	"aria-label"?: string;
};

function DataTableCheckbox({
	checked,
	indeterminate,
	onChange,
	"aria-label": ariaLabel,
}: CheckboxProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!inputRef.current) {
			return;
		}
		inputRef.current.indeterminate = Boolean(indeterminate);
	}, [indeterminate]);

	return (
		<input
			aria-label={ariaLabel}
			checked={checked}
			className="h-4 w-4 rounded border border-input"
			onChange={(event) => onChange(event.target.checked)}
			ref={inputRef}
			type="checkbox"
		/>
	);
}

export function DataTable<TData, TValue>({
	data,
	columns,
	getRowId,
	renderActions,
	onRowSelectionChange,
	pageSize = 10,
	isHasCheckbox = true,
	isHasAction = true,
	searchPlaceholder = "Search...",
	onSearchChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchQuery, setSearchQuery] = useState("");

	const middleColumns = useMemo(() => columns, [columns]);

	const filteredData = useMemo(() => {
		if (!searchQuery) {
			return data;
		}
		const normalizedQuery = searchQuery.toLowerCase();
		return data.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(normalizedQuery),
		);
	}, [data, searchQuery]);

	const selectionColumn = useMemo<ColumnDef<TData, TValue>>(
		() => ({
			id: "select",
			header: ({ table }) => (
				<div className="px-4">
					<DataTableCheckbox
						aria-label="Select all"
						checked={table.getIsAllPageRowsSelected()}
						indeterminate={table.getIsSomePageRowsSelected()}
						onChange={(value) => table.toggleAllPageRowsSelected(value)}
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="px-4">
					<DataTableCheckbox
						aria-label="Select row"
						checked={row.getIsSelected()}
						indeterminate={row.getIsSomeSelected()}
						onChange={row.toggleSelected}
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		}),
		[],
	);

	const actionsColumn = useMemo<ColumnDef<TData, TValue>>(
		() => ({
			id: "actions",
			header: () => <span className="text-right">Actions</span>,
			cell: ({ row }) => (
				<div className="flex justify-start ">
					{renderActions ? (
						renderActions(row)
					) : (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<Eye className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-destructive hover:text-destructive/55"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		}),
		[renderActions],
	);

	const tableColumns = useMemo(() => {
		const composedColumns: ColumnDef<TData, TValue>[] = [...middleColumns];
		if (isHasAction) {
			composedColumns.push(actionsColumn);
		}
		if (isHasCheckbox) {
			composedColumns.unshift(selectionColumn);
		}
		return composedColumns;
	}, [
		actionsColumn,
		isHasAction,
		isHasCheckbox,
		middleColumns,
		selectionColumn,
	]);

	const table = useReactTable({
		data: filteredData,
		columns: tableColumns,
		state: {
			sorting,
			rowSelection,
		},
		enableRowSelection: isHasCheckbox,
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize,
			},
		},
	});

	useEffect(() => {
		if (!onRowSelectionChange || !isHasCheckbox) {
			return;
		}
		const selectedRows = table
			.getSelectedRowModel()
			.rows.map((selectedRow) => selectedRow.original as TData);
		onRowSelectionChange(selectedRows);
	}, [isHasCheckbox, onRowSelectionChange, rowSelection, table]);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		onSearchChange?.(value);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div className="flex-1">
					<Input
						className="w-full md:max-w-sm"
						placeholder={searchPlaceholder}
						value={searchQuery}
						onChange={(event) => handleSearchChange(event.target.value)}
						type="search"
					/>
				</div>
			</div>
			<div className="overflow-hidden rounded-md border border-border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead className="py-3" key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									data-state={row.getIsSelected() ? "selected" : undefined}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="py-3" key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									className="py-6 text-center text-muted-foreground"
									colSpan={table.getAllColumns().length}
								>
									No data available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between">
				{isHasCheckbox ? (
					<p className="text-sm text-muted-foreground">
						{table.getSelectedRowModel().rows.length} of{" "}
						{table.getRowModel().rows.length} selected
					</p>
				) : (
					<span />
				)}
				<div className="flex items-center gap-2">
					<button
						className="inline-flex h-8 items-center rounded border border-input px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						type="button"
					>
						Previous
					</button>
					<button
						className="inline-flex h-8 items-center rounded border border-input px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						type="button"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}

export type { DataTableProps };

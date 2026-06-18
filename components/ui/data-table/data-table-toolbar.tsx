"use client";

import type { Column, Table } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import { shadcnButtonVariants } from "../constants";
import { Form } from "../form";
import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableSliderFilter } from "./data-table-slider-filter";
import { DataTableViewOptions } from "./data-table-view-options";

type DataTableToolbarProps<TData> = React.ComponentProps<"div"> & {
	table: Table<TData>;
};

export function DataTableToolbar<TData>({
	children,
	className,
	table,
	...props
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	const columns = useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table]);

	const onReset = useCallback(() => {
		table.resetColumnFilters();
	}, [table]);

	return (
		<div
			role="toolbar"
			aria-orientation="horizontal"
			className={cnMerge("flex w-full items-start justify-between gap-2 p-1", className)}
			{...props}
		>
			<div className="flex flex-1 flex-wrap items-center gap-2">
				{columns.map((column) => (
					<DataTableToolbarFilter key={column.id} column={column} />
				))}
				{isFiltered && (
					<button
						type="button"
						aria-label="Reset filters"
						className={cnMerge(
							shadcnButtonVariants({ size: "sm", variant: "outline" }),
							"border-dashed"
						)}
						onClick={onReset}
					>
						<IconBox icon="lucide:x" />
						Reset
					</button>
				)}
			</div>
			<div className="flex items-center gap-2">
				{children}
				<DataTableViewOptions table={table} align="end" />
			</div>
		</div>
	);
}
type DataTableToolbarFilterProps<TData> = {
	column: Column<TData>;
};

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
	const columnMeta = column.columnDef.meta;

	const onFilterRender = useCallback(() => {
		if (!columnMeta?.variant) return null;

		switch (columnMeta.variant) {
			case "date":
			case "dateRange": {
				return (
					<DataTableDateFilter
						column={column}
						title={columnMeta.label ?? column.id}
						multiple={columnMeta.variant === "dateRange"}
					/>
				);
			}

			case "multiSelect":
			case "select": {
				return (
					<DataTableFacetedFilter
						column={column}
						title={columnMeta.label ?? column.id}
						options={columnMeta.options ?? []}
						multiple={columnMeta.variant === "multiSelect"}
					/>
				);
			}

			case "number": {
				return (
					<div className="relative">
						<Form.InputPrimitive
							type="number"
							inputMode="numeric"
							placeholder={columnMeta.placeholder ?? columnMeta.label}
							value={(column.getFilterValue() as string | undefined) ?? ""}
							onChange={(event) => column.setFilterValue(event.target.value)}
							className={cnMerge(
								"h-8 w-[120px] rounded-md border border-shadcn-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-shadcn-muted-foreground focus-visible:border-shadcn-ring focus-visible:ring-[3px] focus-visible:ring-shadcn-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
								columnMeta.unit && "pr-8"
							)}
						/>
						{columnMeta.unit && (
							<span className="absolute inset-y-0 right-0 flex items-center rounded-r-md bg-shadcn-accent px-2 text-sm text-shadcn-muted-foreground">
								{columnMeta.unit}
							</span>
						)}
					</div>
				);
			}

			case "range": {
				return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />;
			}
			case "text": {
				return (
					<Form.InputPrimitive
						placeholder={columnMeta.placeholder ?? columnMeta.label}
						value={(column.getFilterValue() as string | undefined) ?? ""}
						onChange={(event) => column.setFilterValue(event.target.value)}
						className="h-8 w-40 rounded-md border border-shadcn-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-shadcn-muted-foreground focus-visible:border-shadcn-ring focus-visible:ring-[3px] focus-visible:ring-shadcn-ring/50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-56"
					/>
				);
			}

			default: {
				return null;
			}
		}
	}, [column, columnMeta]);

	return onFilterRender();
}

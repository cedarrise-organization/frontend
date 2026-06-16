import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { cnMerge } from "@/lib/utils/cn";
import * as Table from "../table";
import { DataTablePagination } from "./data-table-pagination";
import { getColumnPinningStyle } from "./data-table-utils";

type DataTableProps<TData> = React.ComponentProps<"div"> & {
	actionBar?: React.ReactNode;
	isLoading?: boolean;
	table: TanstackTable<TData>;
};

export function DataTable<TData>({
	actionBar,
	children,
	className,
	isLoading = false,
	table,
	...props
}: DataTableProps<TData>) {
	const rows = table.getRowModel().rows;
	const columnCount = table.getAllColumns().length;

	return (
		<div className={cnMerge("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
			{children}
			<div className="overflow-hidden rounded-md border">
				<Table.Root>
					<Table.Header>
						{table.getHeaderGroups().map((headerGroup) => (
							<Table.Row key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<Table.Head
										key={header.id}
										colSpan={header.colSpan}
										style={{
											...getColumnPinningStyle({ column: header.column }),
										}}
									>
										{header.isPlaceholder ? null : (
											flexRender(header.column.columnDef.header, header.getContext())
										)}
									</Table.Head>
								))}
							</Table.Row>
						))}
					</Table.Header>
					<Table.Body>
						{isLoading && (
							<Table.Row>
								<Table.Cell colSpan={columnCount} className="h-24 text-center">
									Loading...
								</Table.Cell>
							</Table.Row>
						)}

						{!isLoading
							&& rows.length > 0
							&& rows.map((row) => (
								<Table.Row key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<Table.Cell
											key={cell.id}
											style={{
												...getColumnPinningStyle({ column: cell.column }),
											}}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Table.Cell>
									))}
								</Table.Row>
							))}

						{!isLoading && rows.length === 0 && (
							<Table.Row>
								<Table.Cell colSpan={columnCount} className="h-24 text-center">
									No results.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</div>
			<div className="flex flex-col gap-2.5">
				<DataTablePagination table={table} />
				{Boolean(actionBar && table.getFilteredSelectedRowModel().rows.length > 0) && actionBar}
			</div>
		</div>
	);
}

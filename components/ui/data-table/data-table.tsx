import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { For } from "@/components/common/for";
import { cnMerge } from "@/lib/utils/cn";
import * as Table from "../table";
import { DataTablePagination } from "./data-table-pagination";
import { getColumnPinningStyle } from "./data-table-utils";

export function DataTable<TData>(
	props: React.ComponentProps<"div"> & {
		classNames?: {
			base?: string;
			pagination?: string;
			tableBody?: string;
			tableCell?: string;
			tableContainer?: string;
			tableHead?: string;
			tableHeader?: string;
			tableRoot?: string;
			tableRow?: string;
		};
		isLoading?: boolean;
		table: TanstackTable<TData>;
	}
) {
	const { children, className, classNames, isLoading = false, table, ...restOfProps } = props;

	const rows = table.getRowModel().rows;
	const columnCount = table.getAllColumns().length;

	return (
		<div className={cnMerge("flex w-full flex-col", classNames?.base, className)} {...restOfProps}>
			{children}

			<Table.Root classNames={{ base: classNames?.tableContainer, table: classNames?.tableRoot }}>
				<Table.Header className={classNames?.tableHeader}>
					<For
						each={table.getHeaderGroups()}
						renderItem={(headerGroup) => (
							<Table.Row key={headerGroup.id} className={classNames?.tableRow}>
								<For
									each={headerGroup.headers}
									renderItem={(header) => (
										<Table.Head
											key={header.id}
											colSpan={header.colSpan}
											style={getColumnPinningStyle({ column: header.column })}
											className={classNames?.tableHead}
										>
											{!header.isPlaceholder
												&& flexRender(header.column.columnDef.header, header.getContext())}
										</Table.Head>
									)}
								/>
							</Table.Row>
						)}
					/>
				</Table.Header>
				<Table.Body className={classNames?.tableBody}>
					{isLoading && (
						<Table.Row className={classNames?.tableRow}>
							<Table.Cell
								colSpan={columnCount}
								className={cnMerge("h-24 text-center", classNames?.tableCell)}
							>
								Loading...
							</Table.Cell>
						</Table.Row>
					)}

					{!isLoading
						&& rows.length > 0
						&& rows.map((row) => (
							<Table.Row
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className={classNames?.tableRow}
							>
								{row.getVisibleCells().map((cell) => (
									<Table.Cell
										key={cell.id}
										style={{
											...getColumnPinningStyle({ column: cell.column }),
										}}
										className={classNames?.tableCell}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Table.Cell>
								))}
							</Table.Row>
						))}

					{!isLoading && rows.length === 0 && (
						<Table.Row className={classNames?.tableRow}>
							<Table.Cell
								colSpan={columnCount}
								className={cnMerge("h-24 text-center", classNames?.tableCell)}
							>
								No results.
							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table.Root>

			<DataTablePagination table={table} className={classNames?.pagination} />
		</div>
	);
}

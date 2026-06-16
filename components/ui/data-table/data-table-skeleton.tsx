import { cnMerge } from "@/lib/utils/cn";
import { Skeleton } from "../skeleton";
import * as Table from "../table";

const DEFAULT_CELL_WIDTHS = ["auto"];

type DataTableSkeletonProps = React.ComponentProps<"div"> & {
	cellWidths?: string[];
	columnCount: number;
	filterCount?: number;
	rowCount?: number;
	shrinkZero?: boolean;
	withPagination?: boolean;
	withViewOptions?: boolean;
}

export function DataTableSkeleton({
	cellWidths = DEFAULT_CELL_WIDTHS,
	className,
	columnCount,
	filterCount = 0,
	rowCount = 10,
	shrinkZero = false,
	withPagination = true,
	withViewOptions = true,
	...props
}: DataTableSkeletonProps) {
	const cozyCellWidths = Array.from(
		{ length: columnCount },
		(_, index) => cellWidths[index % cellWidths.length] ?? "auto"
	);
	const columnKeys = Array.from({ length: columnCount }, (_, index) => `column-${index}`);
	const filterKeys = Array.from({ length: filterCount }, (_, index) => `filter-${index}`);
	const rowKeys = Array.from({ length: rowCount }, (_, index) => `row-${index}`);

	return (
		<div className={cnMerge("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
			<div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
				<div className="flex flex-1 items-center gap-2">
					{filterCount > 0 ?
						filterKeys.map((filterKey) => (
							<Skeleton key={filterKey} className="h-7 w-18 border-dashed" />
						))
					:	null}
				</div>
				{withViewOptions ?
					<Skeleton className="ml-auto hidden h-7 w-18 lg:flex" />
				:	null}
			</div>
			<div className="rounded-md border">
				<Table.Root>
					<Table.Header>
						<Table.Row className="hover:bg-transparent">
							{columnKeys.map((columnKey, columnIndex) => (
									<Table.Head
										key={columnKey}
										style={{
											minWidth: shrinkZero ? cozyCellWidths[columnIndex] : "auto",
											width: cozyCellWidths[columnIndex],
										}}
									>
										<Skeleton className="h-6 w-full" />
									</Table.Head>
							))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{rowKeys.map((rowKey) => (
							<Table.Row key={rowKey} className="hover:bg-transparent">
								{columnKeys.map((columnKey, columnIndex) => (
									<Table.Cell
										key={`${rowKey}-${columnKey}`}
										style={{
											minWidth: shrinkZero ? cozyCellWidths[columnIndex] : "auto",
											width: cozyCellWidths[columnIndex],
										}}
									>
										<Skeleton className="h-6 w-full" />
									</Table.Cell>
								))}
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
			{withPagination ?
				<div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
					<Skeleton className="h-7 w-40 shrink-0" />
					<div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
						<div className="flex items-center gap-2">
							<Skeleton className="h-7 w-24" />
							<Skeleton className="h-7 w-18" />
						</div>
						<div className="flex items-center justify-center text-sm font-medium">
							<Skeleton className="h-7 w-20" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="hidden size-7 lg:block" />
							<Skeleton className="size-7" />
							<Skeleton className="size-7" />
							<Skeleton className="hidden size-7 lg:block" />
						</div>
					</div>
				</div>
			:	null}
		</div>
	);
}

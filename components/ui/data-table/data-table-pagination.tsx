import type { Table } from "@tanstack/react-table";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import { shadcnButtonVariants } from "../constants";
import * as Select from "../select";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

type DataTablePaginationProps<TData> = React.ComponentProps<"div"> & {
	pageSizeOptions?: number[];
	table: Table<TData>;
};

export function DataTablePagination<TData>({
	className,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	table,
	...props
}: DataTablePaginationProps<TData>) {
	return (
		<div
			className={cnMerge(
				`flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row
				sm:gap-8`,
				className
			)}
			{...props}
		>
			<div className="flex-1 text-sm whitespace-nowrap text-shadcn-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
				row(s) selected.
			</div>
			<div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
					<Select.Root
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value: string) => {
							table.setPageSize(Number(value));
						}}
					>
						<Select.Trigger className="h-8 w-18 data-size:h-8">
							<Select.Value placeholder={table.getState().pagination.pageSize} />
						</Select.Trigger>
						<Select.Content side="top">
							{pageSizeOptions.map((pageSize) => (
								<Select.Item key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</Select.Item>
							))}
						</Select.Content>
					</Select.Root>
				</div>
				<div className="flex items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<button
						type="button"
						aria-label="Go to first page"
						className={cnMerge(
							shadcnButtonVariants({ size: "icon", variant: "outline" }),
							"hidden lg:flex"
						)}
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<IconBox icon="lucide:chevrons-left" />
					</button>
					<button
						type="button"
						aria-label="Go to previous page"
						className={cnMerge(shadcnButtonVariants({ size: "icon", variant: "outline" }))}
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<IconBox icon="lucide:chevron-left" />
					</button>
					<button
						type="button"
						aria-label="Go to next page"
						className={cnMerge(shadcnButtonVariants({ size: "icon", variant: "outline" }))}
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<IconBox icon="lucide:chevron-right" />
					</button>
					<button
						type="button"
						aria-label="Go to last page"
						className={cnMerge(
							shadcnButtonVariants({ size: "icon", variant: "outline" }),
							"hidden lg:flex"
						)}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<IconBox icon="lucide:chevrons-right" />
					</button>
				</div>
			</div>
		</div>
	);
}

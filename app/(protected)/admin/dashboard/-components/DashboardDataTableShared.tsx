"use client";

import type { Table } from "@tanstack/react-table";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Select } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getSortingStateParser } from "@/components/ui/data-table/data-table-parsers";
import { Form } from "@/components/ui/form";
import { OrderByOptions } from "@/lib/api/callBackendApi/apiSchema";
import { cnMerge } from "@/lib/utils/cn";

const DASHBOARD_TABLE_ORDER_OPTIONS = [
	{ label: "Ascending", value: "asc" },
	{ label: "Descending", value: "desc" },
] as const;

export function DashboardDataTableSection<TRecord>(props: {
	color: "red" | "yellow";
	count: number;
	isLoading: boolean;
	label: string;
	onDownload: () => void;
	searchQueryKey: string;
	sortOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusQueryKey?: string;
	table: Table<TRecord>;
}) {
	const {
		color,
		count,
		isLoading,
		label,
		onDownload,
		searchQueryKey,
		sortOptions,
		statusOptions,
		statusQueryKey,
		table,
	} = props;

	return (
		<section className="overflow-hidden rounded-[20px] bg-cedar-white">
			<article className="flex flex-row items-center justify-between gap-4 px-5 pt-5 pb-4 lg:px-7">
				<div className="flex items-center gap-4">
					<span
						className={cnMerge(
							"h-[52px] w-2 rounded-full",
							color === "yellow" ? "bg-cedar-yellow" : "bg-cedar-red"
						)}
					/>
					<div className="flex min-w-0 flex-col gap-1">
						<h3 className="text-[16px] font-semibold text-cedar-black lg:text-[18px]">{label}</h3>
						<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
							{count} {count === 1 ? "Submission" : "Submissions"}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<Button
						size="medium"
						type="button"
						className="h-auto rounded-[12px] bg-cedar-grey px-5 py-3 text-[12px] text-cedar-black/64
							lg:h-auto lg:px-7 lg:text-[14px]"
						onClick={onDownload}
					>
						export as CSV tables
					</Button>
					<span
						className="rounded-[6px] bg-cedar-black/12 px-3 py-1.5 text-[14px] text-cedar-black/56"
					>
						{count}
					</span>
				</div>
			</article>

			<DataTable
				isLoading={isLoading}
				table={table}
				className="gap-0 overflow-x-auto rounded-none border-0 text-[13px]
					**:data-[slot=table-cell]:px-5 **:data-[slot=table-cell]:py-4
					**:data-[slot=table-container]:min-w-[900px] **:data-[slot=table-container]:overflow-x-auto
					**:data-[slot=table-head]:h-12 **:data-[slot=table-head]:px-5
					**:data-[slot=table-head]:text-[12px] **:data-[slot=table-head]:font-semibold
					**:data-[slot=table-head]:text-cedar-black/80 **:data-[slot=table-row]:border-cedar-black/10
					**:data-[slot=table-row]:hover:bg-transparent [&_table]:border-0
					[&>div:first-child]:rounded-none [&>div:first-child]:border-0 [&>div:last-child]:px-1
					[&>div:last-child]:py-3 lg:[&>div:last-child]:px-5"
			>
				<div className="border-y border-cedar-black/8 bg-cedar-grey p-5 lg:px-7">
					<DashboardDataTableToolbar
						searchQueryKey={searchQueryKey}
						sortOptions={sortOptions ?? []}
						statusQueryKey={statusQueryKey}
						statusOptions={statusOptions}
						table={table}
					/>
				</div>
			</DataTable>
		</section>
	);
}

function DashboardDataTableToolbar<TRecord>(props: {
	searchQueryKey: string;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusQueryKey?: string;
	table: Table<TRecord>;
}) {
	const { searchQueryKey, sortOptions, statusOptions, statusQueryKey, table } = props;

	const queryKeys = table.options.meta?.queryKeys;
	const pageQueryKey = queryKeys?.page ?? "page";
	const perPageQueryKey = queryKeys?.perPage ?? "perPage";
	const sortQueryKey = queryKeys?.sort ?? "sort";
	const resolvedStatusQueryKey = statusQueryKey ?? "unusedStatusFilter";

	const [search, setSearch] = useQueryState(searchQueryKey, parseAsString.withDefault(""));
	const [status, setStatus] = useQueryState(
		resolvedStatusQueryKey,
		parseAsArrayOf(parseAsString).withDefault([])
	);
	const [, setPage] = useQueryState(pageQueryKey, parseAsInteger.withDefault(1));
	const [, setPerPage] = useQueryState(perPageQueryKey, parseAsInteger.withDefault(10));
	const [, setSort] = useQueryState(sortQueryKey, getSortingStateParser<TRecord>().withDefault([]));

	const currentSort = table.getState().sorting[0];
	const sortBy = currentSort?.id ?? "";

	const orderBy = currentSort?.desc ? "desc" : "asc";

	const hasSortControls = sortOptions.length > 0;
	const statusValue = status[0] ?? "";

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		void setSearch(event.target.value || null);
		void setPage(null);
	};

	const handleSortByChange = (value: string) => {
		table.setSorting(value ? [{ desc: orderBy === "desc", id: value }] : []);
		void setPage(null);
	};

	const handleOrderByChange = (value: string) => {
		if (!sortBy) return;

		table.setSorting([{ desc: value === "desc", id: sortBy }]);
		void setPage(null);
	};

	const handleStatusChange = (value: string) => {
		void setStatus(value ? [value] : null);
		void setPage(null);
	};

	const handleResetFilters = () => {
		void setSearch(null);
		void setStatus(null);
		void setSort(null);
		void setPage(null);
		void setPerPage(null);
	};

	return (
		<div className="flex flex-wrap items-center gap-3 lg:gap-4">
			<Form.InputGroup
				className="flex h-[40px] w-full max-w-[430px] items-center gap-3 rounded-[12px] bg-cedar-white
					px-4 text-[12px] text-cedar-black/64 lg:h-[40px] lg:max-w-[220px]"
			>
				<Form.InputGroupAddon className="size-4 shrink-0 text-cedar-black/40">
					<IconBox icon="lucide:search" className="size-full" />
				</Form.InputGroupAddon>
				<Form.InputPrimitive
					type="search"
					placeholder="search this section"
					className="w-full bg-transparent outline-none placeholder:text-cedar-black/36"
					value={search}
					onChange={handleSearchChange}
				/>
			</Form.InputGroup>

			{hasSortControls && (
				<DashboardToolbarSelect
					placeholder="Sort By"
					value={sortBy}
					onValueChange={handleSortByChange}
					options={sortOptions}
				/>
			)}

			{statusOptions && statusQueryKey && (
				<DashboardToolbarSelect
					placeholder="Status"
					value={statusValue}
					onValueChange={handleStatusChange}
					options={statusOptions}
				/>
			)}

			{hasSortControls && (
				<DashboardToolbarSelect
					placeholder="Order By"
					value={orderBy}
					onValueChange={handleOrderByChange}
					options={DASHBOARD_TABLE_ORDER_OPTIONS}
				/>
			)}

			<Button
				theme="secondary-outline"
				size="medium"
				type="button"
				className="h-10 border-cedar-black/10 px-4 text-[12px] text-cedar-black/64 lg:h-10 lg:px-4
					lg:text-[12px]"
				onClick={handleResetFilters}
			>
				Reset Filters
			</Button>
		</div>
	);
}

function DashboardToolbarSelect(props: {
	onValueChange: (value: string) => void;
	options: ReadonlyArray<{ label: string; value: string }>;
	placeholder: string;
	value: string;
}) {
	const { onValueChange, options, placeholder, value } = props;

	return (
		<Select.Root value={value} onValueChange={onValueChange}>
			<Select.Trigger
				className="h-[40px] w-fit rounded-[12px] border border-cedar-black/10 bg-cedar-white px-4
					text-[12px] text-cedar-black/64 shadow-none"
				classNames={{ icon: "size-4 text-cedar-black" }}
			>
				<Select.Value placeholder={placeholder} />
			</Select.Trigger>
			<Select.Content>
				<For
					each={options}
					renderItem={(option) => (
						<Select.Item key={option.value} value={option.value}>
							{option.label}
						</Select.Item>
					)}
				/>
			</Select.Content>
		</Select.Root>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardDataTableQueryState = <const TSortBy extends string>(props: {
	pageKey: string;
	perPageKey: string;
	sortableColumnIds: TSortBy[];
	sortKey: string;
}) => {
	const { pageKey, perPageKey, sortableColumnIds, sortKey } = props;

	const [page] = useQueryState(pageKey, parseAsInteger.withDefault(1));
	const [limit] = useQueryState(perPageKey, parseAsInteger.withDefault(10));
	const [sorting] = useQueryState(
		sortKey,
		getSortingStateParser<Record<TSortBy, unknown>>(sortableColumnIds).withDefault([])
	);

	const activeSort = sorting[0];

	return {
		limit,
		orderBy: activeSort?.desc ? OrderByOptions[1] : OrderByOptions[0],
		page,
		sortBy: activeSort?.id,
	};
};

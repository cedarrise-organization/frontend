"use client";

import type { Column, Table } from "@tanstack/react-table";
import { isArray } from "@zayne-labs/toolkit-type-helpers";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Select } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getSortingStateParser } from "@/components/ui/data-table/data-table-parsers";
import { Form } from "@/components/ui/form";
import { cnMerge } from "@/lib/utils/cn";

export function DashboardDataTableSection<TRecord>(props: {
	color: "red" | "yellow";
	count: number;
	isDownloadLoading: boolean;
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
		isDownloadLoading,
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
		<section className="flex flex-col gap-5">
			<article
				className="flex flex-row items-center justify-between gap-4 bg-cedar-white px-5 pt-5 pb-4
					lg:px-7"
			>
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
						isDisabled={isDownloadLoading}
						isLoading={isDownloadLoading}
						size="medium"
						type="button"
						className="h-auto rounded-[12px] bg-cedar-grey px-5 py-3 text-[12px] text-cedar-black/64
							lg:h-auto lg:px-7 lg:text-[14px]"
						onClick={onDownload}
					>
						export as CSV tables
					</Button>
					<p className="rounded-[6px] bg-cedar-black/12 px-3 py-1.5 text-[14px] text-cedar-black/56">
						{count}
					</p>
				</div>
			</article>

			<DashboardDataTable isLoading={isLoading} table={table}>
				<DashboardDataTableQueryToolbar
					searchQueryKey={searchQueryKey}
					sortOptions={sortOptions ?? []}
					statusQueryKey={statusQueryKey}
					statusOptions={statusOptions}
					table={table}
				/>
			</DashboardDataTable>
		</section>
	);
}

export function DashboardDataTable<TRecord>(props: {
	children: React.ReactNode;
	isLoading: boolean;
	table: Table<TRecord>;
}) {
	const { children, isLoading, table } = props;

	return (
		<DataTable
			isLoading={isLoading}
			table={table}
			classNames={{
				base: "text-[13px]",
				pagination: "rounded-b-[20px] bg-cedar-white px-3 py-2",
				tableCell: "px-5 py-4",
				tableContainer: "mt-5 min-h-[650px] rounded-t-[20px] bg-cedar-white",
				tableHead: "px-5 text-[12px] font-semibold text-cedar-black/80",
				tableRow: "border-cedar-black/10 hover:bg-cedar-grey/20",
			}}
		>
			<div className="w-full bg-cedar-grey px-5 lg:px-7">{children}</div>
		</DataTable>
	);
}

export function DashboardDataTableFilterToolbar<TRecord>(props: { table: Table<TRecord> }) {
	const { table } = props;
	const columns = table.getAllColumns().filter((column) => column.getCanFilter());

	return (
		<DashboardDataTableToolbar onReset={() => table.resetColumnFilters()}>
			<For
				each={columns}
				renderItem={(column) => <DashboardColumnFilter key={column.id} column={column} />}
			/>
		</DashboardDataTableToolbar>
	);
}

function DashboardDataTableToolbar(props: { children: React.ReactNode; onReset: () => void }) {
	const { children, onReset } = props;

	return (
		<div className="flex flex-wrap items-center gap-3 lg:gap-4">
			{children}

			<Button
				theme="secondary-outline"
				size="medium"
				type="button"
				className="h-10 border-cedar-black/10 px-4 text-[12px] text-cedar-black/64 lg:h-10 lg:px-4
					lg:text-[12px]"
				onClick={onReset}
			>
				Reset Filters
			</Button>
		</div>
	);
}

function DashboardColumnFilter<TRecord>(props: { column: Column<TRecord> }) {
	const { column } = props;
	const meta = column.columnDef.meta;
	const filterValue = column.getFilterValue();

	if (meta?.variant === "text") {
		const value =
			isArray(filterValue) ?
				filterValue.join(" ")
			:	String((filterValue as PropertyKey | undefined) ?? "");

		return (
			<DashboardToolbarSearch
				placeholder={meta.placeholder ?? meta.label}
				value={value}
				onValueChange={(nextValue) => column.setFilterValue(nextValue || undefined)}
			/>
		);
	}

	if (meta?.variant === "select") {
		const value = isArray(filterValue) ? filterValue[0] : filterValue;

		return (
			<DashboardToolbarSelect
				onValueChange={(nextValue) => column.setFilterValue(nextValue ? [nextValue] : undefined)}
				options={meta.options ?? []}
				placeholder={meta.label ?? column.id}
				value={typeof value === "string" ? value : ""}
			/>
		);
	}

	return null;
}

const DASHBOARD_TABLE_ORDER_OPTIONS = [
	{ label: "Ascending", value: "asc" },
	{ label: "Descending", value: "desc" },
] as const;

function DashboardDataTableQueryToolbar<TRecord>(props: {
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

	const handleSearchValueChange = (value: string) => {
		void setSearch(value || null);
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
		<DashboardDataTableToolbar onReset={handleResetFilters}>
			<DashboardToolbarSearch value={search} onValueChange={handleSearchValueChange} />

			{hasSortControls && (
				<DashboardToolbarSelect
					onValueChange={handleSortByChange}
					options={sortOptions}
					placeholder="Sort By"
					value={sortBy}
				/>
			)}

			{statusOptions && statusQueryKey && (
				<DashboardToolbarSelect
					onValueChange={handleStatusChange}
					options={statusOptions}
					placeholder="Status"
					value={status[0] ?? ""}
				/>
			)}

			{hasSortControls && (
				<DashboardToolbarSelect
					onValueChange={handleOrderByChange}
					options={DASHBOARD_TABLE_ORDER_OPTIONS}
					placeholder="Order By"
					value={orderBy}
				/>
			)}
		</DashboardDataTableToolbar>
	);
}

function DashboardToolbarSearch(props: {
	onValueChange: (value: string) => void;
	placeholder?: string;
	value: string;
}) {
	const { onValueChange, placeholder = "search this section", value } = props;

	return (
		<Form.InputGroup
			className="flex h-10 w-full max-w-[430px] items-center gap-3 rounded-[12px] bg-cedar-white px-4
				text-[12px] text-cedar-black/64 lg:h-10 lg:max-w-[220px]"
		>
			<Form.InputGroupAddon className="size-4 shrink-0 text-cedar-black/40">
				<IconBox icon="lucide:search" className="size-full" />
			</Form.InputGroupAddon>

			<Form.InputPrimitive
				type="search"
				placeholder={placeholder}
				className="w-full bg-transparent outline-none placeholder:text-cedar-black/36"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
			/>
		</Form.InputGroup>
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
				classNames={{
					base: `h-10 w-fit rounded-[12px] border border-cedar-black/10 bg-cedar-white px-4
					text-[12px] text-cedar-black/64 shadow-none`,
					icon: "size-4 text-cedar-black",
				}}
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

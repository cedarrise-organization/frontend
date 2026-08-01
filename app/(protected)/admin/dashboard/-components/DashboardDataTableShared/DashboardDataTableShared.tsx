"use client";

import type { Column, Table } from "@tanstack/react-table";
import { useDebouncedFn } from "@zayne-labs/toolkit-react";
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
	sortOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	table: Table<TRecord>;
}) {
	const {
		color,
		count,
		isDownloadLoading,
		isLoading,
		label,
		onDownload,
		sortOptions,
		statusOptions,
		table,
	} = props;

	return (
		<section className="flex flex-col gap-5">
			<article
				className="flex flex-row items-center justify-between gap-4 rounded-t-[20px] bg-cedar-white
					px-5 pt-5 pb-4 lg:px-7"
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
						loadingStyle="side-by-side"
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
					sortOptions={sortOptions ?? []}
					statusOptions={statusOptions}
					table={table}
				/>
			</DashboardDataTable>
		</section>
	);
}

export function DashboardDataTable<TRecord>(props: {
	children: React.ReactNode;
	classNames?: React.ComponentProps<typeof DataTable<TRecord>>["classNames"] & {
		toolbarContainer?: string;
	};
	isLoading: boolean;
	table: Table<TRecord>;
}) {
	const { children, classNames, isLoading, table } = props;

	return (
		<DataTable
			isLoading={isLoading}
			table={table}
			classNames={{
				base: cnMerge("text-[13px]", classNames?.base),
				pagination: cnMerge("rounded-b-[20px] bg-cedar-white px-3 py-2", classNames?.pagination),
				tableCell: cnMerge("px-5 py-4", classNames?.tableCell),
				tableContainer: cnMerge(
					"mt-5 min-h-[650px] rounded-t-[20px] bg-cedar-white",
					classNames?.tableContainer
				),
				tableHead: cnMerge(
					"px-5 text-[13px] font-semibold text-cedar-black/80",
					classNames?.tableHead
				),
				tableHeader: classNames?.tableHeader,
				tableRoot: classNames?.tableRoot,
				tableRow: cnMerge("border-cedar-black/10 hover:bg-cedar-grey/20", classNames?.tableRow),
			}}
		>
			{children}
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

function DashboardDataTableToolbar(props: {
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	onReset: () => void;
}) {
	const { actions, children, className, onReset } = props;

	return (
		<article
			className={cnMerge(
				"flex items-center justify-between gap-3 bg-cedar-grey px-5 lg:gap-4 lg:px-7",
				className
			)}
		>
			<div className="flex w-full flex-wrap items-center gap-3 lg:gap-4">
				{children}

				<Button
					theme="secondary-outline"
					size="medium"
					type="button"
					className="h-10 border-cedar-black/10 px-4 text-[14px] text-cedar-black/64 lg:h-10 lg:px-4
						lg:text-[14px]"
					onClick={onReset}
				>
					Reset Filters
				</Button>
			</div>

			{actions}
		</article>
	);
}

function DashboardColumnFilter<TRecord>(props: { column: Column<TRecord> }) {
	const { column } = props;
	const meta = column.columnDef.meta;
	const filterValue = column.getFilterValue();

	if (meta?.variant === "text") {
		return (
			<DashboardToolbarSearch
				placeholder={meta.placeholder ?? meta.label}
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

export function DashboardDataTableQueryToolbar<TRecord>(props: {
	actions?: React.ReactNode;
	classNames?: {
		base?: string;
		search?: string;
		select?: string;
	};
	searchPlaceholder?: string;
	showOrderBy?: boolean;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	table: Table<TRecord>;
}) {
	const {
		actions,
		classNames,
		searchPlaceholder,
		showOrderBy = true,
		sortOptions,
		statusOptions,
		table,
	} = props;

	const queryKeys = table.options.meta?.queryKeys;
	const statusQueryKey = queryKeys?.status;

	if (statusOptions && statusQueryKey) {
		return (
			<DashboardDataTableQueryToolbarWithStatus
				actions={actions}
				classNames={classNames}
				searchPlaceholder={searchPlaceholder}
				showOrderBy={showOrderBy}
				sortOptions={sortOptions}
				statusOptions={statusOptions}
				statusQueryKey={statusQueryKey}
				table={table}
			/>
		);
	}

	return (
		<DashboardDataTableQueryToolbarBase
			actions={actions}
			classNames={classNames}
			searchPlaceholder={searchPlaceholder}
			showOrderBy={showOrderBy}
			sortOptions={sortOptions}
			table={table}
		/>
	);
}

function useDashboardDataTableQueryToolbar<TRecord>(
	table: Table<TRecord>,
	options?: {
		onReset?: () => void;
	}
) {
	const { onReset } = options ?? {};

	const queryKeys = table.options.meta?.queryKeys;
	const pageQueryKey = queryKeys?.page ?? "page";
	const perPageQueryKey = queryKeys?.perPage ?? "perPage";
	const searchQueryKey = queryKeys?.search ?? "search";
	const sortQueryKey = queryKeys?.sort ?? "sort";

	const [search, setSearch] = useQueryState(searchQueryKey, parseAsString.withDefault(""));
	const [, setPage] = useQueryState(pageQueryKey, parseAsInteger.withDefault(1));
	const [, setPerPage] = useQueryState(perPageQueryKey, parseAsInteger.withDefault(10));
	const [, setSort] = useQueryState(sortQueryKey, getSortingStateParser<TRecord>().withDefault([]));

	const currentSort = table.getState().sorting[0];
	const sortBy = currentSort?.id ?? "";
	const orderBy = currentSort?.desc ? "desc" : "asc";

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

	const handleResetFilters = () => {
		void setSearch(null);
		void setSort(null);
		void setPage(null);
		void setPerPage(null);
		onReset?.();
	};

	return {
		handleOrderByChange,
		handleResetFilters,
		handleSearchValueChange,
		handleSortByChange,
		orderBy,
		search,
		setPage,
		sortBy,
	};
}

function DashboardDataTableQueryToolbarBase<TRecord>(props: {
	actions?: React.ReactNode;
	classNames?: {
		base?: string;
		search?: string;
		select?: string;
	};
	searchPlaceholder?: string;
	showOrderBy?: boolean;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	table: Table<TRecord>;
}) {
	const { actions, classNames, searchPlaceholder, showOrderBy = true, sortOptions, table } = props;

	const toolbar = useDashboardDataTableQueryToolbar(table);

	return (
		<DashboardDataTableQueryToolbarControls
			actions={actions}
			classNames={classNames}
			searchPlaceholder={searchPlaceholder}
			showOrderBy={showOrderBy}
			sortOptions={sortOptions}
			toolbar={toolbar}
		/>
	);
}

function DashboardDataTableQueryToolbarWithStatus<TRecord>(props: {
	actions?: React.ReactNode;
	classNames?: {
		base?: string;
		search?: string;
		select?: string;
	};
	searchPlaceholder?: string;
	showOrderBy?: boolean;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	statusOptions: ReadonlyArray<{ label: string; value: string }>;
	statusQueryKey: string;
	table: Table<TRecord>;
}) {
	const {
		actions,
		classNames,
		searchPlaceholder,
		showOrderBy = true,
		sortOptions,
		statusOptions,
		statusQueryKey,
		table,
	} = props;
	const [status, setStatus] = useQueryState(
		statusQueryKey,
		parseAsArrayOf(parseAsString).withDefault([])
	);
	const toolbar = useDashboardDataTableQueryToolbar(table, { onReset: () => void setStatus(null) });

	const handleStatusChange = (value: string) => {
		void setStatus(value ? [value] : null);
		void toolbar.setPage(null);
	};

	return (
		<DashboardDataTableQueryToolbarControls
			actions={actions}
			classNames={classNames}
			searchPlaceholder={searchPlaceholder}
			showOrderBy={showOrderBy}
			sortOptions={sortOptions}
			statusControl={
				<DashboardToolbarSelect
					className={classNames?.select}
					onValueChange={handleStatusChange}
					options={statusOptions}
					placeholder="Status"
					value={status[0] ?? ""}
				/>
			}
			toolbar={toolbar}
		/>
	);
}

function DashboardDataTableQueryToolbarControls(props: {
	actions?: React.ReactNode;
	classNames?: {
		base?: string;
		search?: string;
		select?: string;
	};
	searchPlaceholder?: string;
	showOrderBy: boolean;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	statusControl?: React.ReactNode;
	toolbar: ReturnType<typeof useDashboardDataTableQueryToolbar>;
}) {
	const { actions, classNames, searchPlaceholder, showOrderBy, sortOptions, statusControl, toolbar } =
		props;
	const hasSortControls = sortOptions.length > 0;

	return (
		<DashboardDataTableToolbar
			actions={actions}
			className={classNames?.base}
			onReset={toolbar.handleResetFilters}
		>
			<DashboardToolbarSearch
				className={classNames?.search}
				placeholder={searchPlaceholder}
				onValueChange={toolbar.handleSearchValueChange}
			/>

			{hasSortControls && (
				<DashboardToolbarSelect
					className={classNames?.select}
					onValueChange={toolbar.handleSortByChange}
					options={sortOptions}
					placeholder="Sort By"
					value={toolbar.sortBy}
				/>
			)}

			{statusControl}

			{hasSortControls && showOrderBy && (
				<DashboardToolbarSelect
					className={classNames?.select}
					onValueChange={toolbar.handleOrderByChange}
					options={DASHBOARD_TABLE_ORDER_OPTIONS}
					placeholder="Order By"
					value={toolbar.orderBy}
				/>
			)}
		</DashboardDataTableToolbar>
	);
}

function DashboardToolbarSearch(props: {
	className?: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
}) {
	const { className, onValueChange, placeholder = "Search this section" } = props;

	const handleChangeDebounced = useDebouncedFn(onValueChange, 300);

	return (
		<Form.InputGroup
			className={cnMerge(
				`flex h-10 w-full max-w-[430px] items-center gap-3 rounded-[12px] bg-cedar-white px-4
				text-[12px] text-cedar-black/64 lg:h-10 lg:max-w-[220px]`,
				className
			)}
		>
			<Form.InputGroupAddon className="size-4 shrink-0 text-cedar-black/40">
				<IconBox icon="lucide:search" className="size-full" />
			</Form.InputGroupAddon>

			<Form.InputPrimitive
				type="search"
				placeholder={placeholder}
				className="w-full bg-transparent outline-none placeholder:text-cedar-black/36"
				onChange={(event) => handleChangeDebounced(event.target.value)}
			/>
		</Form.InputGroup>
	);
}

function DashboardToolbarSelect(props: {
	className?: string;
	onValueChange: (value: string) => void;
	options: ReadonlyArray<{ label: string; value: string }>;
	placeholder: string;
	value: string;
}) {
	const { className, onValueChange, options, placeholder, value } = props;

	return (
		<Select.Root value={value} onValueChange={onValueChange}>
			<Select.Trigger
				classNames={{
					base: cnMerge(
						`h-10 w-fit rounded-[12px] border border-cedar-black/10 bg-cedar-white px-4 text-[14px]
						text-cedar-black/64 shadow-none`,
						className
					),
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

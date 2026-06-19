import {
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable as useTable,
	type ColumnFiltersState,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	type TableOptions,
	type TableState,
	type Updater,
	type VisibilityState,
} from "@tanstack/react-table";
import { useDebouncedFn } from "@zayne-labs/toolkit-react";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	useQueryState,
	useQueryStates,
	type SingleParser,
	type UseQueryStateOptions,
} from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { getSortingStateParser } from "./data-table-parsers";
import type { ExtendedColumnSort, QueryKeys } from "./data-table-types";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const FILTERS_KEY = "filters";
const JOIN_OPERATOR_KEY = "joinOperator";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

type UseDataTableProps<TData> = Omit<
	TableOptions<TData>,
	"getCoreRowModel" | "manualFiltering" | "manualPagination" | "manualSorting" | "pageCount" | "state"
>
	& Required<Pick<TableOptions<TData>, "pageCount">> & {
		clearOnDefault?: boolean;
		debounceMs?: number;
		enableAdvancedFilter?: boolean;
		history?: "push" | "replace";
		initialState?: Omit<Partial<TableState>, "sorting"> & {
			sorting?: Array<ExtendedColumnSort<TData>>;
		};
		queryKeys?: Partial<QueryKeys>;
		scroll?: boolean;
		shallow?: boolean;
		sortableColumnIds?: readonly string[];
		startTransition?: React.TransitionStartFunction;
		throttleMs?: number;
	};

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
	const {
		clearOnDefault = false,
		columns,
		debounceMs = DEBOUNCE_MS,
		enableAdvancedFilter = false,
		enableSorting,
		history = "replace",
		initialState,
		pageCount,
		queryKeys,
		scroll = false,
		shallow = true,
		sortableColumnIds,
		startTransition,
		throttleMs = THROTTLE_MS,
		...tableProps
	} = props;
	const pageKey = queryKeys?.page ?? PAGE_KEY;
	const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY;
	const sortKey = queryKeys?.sort ?? SORT_KEY;
	const filtersKey = queryKeys?.filters ?? FILTERS_KEY;
	const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY;

	const queryStateOptions = useMemo<Omit<UseQueryStateOptions<string>, "parse">>(
		() => ({
			clearOnDefault,
			debounceMs,
			history,
			scroll,
			shallow,
			startTransition,
			throttleMs,
		}),
		[history, scroll, shallow, throttleMs, debounceMs, clearOnDefault, startTransition]
	);

	const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialState?.columnVisibility ?? {}
	);

	const [page, setPage] = useQueryState(
		pageKey,
		parseAsInteger.withOptions(queryStateOptions).withDefault(1)
	);
	const [perPage, setPerPage] = useQueryState(
		perPageKey,
		parseAsInteger.withOptions(queryStateOptions).withDefault(initialState?.pagination?.pageSize ?? 10)
	);

	const pagination: PaginationState = useMemo(() => {
		return {
			pageIndex: page - 1, // zero-based index -> one-based index
			pageSize: perPage,
		};
	}, [page, perPage]);

	const onPaginationChange = useCallback(
		(updaterOrValue: Updater<PaginationState>) => {
			if (typeof updaterOrValue === "function") {
				const newPagination = updaterOrValue(pagination);
				void setPage(newPagination.pageIndex + 1);
				void setPerPage(newPagination.pageSize);
			} else {
				void setPage(updaterOrValue.pageIndex + 1);
				void setPerPage(updaterOrValue.pageSize);
			}
		},
		[pagination, setPage, setPerPage]
	);

	const columnIds = useMemo(() => {
		return new Set(sortableColumnIds ?? columns.map((column) => column.id).filter(Boolean));
	}, [columns, sortableColumnIds]);
	const resolvedColumns = useMemo(() => {
		if (!sortableColumnIds) return columns;

		return columns.map((column) => ({
			...column,
			enableSorting: Boolean(column.id && sortableColumnIds.includes(column.id)),
		}));
	}, [columns, sortableColumnIds]);

	const [sorting, setSorting] = useQueryState(
		sortKey,
		getSortingStateParser<TData>(columnIds)
			.withOptions(queryStateOptions)
			.withDefault(initialState?.sorting ?? [])
	);

	const onSortingChange = useCallback(
		(updaterOrValue: Updater<SortingState>) => {
			if (typeof updaterOrValue === "function") {
				const newSorting = updaterOrValue(sorting);
				void setSorting(newSorting as Array<ExtendedColumnSort<TData>>);
			} else {
				void setSorting(updaterOrValue as Array<ExtendedColumnSort<TData>>);
			}
		},
		[sorting, setSorting]
	);

	const filterableColumns = useMemo(() => {
		if (enableAdvancedFilter) return [];

		return columns.filter((column) => column.enableColumnFilter);
	}, [columns, enableAdvancedFilter]);

	const filterParsers = useMemo(() => {
		if (enableAdvancedFilter) return {};

		return filterableColumns.reduce<Record<string, SingleParser<string[]> | SingleParser<string>>>(
			(acc, column) => {
				if (column.meta?.options) {
					acc[column.id ?? ""] = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions(
						queryStateOptions
					);
				} else {
					acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions);
				}
				return acc;
			},
			{}
		);
	}, [filterableColumns, queryStateOptions, enableAdvancedFilter]);

	const [filterValues, setFilterValues] = useQueryStates(filterParsers);

	const debouncedSetFilterValues = useDebouncedFn((values: typeof filterValues) => {
		void setPage(1);
		void setFilterValues(values);
	}, debounceMs);

	const initialColumnFilters: ColumnFiltersState = useMemo(() => {
		if (enableAdvancedFilter) return [];

		return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
			if (value !== null) {
				const processedValue =
					Array.isArray(value) ? value
						// eslint-disable-next-line unicorn/no-nested-ternary
					: typeof value === "string" && /[^a-zA-Z0-9]/.test(value) ?
						value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
					:	[value];

				filters.push({
					id: key,
					value: processedValue,
				});
			}
			return filters;
		}, []);
	}, [filterValues, enableAdvancedFilter]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

	const onColumnFiltersChange = useCallback(
		(updaterOrValue: Updater<ColumnFiltersState>) => {
			if (enableAdvancedFilter) return;

			setColumnFilters((prev) => {
				const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

				const filterUpdates = next.reduce<Record<string, string | string[] | null>>((acc, filter) => {
					if (filterableColumns.some((column) => column.id === filter.id)) {
						acc[filter.id] = filter.value as string | string[];
					}
					return acc;
				}, {});

				for (const prevFilter of prev) {
					if (!next.some((filter) => filter.id === prevFilter.id)) {
						filterUpdates[prevFilter.id] = null;
					}
				}

				debouncedSetFilterValues(filterUpdates);
				return next;
			});
		},
		[debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
	);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useTable({
		...tableProps,
		columns: resolvedColumns,
		defaultColumn: {
			...tableProps.defaultColumn,
			enableColumnFilter: false,
		},
		enableRowSelection: true,
		enableSorting: enableSorting ?? (sortableColumnIds ? sortableColumnIds.length > 0 : undefined),
		getCoreRowModel: getCoreRowModel(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState,
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		meta: {
			...tableProps.meta,
			queryKeys: {
				filters: filtersKey,
				joinOperator: joinOperatorKey,
				page: pageKey,
				perPage: perPageKey,
				sort: sortKey,
			},
		},
		onColumnFiltersChange,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange,
		onRowSelectionChange: setRowSelection,
		onSortingChange,
		pageCount,
		state: {
			columnFilters,
			columnVisibility,
			pagination,
			rowSelection,
			sorting,
		},
	});

	return useMemo(
		() => ({ debounceMs, shallow, table, throttleMs }),
		[table, shallow, debounceMs, throttleMs]
	);
}

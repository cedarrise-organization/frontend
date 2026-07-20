"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import { ReceiptSortByOptions } from "@/lib/api/callBackendApi/apiSchema";
import { generalReceiptsDownloadMutation } from "@/lib/react-query/mutationOptions";
import { generalReceiptsQuery, type GeneralReceiptsListQuery } from "@/lib/react-query/queryOptions";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import {
	DashboardDataTable,
	DashboardDataTableQueryToolbar,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
import { Main } from "../-components/Main";

type ReceiptsQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof generalReceiptsQuery>["queryFn"]>>
>;

type ReceiptRecord = ReceiptsQueryResult["data"][number];

const RECEIPTS_TABLE_QUERY_KEYS = {
	filters: "receiptsFilters",
	joinOperator: "receiptsJoinOperator",
	page: "receiptsPage",
	perPage: "receiptsPerPage",
	search: "receiptsSearch",
	sort: "receiptsSort",
} as const satisfies QueryKeys;

const RECEIPTS_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

const RECEIPT_SORT_OPTIONS = ReceiptSortByOptions.map((option) => ({
	label: option.split(/(?=[A-Z])/).join(" "),
	value: option,
}));

function ReceiptsPage() {
	const [search] = useQueryState(RECEIPTS_TABLE_QUERY_KEYS.search, parseAsString.withDefault(""));

	const receiptsQuery = useDashboardDataTableQueryState({
		pageKey: RECEIPTS_TABLE_QUERY_KEYS.page,
		perPageKey: RECEIPTS_TABLE_QUERY_KEYS.perPage,
		sortableColumnIds: ReceiptSortByOptions,
		sortKey: RECEIPTS_TABLE_QUERY_KEYS.sort,
	});

	const query = {
		limit: receiptsQuery.limit,
		orderBy: receiptsQuery.orderBy,
		page: receiptsQuery.page,
		...(search && { search }),
		...(receiptsQuery.sortBy && { sortBy: receiptsQuery.sortBy }),
	} satisfies GeneralReceiptsListQuery;

	const receiptsQueryResult = useQuery(generalReceiptsQuery(query));
	const downloadMutation = useMutation(generalReceiptsDownloadMutation());
	const records = receiptsQueryResult.data?.data ?? [];
	const pagination = receiptsQueryResult.data?.meta.pagination;

	const columns = useMemo<Array<ColumnDef<ReceiptRecord>>>(() => {
		return [
			{
				accessorFn: (row) => row.name,
				cell: ({ row }) => (
					<span className="text-[13px] font-semibold text-cedar-black">{row.original.name}</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="RECEIPT NAME" />,
				id: "name",
			},
			{
				accessorFn: (row) => row.amount,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/72">
						{new Intl.NumberFormat("en-NG", {
							currency: "NGN",
							maximumFractionDigits: 0,
							style: "currency",
						}).format(row.original.amount)}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="AMOUNT" />,
				id: "amount",
			},
			{
				accessorFn: (row) => row.description,
				cell: ({ row }) => (
					<span className="block max-w-[320px] truncate text-[13px] text-cedar-black/64">
						{row.original.description ?? EMPTY_VALUE_PLACEHOLDER}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DESCRIPTION" />,
				id: "description",
			},
			{
				accessorFn: (row) => row.createdAt,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/64">
						{new Intl.DateTimeFormat("en", {
							day: "numeric",
							month: "short",
							year: "numeric",
						}).format(new Date(row.original.createdAt))}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DATE" />,
				id: "createdAt",
			},
			{
				accessorFn: (row) => row.uploadedBy,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/64 capitalize">
						{row.original.uploadedBy}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="UPLOADED BY" />,
				id: "uploadedBy",
			},
			{
				cell: ({ row }) => (
					<Button
						as="a"
						href={row.original.imageUrl}
						target="_blank"
						rel="noreferrer"
						theme="white"
						className="h-9 rounded-[10px] border border-cedar-black/12 px-4 text-[13px]
							text-cedar-black/72 lg:h-9 lg:px-4 lg:text-[13px]"
					>
						View
					</Button>
				),
				enableHiding: false,
				enableSorting: false,
				header: "ACTION",
				id: "action",
			},
		];
	}, []);

	const table = useDataTable<ReceiptRecord>({
		clearOnDefault: true,
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: RECEIPTS_TABLE_INITIAL_STATE,
		pageCount: pagination?.totalPages ?? 1,
		queryKeys: RECEIPTS_TABLE_QUERY_KEYS,
		sortableColumnIds: ReceiptSortByOptions,
	});

	return (
		<Main className="gap-8 lg:gap-12">
			<header className="flex flex-col gap-2">
				<h1 className="text-[20px] font-medium text-cedar-black lg:text-[24px]">Receipts</h1>
				<p className="max-w-[560px] text-[14px] text-cedar-black/64 lg:text-[16px]">
					Financial documentation, verifications and expense records
				</p>
			</header>

			<DashboardDataTable isLoading={receiptsQueryResult.isPending} table={table.table}>
				<DashboardDataTableQueryToolbar
					actions={
						<Button
							theme="white"
							isDisabled={downloadMutation.isPending}
							isLoading={downloadMutation.isPending}
							loadingStyle="side-by-side"
							className="h-10 shrink-0 rounded-[10px] border border-cedar-black/10 px-8 text-[13px]
								text-cedar-black/56 lg:h-10 lg:px-8 lg:text-[13px]"
							onClick={() => downloadMutation.mutate()}
						>
							Export as cvs
						</Button>
					}
					searchPlaceholder="search Receipts"
					showOrderBy={false}
					sortOptions={RECEIPT_SORT_OPTIONS}
					table={table.table}
				/>
			</DashboardDataTable>
		</Main>
	);
}

export default ReceiptsPage;

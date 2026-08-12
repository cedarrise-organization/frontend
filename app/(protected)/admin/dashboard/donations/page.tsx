"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import { DonationSortByOptions } from "@/lib/api/callBackendApi/apiSchema";
import {
	donationRecordDeleteMutation,
	donationRecordsDownloadMutation,
} from "@/lib/react-query/mutationOptions";
import { donationRecordsQuery, type DonationRecordsListQuery } from "@/lib/react-query/queryOptions";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import {
	DashboardDataTable,
	DashboardDataTableQueryToolbar,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
import { Main } from "../-components/Main";

type DonationRecordsQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof donationRecordsQuery>["queryFn"]>>
>;

type DonationRecord = DonationRecordsQueryResult["data"][number];

const DONATIONS_TABLE_QUERY_KEYS = {
	filters: "donationsFilters",
	joinOperator: "donationsJoinOperator",
	page: "donationsPage",
	perPage: "donationsPerPage",
	search: "donationsSearch",
	sort: "donationsSort",
} as const satisfies QueryKeys;

const DONATIONS_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

const DONATION_SORT_OPTIONS = DonationSortByOptions.map((option) => ({
	label: option.split(/(?=[A-Z])/).join(" "),
	value: option,
}));

function DonationsPage() {
	const [search] = useQueryState(DONATIONS_TABLE_QUERY_KEYS.search, parseAsString.withDefault(""));

	const donationsQuery = useDashboardDataTableQueryState({
		pageKey: DONATIONS_TABLE_QUERY_KEYS.page,
		perPageKey: DONATIONS_TABLE_QUERY_KEYS.perPage,
		sortableColumnIds: DonationSortByOptions,
		sortKey: DONATIONS_TABLE_QUERY_KEYS.sort,
	});

	const query = {
		limit: donationsQuery.limit,
		orderBy: donationsQuery.orderBy,
		page: donationsQuery.page,
		...(search && { search }),
		...(donationsQuery.sortBy && { sortBy: donationsQuery.sortBy }),
	} satisfies DonationRecordsListQuery;

	const donationsQueryResult = useQuery(donationRecordsQuery(query));
	const downloadMutation = useMutation(donationRecordsDownloadMutation());
	const records = donationsQueryResult.data?.data ?? [];
	const pagination = donationsQueryResult.data?.meta.pagination;

	const columns = useMemo<Array<ColumnDef<DonationRecord>>>(() => {
		return [
			{
				accessorFn: (row) => row.name,
				cell: ({ row }) => (
					<span className="text-[13px] font-semibold text-cedar-black">{row.original.name}</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DONOR NAME" />,
				id: "name",
			},
			{
				accessorFn: (row) => row.email,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/72">{row.original.email}</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DONOR EMAIL" />,
				id: "email",
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
				header: ({ column }) => <DataTableColumnHeader column={column} label="AMOUNT DONATED" />,
				id: "amount",
			},
			{
				accessorFn: (row) => row.supportAreas?.join(", "),
				cell: ({ row }) => (
					<span className="block max-w-[320px] text-[13px] text-cedar-black/64">
						{row.original.supportAreas?.map((element) => formatSupportArea(element)).join(", ")
							?? EMPTY_VALUE_PLACEHOLDER}
					</span>
				),
				enableSorting: false,
				header: ({ column }) => <DataTableColumnHeader column={column} label="SUPPORT AREAS" />,
				id: "supportAreas",
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
				header: ({ column }) => <DataTableColumnHeader column={column} label="DATE OF DONATION" />,
				id: "createdAt",
			},
			{
				cell: ({ row }) => <DonationDeleteAction record={row.original} />,
				enableHiding: false,
				enableSorting: false,
				header: "ACTION",
				id: "action",
			},
		];
	}, []);

	const table = useDataTable<DonationRecord>({
		clearOnDefault: true,
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: DONATIONS_TABLE_INITIAL_STATE,
		pageCount: pagination?.totalPages ?? 1,
		queryKeys: DONATIONS_TABLE_QUERY_KEYS,
		sortableColumnIds: DonationSortByOptions,
	});

	return (
		<Main className="gap-8 lg:gap-12">
			<header className="flex flex-col gap-2">
				<h1 className="text-[20px] font-medium text-cedar-black lg:text-[24px]">Donations</h1>
				<p className="max-w-[560px] text-[14px] text-cedar-black/64 lg:text-[16px]">
					Donation records
				</p>
			</header>

			<DashboardDataTable isLoading={donationsQueryResult.isPending} table={table.table}>
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
							Export as CSV
						</Button>
					}
					searchPlaceholder="Search donations"
					showOrderBy={false}
					sortOptions={DONATION_SORT_OPTIONS}
					table={table.table}
				/>
			</DashboardDataTable>
		</Main>
	);
}

function DonationDeleteAction(props: { record: DonationRecord }) {
	const { record } = props;
	const queryClient = useQueryClient();
	const deleteMutation = useMutation(donationRecordDeleteMutation(record.id));

	return (
		<Button
			theme="secondary"
			isDisabled={deleteMutation.isPending}
			isLoading={deleteMutation.isPending}
			className="h-9 rounded-[10px] px-4 text-[13px] lg:h-9 lg:px-4 lg:text-[13px]"
			onClick={() => {
				deleteMutation.mutate(undefined, {
					onSuccess: () => {
						void queryClient.invalidateQueries({
							queryKey: donationRecordsQuery().queryKey.slice(0, -1),
						});
					},
				});
			}}
		>
			Delete
		</Button>
	);
}

function formatSupportArea(value: string) {
	return value
		.replaceAll("_", " ")
		.toLowerCase()
		.replaceAll(/\b\w/g, (character) => character.toUpperCase());
}

export default DonationsPage;

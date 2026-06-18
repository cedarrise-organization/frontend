"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { DialogAnimated, TabsAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { DropdownMenu, Select } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getSortingStateParser } from "@/components/ui/data-table/data-table-parsers";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import {
	AshExitSortByOptions,
	AshTrackingRecordSortByOptions,
	CapacityEvaluationSortByOptions,
	OutreachSortByOptions,
	TacotsExitSortByOptions,
	TacotsOnboardingSortByOptions,
	TacotsTrackingRecordSortByOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import {
	ashAttendanceDeleteMutation,
	ashExitDeleteMutation,
	ashTrackerDataDownloadMutation,
	ashTrackingDeleteMutation,
	capacityBuildingDeleteMutation,
	capacityBuildingTrackerDataDownloadMutation,
	outreachDeleteMutation,
	outreachTrackerDataDownloadMutation,
	tacotsExitDeleteMutation,
	tacotsOnboardingDeleteMutation,
	tacotsTrackerDataDownloadMutation,
	tacotsTrackingDeleteMutation,
	type AshTrackerDataKind,
	type TacotsTrackerDataKind,
} from "@/lib/react-query/mutationOptions";
import {
	ashAttendanceTrackerDataDetailQuery,
	ashAttendanceTrackerDataQuery,
	ashExitTrackerDataDetailQuery,
	ashExitTrackerDataQuery,
	ashTrackingTrackerDataDetailQuery,
	ashTrackingTrackerDataQuery,
	capacityBuildingTrackerDataDetailQuery,
	capacityBuildingTrackerDataQuery,
	outreachTrackerDataDetailQuery,
	outreachTrackerDataQuery,
	tacotsExitTrackerDataDetailQuery,
	tacotsExitTrackerDataQuery,
	tacotsOnboardingTrackerDataDetailQuery,
	tacotsOnboardingTrackerDataQuery,
	tacotsTrackingTrackerDataDetailQuery,
	tacotsTrackingTrackerDataQuery,
	type AshAttendanceTrackerDataQueryResult,
	type AshExitTrackerDataQueryResult,
	type AshTrackingTrackerDataListQuery,
	type AshTrackingTrackerDataQueryResult,
	type CapacityBuildingTrackerDataQueryResult,
	type OutreachTrackerDataQueryResult,
	type TacotsExitTrackerDataQueryResult,
	type TacotsOnboardingTrackerDataQueryResult,
	type TacotsTrackingTrackerDataQueryResult,
} from "@/lib/react-query/queryOptions";
import { cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import { Main } from "../-components/Main";

const TRACKER_DATA_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

const TRACKER_DATA_TABS = [
	{ label: "ASH", value: "ash" },
	{ label: "TACOTS", value: "tacots" },
	{ label: "Outreaches", value: "outreaches" },
	{ label: "Capacity Building", value: "capacity-building" },
] as const;

const ASH_TRACKER_DATA_QUERY_KEYS = {
	attendance: {
		filters: "ashAttendanceFilters",
		joinOperator: "ashAttendanceJoinOperator",
		page: "ashAttendancePage",
		perPage: "ashAttendancePerPage",
		sort: "ashAttendanceSort",
	},
	exit: {
		filters: "ashExitFilters",
		joinOperator: "ashExitJoinOperator",
		page: "ashExitPage",
		perPage: "ashExitPerPage",
		sort: "ashExitSort",
	},
	tracking: {
		filters: "ashTrackingFilters",
		joinOperator: "ashTrackingJoinOperator",
		page: "ashTrackingPage",
		perPage: "ashTrackingPerPage",
		sort: "ashTrackingSort",
	},
} as const satisfies Record<AshTrackerDataKind, QueryKeys>;

const TACOTS_TRACKER_DATA_QUERY_KEYS = {
	exit: {
		filters: "tacotsExitFilters",
		joinOperator: "tacotsExitJoinOperator",
		page: "tacotsExitPage",
		perPage: "tacotsExitPerPage",
		sort: "tacotsExitSort",
	},
	onboarding: {
		filters: "tacotsOnboardingFilters",
		joinOperator: "tacotsOnboardingJoinOperator",
		page: "tacotsOnboardingPage",
		perPage: "tacotsOnboardingPerPage",
		sort: "tacotsOnboardingSort",
	},
	tracking: {
		filters: "tacotsTrackingFilters",
		joinOperator: "tacotsTrackingJoinOperator",
		page: "tacotsTrackingPage",
		perPage: "tacotsTrackingPerPage",
		sort: "tacotsTrackingSort",
	},
} as const satisfies Record<TacotsTrackerDataKind, QueryKeys>;

const OUTREACH_TRACKER_DATA_QUERY_KEYS = {
	filters: "outreachTrackerDataFilters",
	joinOperator: "outreachTrackerDataJoinOperator",
	page: "outreachTrackerDataPage",
	perPage: "outreachTrackerDataPerPage",
	sort: "outreachTrackerDataSort",
} as const satisfies QueryKeys;

const CAPACITY_TRACKER_DATA_QUERY_KEYS = {
	filters: "capacityTrackerDataFilters",
	joinOperator: "capacityTrackerDataJoinOperator",
	page: "capacityTrackerDataPage",
	perPage: "capacityTrackerDataPerPage",
	sort: "capacityTrackerDataSort",
} as const satisfies QueryKeys;

const TOOLBAR_ORDER_OPTIONS = [
	{ label: "Ascending", value: "asc" },
	{ label: "Descending", value: "desc" },
] as const;

const EMPTY_SORT_OPTIONS: ReadonlyArray<{ label: string; value: string }> = [];

const ASH_TRACKING_SORT_OPTIONS = [
	{ label: "Academic Session", value: "academicSession" },
	{ label: "School Name", value: "schoolName" },
	{ label: "Term", value: "term" },
	{ label: "Created", value: "createdAt" },
] as const;

const ASH_EXIT_SORT_OPTIONS = [
	{ label: "Age at Exit", value: "ageAtExit" },
	{ label: "Class at Exit", value: "classAtExit" },
	{ label: "Exit Date", value: "exitDate" },
	{ label: "Created", value: "createdAt" },
] as const;

const TACOTS_TRACKING_SORT_OPTIONS = [
	{ label: "Academic Session", value: "academicSession" },
	{ label: "Assessment Period", value: "assessmentPeriod" },
	{ label: "Term", value: "academicTerm" },
	{ label: "Created", value: "createdAt" },
] as const;

const TACOTS_ONBOARDING_SORT_OPTIONS = [
	{ label: "Current School", value: "enrolledSchoolName" },
	{ label: "Date of Onboarding", value: "onboardingDate" },
	{ label: "State", value: "enrolledSchoolState" },
	{ label: "Created", value: "createdAt" },
] as const;

const TACOTS_EXIT_SORT_OPTIONS = [
	{ label: "Year of Exit", value: "yearOfExit" },
	{ label: "School Attended", value: "schoolAttendedDuringProgram" },
	{ label: "Current Status", value: "currentStatus" },
	{ label: "Created", value: "createdAt" },
] as const;

const OUTREACH_SORT_OPTIONS = [
	{ label: "Start Date", value: "outreachStartDate" },
	{ label: "State", value: "outreachState" },
	{ label: "Outreach Type", value: "outreachType" },
	{ label: "Created", value: "createdAt" },
] as const;

const CAPACITY_SORT_OPTIONS = [
	{ label: "Program Name", value: "programName" },
	{ label: "Program Date", value: "programDate" },
	{ label: "Location", value: "location" },
	{ label: "Created", value: "createdAt" },
] as const;

type AshAttendanceRecord = AshAttendanceTrackerDataQueryResult["data"][number];
type AshExitRecord = AshExitTrackerDataQueryResult["data"][number];
type AshTrackingRecord = AshTrackingTrackerDataQueryResult["data"][number];
type CapacityBuildingRecord = CapacityBuildingTrackerDataQueryResult["data"][number];
type OutreachRecord = OutreachTrackerDataQueryResult["data"][number];
type TacotsExitRecord = TacotsExitTrackerDataQueryResult["data"][number];
type TacotsOnboardingRecord = TacotsOnboardingTrackerDataQueryResult["data"][number];
type TacotsTrackingRecord = TacotsTrackingTrackerDataQueryResult["data"][number];

type TrackerDataOrderBy = NonNullable<AshTrackingTrackerDataListQuery>["orderBy"];
type TrackerRecord =
	| AshAttendanceRecord
	| AshExitRecord
	| AshTrackingRecord
	| CapacityBuildingRecord
	| OutreachRecord
	| TacotsExitRecord
	| TacotsOnboardingRecord
	| TacotsTrackingRecord;

type SelectedTrackerRecord =
	| { id: string; kind: "evaluation"; program: "capacity-building"; title: string }
	| { id: string; kind: "tracker"; program: "outreaches"; title: string }
	| { id: string; kind: AshTrackerDataKind; program: "ash"; title: string }
	| { id: string; kind: TacotsTrackerDataKind; program: "tacots"; title: string };

type TrackerActionTarget =
	| { kind: "evaluation"; program: "capacity-building" }
	| { kind: "tracker"; program: "outreaches" }
	| { kind: AshTrackerDataKind; program: "ash" }
	| { kind: TacotsTrackerDataKind; program: "tacots" };

function TrackerDataPage() {
	const [selectedRecord, setSelectedRecord] = useState<SelectedTrackerRecord | null>(null);

	return (
		<Main className="gap-6 lg:gap-8">
			<header>
				<h1 className="text-[24px] font-semibold text-cedar-black lg:text-[40px]">Forms & Tracking</h1>
			</header>

			<TabsAnimated.Root defaultValue="ash">
				<Card.Root className="rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red shadow-none",
							list: "h-12 min-w-[520px] rounded-[12px] bg-cedar-grey p-1",
						}}
					>
						<For
							each={TRACKER_DATA_TABS}
							renderItem={(tab) => (
								<TabsAnimated.Trigger
									key={tab.value}
									value={tab.value}
									className="px-5 text-cedar-black/70 data-[state=active]:text-cedar-white"
								>
									{tab.label}
								</TabsAnimated.Trigger>
							)}
						/>
					</TabsAnimated.List>
				</Card.Root>

				<TabsAnimated.ContentList className="mt-6 flex flex-col gap-6">
					<TabsAnimated.Content value="ash" className="flex flex-col gap-6">
						<AshTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value="tacots" className="flex flex-col gap-6">
						<TacotsTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value="outreaches" className="flex flex-col gap-6">
						<OutreachTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value="capacity-building" className="flex flex-col gap-6">
						<CapacityBuildingTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>
				</TabsAnimated.ContentList>
			</TabsAnimated.Root>

			<TrackerDataDetailsDialog selectedRecord={selectedRecord} onOpenChange={setSelectedRecord} />
		</Main>
	);
}

export default TrackerDataPage;

function AshTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const trackingColumns = useAshTrackingColumns({ onViewMore });
	const attendanceColumns = useAshAttendanceColumns({ onViewMore });
	const exitColumns = useAshExitColumns({ onViewMore });

	const trackingQuery = useTrackerDataQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.perPage,
		sortableColumnIds: AshTrackingRecordSortByOptions,
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.sort,
	});

	const attendanceQuery = useTrackerDataQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.perPage,
		sortableColumnIds: [],
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.sort,
	});

	const exitQuery = useTrackerDataQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.perPage,
		sortableColumnIds: AshExitSortByOptions,
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.sort,
	});

	const [search] = useQueryState("ashTrackerDataSearch", parseAsString.withDefault(""));

	const trackingQueryResult = useQuery(
		ashTrackingTrackerDataQuery({
			limit: trackingQuery.limit,
			page: trackingQuery.page,
			...(trackingQuery.orderBy && { orderBy: trackingQuery.orderBy }),
			...(search && { search }),
			...(trackingQuery.sortBy && { sortBy: trackingQuery.sortBy }),
		})
	);

	const attendanceQueryResult = useQuery(
		ashAttendanceTrackerDataQuery({
			limit: attendanceQuery.limit,
			page: attendanceQuery.page,
			...(attendanceQuery.orderBy && { orderBy: attendanceQuery.orderBy }),
			...(search && { search }),
		})
	);

	const exitQueryResult = useQuery(
		ashExitTrackerDataQuery({
			limit: exitQuery.limit,
			page: exitQuery.page,
			...(exitQuery.orderBy && { orderBy: exitQuery.orderBy }),
			...(search && { search }),
			...(exitQuery.sortBy && { sortBy: exitQuery.sortBy }),
		})
	);

	const trackingRecords = trackingQueryResult.data?.data ?? [];
	const attendanceRecords = attendanceQueryResult.data?.data ?? [];
	const exitRecords = exitQueryResult.data?.data ?? [];

	const stats = getTrackerDataStats({
		completedRecords: exitRecords.length,
		records: [...trackingRecords, ...attendanceRecords, ...exitRecords],
	});

	const trackingTable = useDataTable<AshTrackingRecord>({
		columns: trackingColumns,
		data: trackingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: trackingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.tracking,
	});

	const attendanceTable = useDataTable<AshAttendanceRecord>({
		columns: attendanceColumns,
		data: attendanceRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: attendanceQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.attendance,
	});

	const exitTable = useDataTable<AshExitRecord>({
		columns: exitColumns,
		data: exitRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: exitQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.exit,
	});

	const trackingDownloadMutation = useMutation(ashTrackerDataDownloadMutation("tracking"));
	const attendanceDownloadMutation = useMutation(ashTrackerDataDownloadMutation("attendance"));
	const exitDownloadMutation = useMutation(ashTrackerDataDownloadMutation("exit"));

	return (
		<>
			<TrackerDataStats stats={stats} />
			<TrackerDataTableSection
				color="yellow"
				count={trackingRecords.length}
				isLoading={trackingQueryResult.isPending}
				label="ASH - Termly Tracking Form"
				searchQueryKey="ashTrackerDataSearch"
				sortOptions={ASH_TRACKING_SORT_OPTIONS}
				table={trackingTable.table}
				onDownload={() => trackingDownloadMutation.mutate()}
			/>
			<TrackerDataTableSection
				color="yellow"
				count={attendanceRecords.length}
				isLoading={attendanceQueryResult.isPending}
				label="ASH - Weekly activity & Attendance"
				searchQueryKey="ashTrackerDataSearch"
				table={attendanceTable.table}
				onDownload={() => attendanceDownloadMutation.mutate()}
			/>
			<TrackerDataTableSection
				color="red"
				count={exitRecords.length}
				isLoading={exitQueryResult.isPending}
				label="ASH - Exit Submitted data"
				searchQueryKey="ashTrackerDataSearch"
				sortOptions={ASH_EXIT_SORT_OPTIONS}
				table={exitTable.table}
				onDownload={() => exitDownloadMutation.mutate()}
			/>
		</>
	);
}

function TacotsTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const trackingColumns = useTacotsTrackingColumns({ onViewMore });
	const onboardingColumns = useTacotsOnboardingColumns({ onViewMore });
	const exitColumns = useTacotsExitColumns({ onViewMore });

	const trackingQuery = useTrackerDataQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.perPage,
		sortableColumnIds: TacotsTrackingRecordSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.sort,
	});

	const onboardingQuery = useTrackerDataQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.perPage,
		sortableColumnIds: TacotsOnboardingSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.sort,
	});

	const exitQuery = useTrackerDataQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.perPage,
		sortableColumnIds: TacotsExitSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.sort,
	});

	const [search] = useQueryState("tacotsTrackerDataSearch", parseAsString.withDefault(""));

	const trackingQueryResult = useQuery(
		tacotsTrackingTrackerDataQuery({
			limit: trackingQuery.limit,
			page: trackingQuery.page,
			...(trackingQuery.orderBy && { orderBy: trackingQuery.orderBy }),
			...(search && { search }),
			...(trackingQuery.sortBy && { sortBy: trackingQuery.sortBy }),
		})
	);

	const onboardingQueryResult = useQuery(
		tacotsOnboardingTrackerDataQuery({
			limit: onboardingQuery.limit,
			page: onboardingQuery.page,
			...(onboardingQuery.orderBy && { orderBy: onboardingQuery.orderBy }),
			...(search && { search }),
			...(onboardingQuery.sortBy && { sortBy: onboardingQuery.sortBy }),
		})
	);

	const exitQueryResult = useQuery(
		tacotsExitTrackerDataQuery({
			limit: exitQuery.limit,
			page: exitQuery.page,
			...(exitQuery.orderBy && { orderBy: exitQuery.orderBy }),
			...(search && { search }),
			...(exitQuery.sortBy && { sortBy: exitQuery.sortBy }),
		})
	);

	const trackingRecords = trackingQueryResult.data?.data ?? [];
	const onboardingRecords = onboardingQueryResult.data?.data ?? [];
	const exitRecords = exitQueryResult.data?.data ?? [];

	const stats = getTrackerDataStats({
		completedRecords: exitRecords.length,
		records: [...trackingRecords, ...onboardingRecords, ...exitRecords],
	});

	const trackingTable = useDataTable<TacotsTrackingRecord>({
		columns: trackingColumns,
		data: trackingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: trackingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking,
	});

	const onboardingTable = useDataTable<TacotsOnboardingRecord>({
		columns: onboardingColumns,
		data: onboardingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: onboardingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding,
	});

	const exitTable = useDataTable<TacotsExitRecord>({
		columns: exitColumns,
		data: exitRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: exitQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.exit,
	});

	const trackingDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("tracking"));
	const onboardingDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("onboarding"));
	const exitDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("exit"));

	return (
		<>
			<TrackerDataStats stats={stats} />
			<TrackerDataTableSection
				color="yellow"
				count={trackingRecords.length}
				isLoading={trackingQueryResult.isPending}
				label="TACOTS - Student Tracking"
				searchQueryKey="tacotsTrackerDataSearch"
				sortOptions={TACOTS_TRACKING_SORT_OPTIONS}
				table={trackingTable.table}
				onDownload={() => trackingDownloadMutation.mutate()}
			/>
			<TrackerDataTableSection
				color="yellow"
				count={onboardingRecords.length}
				isLoading={onboardingQueryResult.isPending}
				label="TACOTS - Beneficiary Onboarding"
				searchQueryKey="tacotsTrackerDataSearch"
				sortOptions={TACOTS_ONBOARDING_SORT_OPTIONS}
				table={onboardingTable.table}
				onDownload={() => onboardingDownloadMutation.mutate()}
			/>
			<TrackerDataTableSection
				color="red"
				count={exitRecords.length}
				isLoading={exitQueryResult.isPending}
				label="TACOTS - Exit Completion"
				searchQueryKey="tacotsTrackerDataSearch"
				sortOptions={TACOTS_EXIT_SORT_OPTIONS}
				table={exitTable.table}
				onDownload={() => exitDownloadMutation.mutate()}
			/>
		</>
	);
}

function OutreachTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const columns = useOutreachColumns({ onViewMore });
	const queryState = useTrackerDataQueryState({
		pageKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.page,
		perPageKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.perPage,
		sortableColumnIds: OutreachSortByOptions,
		sortKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.sort,
	});

	const [search] = useQueryState("outreachTrackerDataSearch", parseAsString.withDefault(""));

	const queryResult = useQuery(
		outreachTrackerDataQuery({
			limit: queryState.limit,
			page: queryState.page,
			...(queryState.orderBy && { orderBy: queryState.orderBy }),
			...(search && { search }),
			...(queryState.sortBy && { sortBy: queryState.sortBy }),
		})
	);

	const records = queryResult.data?.data ?? [];
	const stats = getTrackerDataStats({ completedRecords: 0, records });
	const table = useDataTable<OutreachRecord>({
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: queryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: OUTREACH_TRACKER_DATA_QUERY_KEYS,
	});

	const downloadMutation = useMutation(outreachTrackerDataDownloadMutation());

	return (
		<>
			<TrackerDataStats stats={stats} />
			<TrackerDataTableSection
				color="yellow"
				count={records.length}
				isLoading={queryResult.isPending}
				label="Cedar Outreach - Tracker Data"
				searchQueryKey="outreachTrackerDataSearch"
				sortOptions={OUTREACH_SORT_OPTIONS}
				table={table.table}
				onDownload={() => downloadMutation.mutate()}
			/>
		</>
	);
}

function CapacityBuildingTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const columns = useCapacityBuildingColumns({ onViewMore });
	const queryState = useTrackerDataQueryState({
		pageKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.page,
		perPageKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.perPage,
		sortableColumnIds: CapacityEvaluationSortByOptions,
		sortKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.sort,
	});

	const [search] = useQueryState("capacityTrackerDataSearch", parseAsString.withDefault(""));

	const queryResult = useQuery(
		capacityBuildingTrackerDataQuery({
			limit: queryState.limit,
			page: queryState.page,
			...(queryState.orderBy && { orderBy: queryState.orderBy }),
			...(search && { search }),
			...(queryState.sortBy && { sortBy: queryState.sortBy }),
		})
	);

	const records = queryResult.data?.data ?? [];
	const stats = getTrackerDataStats({ completedRecords: 0, records });
	const table = useDataTable<CapacityBuildingRecord>({
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: queryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: CAPACITY_TRACKER_DATA_QUERY_KEYS,
	});

	const downloadMutation = useMutation(capacityBuildingTrackerDataDownloadMutation());

	return (
		<>
			<TrackerDataStats stats={stats} />
			<TrackerDataTableSection
				color="yellow"
				count={records.length}
				isLoading={queryResult.isPending}
				label="Capacity Building Program Evaluation"
				searchQueryKey="capacityTrackerDataSearch"
				sortOptions={CAPACITY_SORT_OPTIONS}
				table={table.table}
				onDownload={() => downloadMutation.mutate()}
			/>
		</>
	);
}

function TrackerDataStats(props: {
	stats: ReadonlyArray<{ description: string; label: string; note: string; value: number | string }>;
}) {
	const { stats } = props;

	return (
		<section className="grid gap-4 lg:grid-cols-4 lg:gap-6">
			<For
				each={stats}
				renderItem={(stat) => (
					<Card.Root
						key={stat.label}
						className="rounded-[18px] border border-cedar-black/10 bg-cedar-white p-7
							lg:min-h-[140px] lg:px-8 lg:py-9"
					>
						<Card.Content>
							<Card.Title className="text-[30px] font-semibold text-cedar-black lg:text-[40px]">
								{stat.value}
							</Card.Title>
							<Card.Description className="mt-2 text-[14px] text-cedar-black/64 lg:text-[18px]">
								{stat.label}
							</Card.Description>
							<p
								className={cnMerge(
									"mt-1 text-[11px]",
									stat.description === "No change" && "text-cedar-black/36",
									stat.description !== "No change" && "text-cedar-yellow"
								)}
							>
								{stat.note}
							</p>
						</Card.Content>
					</Card.Root>
				)}
			/>
		</section>
	);
}

const useTrackerDataQueryState = <const TSortBy extends string>(props: {
	pageKey: string;
	perPageKey: string;
	sortableColumnIds: readonly TSortBy[];
	sortKey: string;
}) => {
	const { pageKey, perPageKey, sortableColumnIds, sortKey } = props;

	const sortableColumnIdSet = useMemo(() => {
		return new Set<string>(sortableColumnIds);
	}, [sortableColumnIds]);

	const [page] = useQueryState(pageKey, parseAsInteger.withDefault(1));
	const [limit] = useQueryState(perPageKey, parseAsInteger.withDefault(10));
	const [sorting] = useQueryState(
		sortKey,
		getSortingStateParser<Record<TSortBy, unknown>>(sortableColumnIdSet).withDefault([])
	);

	const activeSort = sorting[0];

	return useMemo(() => {
		return {
			limit,
			orderBy: getOrderBy(activeSort),
			page,
			sortBy: activeSort?.id,
		};
	}, [activeSort, limit, page]);
};

const getOrderBy = (sort: { desc: boolean } | undefined): TrackerDataOrderBy => {
	if (!sort) return;

	return sort.desc ? "desc" : "asc";
};

function TrackerDataTableSection<TRecord extends TrackerRecord>(props: {
	color: "red" | "yellow";
	count: number;
	isLoading: boolean;
	label: string;
	onDownload: () => void;
	searchQueryKey: string;
	sortOptions?: ReadonlyArray<{ label: string; value: string }>;
	table: ReturnType<typeof useDataTable<TRecord>>["table"];
}) {
	const {
		color,
		count,
		isLoading,
		label,
		onDownload,
		searchQueryKey,
		sortOptions = EMPTY_SORT_OPTIONS,
		table,
	} = props;

	return (
		<Card.Root as="section" className="overflow-hidden rounded-[20px] bg-cedar-white">
			<Card.Header className="flex flex-row items-center justify-between gap-4 px-5 pt-5 pb-4 lg:px-7">
				<div className="flex items-center gap-4">
					<span
						className={cnMerge(
							"h-[52px] w-2 rounded-full",
							color === "yellow" ? "bg-cedar-yellow" : "bg-cedar-red"
						)}
					/>
					<div className="min-w-0">
						<Card.Title className="text-[16px] font-semibold text-cedar-black lg:text-[18px]">
							{label}
						</Card.Title>
						<Card.Description className="mt-1 text-[12px] text-cedar-black/64 lg:text-[14px]">
							{count} {count === 1 ? "Submission" : "Submissions"}
						</Card.Description>
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
			</Card.Header>

			<Card.Content className="border-y border-cedar-black/8 bg-cedar-grey p-5 lg:px-7">
				<TrackerDataTableToolbar
					searchQueryKey={searchQueryKey}
					sortOptions={sortOptions}
					table={table}
				/>
			</Card.Content>

			<Card.Footer>
				<DataTable
					isLoading={isLoading}
					table={table}
					className="gap-0 overflow-x-auto rounded-none border-0 text-[13px]
						**:data-[slot=table-cell]:px-5 **:data-[slot=table-cell]:py-4
						**:data-[slot=table-container]:min-w-[900px]
						**:data-[slot=table-container]:overflow-x-auto **:data-[slot=table-head]:h-12
						**:data-[slot=table-head]:px-5 **:data-[slot=table-head]:text-[12px]
						**:data-[slot=table-head]:font-semibold **:data-[slot=table-head]:text-cedar-black/80
						**:data-[slot=table-row]:border-cedar-black/10
						**:data-[slot=table-row]:hover:bg-transparent [&_table]:border-0
						[&>div:first-child]:rounded-none [&>div:first-child]:border-0 [&>div:last-child]:px-1
						[&>div:last-child]:py-3 lg:[&>div:last-child]:px-5"
				/>
			</Card.Footer>
		</Card.Root>
	);
}

function TrackerDataTableToolbar<TRecord extends TrackerRecord>(props: {
	searchQueryKey: string;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	table: ReturnType<typeof useDataTable<TRecord>>["table"];
}) {
	const { searchQueryKey, sortOptions, table } = props;

	const queryKeys = table.options.meta?.queryKeys;
	const pageQueryKey = queryKeys?.page ?? "page";
	const sortQueryKey = queryKeys?.sort ?? "sort";

	const [search, setSearch] = useQueryState(searchQueryKey, parseAsString.withDefault(""));
	const [, setPage] = useQueryState(pageQueryKey, parseAsInteger.withDefault(1));
	const [sort, setSort] = useQueryState(sortQueryKey, parseAsString);
	const currentSort = table.getState().sorting[0];
	const sortBy = currentSort?.id ?? sort?.split(".")[0] ?? "";
	const orderBy = getOrderBy(currentSort) ?? sort?.split(".")[1] ?? "";

	const handleResetFilters = () => {
		table.setSorting([]);
		table.setPageIndex(0);
		void setSearch(null);
		void setSort(null);
		void setPage(1);
	};

	return (
		<div className="flex flex-wrap items-center gap-3 lg:gap-4">
			<label
				className="flex h-[40px] w-full max-w-[430px] items-center gap-3 rounded-[12px] bg-cedar-white
					px-4 text-[12px] text-cedar-black/64 lg:h-[40px] lg:max-w-[220px]"
			>
				<input
					className="w-full bg-transparent outline-none placeholder:text-cedar-black/36"
					placeholder="search this section"
					value={search}
					onChange={(event) => {
						void setSearch(event.target.value || null);
						void setPage(1);
					}}
				/>
			</label>

			{sortOptions.length > 0 && (
				<>
					<ToolbarSelect
						placeholder="Sort By"
						options={sortOptions}
						value={sortBy}
						onValueChange={(value) => {
							void setSort(value || null);
							void setPage(1);
						}}
					/>
					<ToolbarSelect
						placeholder="Order By"
						options={TOOLBAR_ORDER_OPTIONS}
						value={orderBy}
						onValueChange={(value) => {
							if (!sortBy) {
								return;
							}

							void setSort(`${sortBy}.${value}`);
							void setPage(1);
						}}
					/>
				</>
			)}

			<Button
				size="medium"
				type="button"
				className="h-[40px] rounded-[12px] border border-cedar-black/10 bg-cedar-white px-4 text-[12px]
					text-cedar-black/64 lg:h-[40px] lg:px-4 lg:text-[12px]"
				onClick={handleResetFilters}
			>
				Reset Filters
			</Button>
		</div>
	);
}

function ToolbarSelect(props: {
	onValueChange: (value: string) => void;
	options: ReadonlyArray<{ label: string; value: string }>;
	placeholder: string;
	value: string;
}) {
	const { onValueChange, options, placeholder, value } = props;

	return (
		<Select.Root value={value} onValueChange={onValueChange}>
			<Select.Trigger
				className="h-[40px] w-[110px] rounded-[12px] border border-cedar-black/10 bg-cedar-white px-4
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

const useAshTrackingColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<AshTrackingRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.firstName),
			getTextColumn("surname", "SURNAME", (row) => row.surname),
			getTextColumn("academicSession", "ACADEMIC SESSION", (row) => row.academicSession, false),
			getTextColumn("term", "TERM", (row) => row.term, false),
			getTextColumn("schoolName", "SCHOOL NAME", (row) => row.schoolName, false),
			getTextColumn("mentorName", "ASSIGNED MENTOR", (row) => row.mentorName, false),
			getActionsColumn(
				{ kind: "tracking", program: "ash" },
				onViewMore,
				(row) => getFullName(row),
				"ASH - Termly Tracking Form"
			),
		];
	}, [onViewMore]);
};

const useAshAttendanceColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<AshAttendanceRecord>>>(() => {
		return [
			getTextColumn("sessionDate", "DATE", (row) => row.sessionDate, false),
			getTextColumn(
				"studentsInAttendance",
				"STUDENTS IN ATTENDANCE",
				(row) => formatDetailValue(row.studentsInAttendance),
				false
			),
			getTextColumn(
				"studentsMentored",
				"STUDENTS MENTORED",
				(row) => formatDetailValue(row.studentsMentored),
				false
			),
			getTextColumn(
				"sessionsConducted",
				"SESSIONS HAD",
				(row) => formatDetailValue(row.sessionsConducted),
				false
			),
			getTextColumn(
				"volunteersInAttendance",
				"VOLUNTEERS IN ATTENDANCE",
				(row) => row.volunteersInAttendance,
				false
			),
			getTextColumn("sessionDetails", "SPECIFY SESSION", (row) => row.sessionDetails, false, {
				truncate: true,
			}),
			getActionsColumn(
				{ kind: "attendance", program: "ash" },
				onViewMore,
				() => "ASH Attendance Record",
				"ASH - Weekly activity & Attendance"
			),
		];
	}, [onViewMore]);
};

const useAshExitColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<AshExitRecord>>>(() => {
		return [
			getTextColumn("studentName", "STUDENT NAME", (row) => getFullName(row)),
			getTextColumn("ageAtExit", "AGE AT EXIT", (row) => row.ageAtExit, false),
			getTextColumn("schoolName", "SCHOOL NAME", (row) => row.schoolName, false),
			getTextColumn("classAtExit", "CLASS AT EXIT", (row) => row.classAtExit, false),
			getTextColumn("durationInProgram", "DURATION IN PROGRAM", (row) => row.durationInProgram, false),
			getTextColumn("facilitatorName", "FACILITATOR NAME", (row) => row.facilitatorName, false),
			getTextColumn("exitDate", "EXIT DATE", (row) => row.exitDate, false),
			getActionsColumn(
				{ kind: "exit", program: "ash" },
				onViewMore,
				(row) => getFullName(row),
				"ASH - Exit Submitted data"
			),
		];
	}, [onViewMore]);
};

const useTacotsTrackingColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<TacotsTrackingRecord>>>(() => {
		return [
			getTextColumn("fullName", "FULL NAME", (row) => getFullName(row)),
			getTextColumn("academicSession", "ACADEMIC SESSION", (row) => row.academicSession, false),
			getTextColumn("academicTerm", "TERM", (row) => row.academicTerm, false),
			getTextColumn("region", "REGION", (row) => row.region, false),
			getTextColumn("assessmentPeriod", "ASSESSMENT PERIOD", (row) => row.assessmentPeriod, false),
			getTextColumn("studentAveragePct", "STUDENT AVERAGE(%)", (row) => row.studentAveragePct, false),
			getActionsColumn(
				{ kind: "tracking", program: "tacots" },
				onViewMore,
				(row) => getFullName(row),
				"TACOTS - Student Tracking"
			),
		];
	}, [onViewMore]);
};

const useTacotsOnboardingColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<TacotsOnboardingRecord>>>(() => {
		return [
			getTextColumn("fullName", "FULL NAME", (row) => getFullName(row)),
			getTextColumn("onboardingDate", "ONBOARDING DATE", (row) => row.onboardingDate, false),
			getTextColumn("healthStatus", "GEN. HEALTH STATUS", (row) => row.generalHealthStatus, false),
			getTextColumn("schoolName", "ENROLLED SCHOOL NAME", (row) => row.enrolledSchoolName, false),
			getTextColumn("schoolState", "ENROLLED SCHOOL STATE", (row) => row.enrolledSchoolState, false),
			getTextColumn("currentClass", "ENROLLED CLASS", (row) => row.enrolledClass, false),
			getActionsColumn(
				{ kind: "onboarding", program: "tacots" },
				onViewMore,
				(row) => getFullName(row),
				"TACOTS - Beneficiary Onboarding"
			),
		];
	}, [onViewMore]);
};

const useTacotsExitColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<TacotsExitRecord>>>(() => {
		return [
			getTextColumn("studentName", "STUDENT NAME", (row) => getFullName(row)),
			getTextColumn("yearOfExit", "YEAR OF EXIT", (row) => row.yearOfExit, false),
			getTextColumn(
				"schoolAttended",
				"SCHOOL ATTENDED",
				(row) => row.schoolAttendedDuringProgram,
				false
			),
			getTextColumn(
				"educationAttained",
				"HIGHEST LEVEL OF EDU. ATTAINED",
				(row) => row.highestEducationAttained,
				false
			),
			getTextColumn("reason", "REASONS FOR EXIT", (row) => row.exitReason, false),
			getActionsColumn(
				{ kind: "exit", program: "tacots" },
				onViewMore,
				(row) => getFullName(row),
				"TACOTS - Exit Completion"
			),
		];
	}, [onViewMore]);
};

const useOutreachColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<OutreachRecord>>>(() => {
		return [
			getTextColumn("startDate", "START DATE", (row) => row.outreachStartDate, false),
			getTextColumn("endDate", "END DATE", (row) => row.outreachEndDate, false),
			getTextColumn("outreachState", "OUTREACH STATE", (row) => row.outreachState, false),
			getTextColumn("volunteers", "NUM. OF VOLUNTEERS", (row) => row.numVolunteers, false),
			getTextColumn("beneficiaries", "NUM. OF BENEFICIARIES", (row) => row.numBeneficiaries, false),
			getTextColumn(
				"outreachType",
				"OUTREACH TYPE",
				(row) => formatDetailValue(row.outreachType),
				false
			),
			getActionsColumn(
				{ kind: "tracker", program: "outreaches" },
				onViewMore,
				() => "Cedar Outreach Tracker",
				"Cedar Outreach - Tracker Data"
			),
		];
	}, [onViewMore]);
};

const useCapacityBuildingColumns = (props: { onViewMore: (record: SelectedTrackerRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<CapacityBuildingRecord>>>(() => {
		return [
			getTextColumn("programName", "PROGRAM NAME", (row) => row.programName),
			getTextColumn("programType", "PROGRAM TYPE", (row) => row.programType, false),
			getTextColumn("programDate", "PROGRAM DATE", (row) => row.programDate, false),
			getTextColumn("location", "LOCATION", (row) => row.location, false),
			getTextColumn("participants", "NO. OF PARTICIPANTS", (row) => row.numberOfParticipants, false),
			getTextColumn(
				"objectiveAchievement",
				"OBJECTIVE ACHIEVEMENT",
				(row) => row.objectiveAchievement,
				false
			),
			getActionsColumn(
				{ kind: "evaluation", program: "capacity-building" },
				onViewMore,
				(row) => row.programName,
				"Capacity Building Program Evaluation"
			),
		];
	}, [onViewMore]);
};

const getTextColumn = <TRecord extends TrackerRecord>(
	id: string,
	label: string,
	accessorFn: (row: TRecord) => unknown,
	enableColumnFilter = true,
	options?: { truncate?: boolean }
): ColumnDef<TRecord> => {
	return {
		accessorFn,
		cell: ({ row }) => (
			<span
				className={cnMerge(
					"text-[13px] text-cedar-black/72",
					options?.truncate && "block max-w-[220px] truncate"
				)}
			>
				{formatDetailValue(row.getValue(id))}
			</span>
		),
		enableColumnFilter,
		header: ({ column }) => <DataTableColumnHeader column={column} label={label} />,
		id,
		meta: {
			label,
			placeholder: "search this section",
			variant: "text",
		},
	};
};

const getActionsColumn = <TRecord extends TrackerRecord>(
	target: TrackerActionTarget,
	onViewMore: (record: SelectedTrackerRecord) => void,
	getTitle: (record: TRecord) => string,
	dialogTitle: string
): ColumnDef<TRecord> => {
	return {
		cell: ({ row }) => (
			<TrackerRowActions
				record={row.original}
				target={target}
				onViewMore={() =>
					onViewMore(
						getSelectedTrackerRecord(target, row.original.id, dialogTitle, getTitle(row.original))
					)
				}
			/>
		),
		enableHiding: false,
		header: "ACTIONS",
		id: "actions",
	};
};

function TrackerRowActions<TRecord extends TrackerRecord>(props: {
	onViewMore: () => void;
	record: TRecord;
	target: TrackerActionTarget;
}) {
	const { onViewMore, record, target } = props;
	const queryClient = useQueryClient();

	const ashAttendanceDelete = useMutation(ashAttendanceDeleteMutation(record.id));
	const ashExitDelete = useMutation(ashExitDeleteMutation(record.id));
	const ashTrackingDelete = useMutation(ashTrackingDeleteMutation(record.id));
	const tacotsExitDelete = useMutation(tacotsExitDeleteMutation(record.id));
	const tacotsOnboardingDelete = useMutation(tacotsOnboardingDeleteMutation(record.id));
	const tacotsTrackingDelete = useMutation(tacotsTrackingDeleteMutation(record.id));
	const outreachDelete = useMutation(outreachDeleteMutation(record.id));
	const capacityDelete = useMutation(capacityBuildingDeleteMutation(record.id));

	const invalidateListQueries = async () => {
		if (target.program === "ash" && target.kind === "attendance") {
			await queryClient.invalidateQueries({ queryKey: ashAttendanceTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "ash" && target.kind === "exit") {
			await queryClient.invalidateQueries({ queryKey: ashExitTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "ash" && target.kind === "tracking") {
			await queryClient.invalidateQueries({ queryKey: ashTrackingTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "tacots" && target.kind === "exit") {
			await queryClient.invalidateQueries({ queryKey: tacotsExitTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "tacots" && target.kind === "onboarding") {
			await queryClient.invalidateQueries({ queryKey: tacotsOnboardingTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "tacots" && target.kind === "tracking") {
			await queryClient.invalidateQueries({ queryKey: tacotsTrackingTrackerDataQuery().queryKey });
			return;
		}

		if (target.program === "outreaches") {
			await queryClient.invalidateQueries({ queryKey: outreachTrackerDataQuery().queryKey });
			return;
		}

		await queryClient.invalidateQueries({ queryKey: capacityBuildingTrackerDataQuery().queryKey });
	};

	const handleDelete = () => {
		if (target.program === "ash" && target.kind === "attendance") {
			ashAttendanceDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "ash" && target.kind === "exit") {
			ashExitDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "ash" && target.kind === "tracking") {
			ashTrackingDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "exit") {
			tacotsExitDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "onboarding") {
			tacotsOnboardingDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "tracking") {
			tacotsTrackingDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (target.program === "outreaches") {
			outreachDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		capacityDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="rounded-[10px] border border-cedar-black/16 px-4 py-2 text-[13px]
					text-cedar-black/72 transition-colors hover:bg-cedar-grey"
			>
				Actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" className="w-[150px] rounded-[20px] p-3">
				<DropdownMenu.Item className="justify-center" onClick={onViewMore}>
					View More
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="justify-center text-cedar-red focus:text-cedar-red"
					onClick={handleDelete}
				>
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

function TrackerDataDetailsDialog(props: {
	onOpenChange: (record: SelectedTrackerRecord | null) => void;
	selectedRecord: SelectedTrackerRecord | null;
}) {
	const { onOpenChange, selectedRecord } = props;

	const selectedRecordId = selectedRecord?.id ?? "";

	const ashAttendanceDetailQueryResult = useQuery({
		...ashAttendanceTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "ash" && selectedRecord.kind === "attendance",
	});

	const ashExitDetailQueryResult = useQuery({
		...ashExitTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "ash" && selectedRecord.kind === "exit",
	});

	const ashTrackingDetailQueryResult = useQuery({
		...ashTrackingTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "ash" && selectedRecord.kind === "tracking",
	});

	const tacotsExitDetailQueryResult = useQuery({
		...tacotsExitTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "tacots" && selectedRecord.kind === "exit",
	});

	const tacotsOnboardingDetailQueryResult = useQuery({
		...tacotsOnboardingTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "tacots" && selectedRecord.kind === "onboarding",
	});

	const tacotsTrackingDetailQueryResult = useQuery({
		...tacotsTrackingTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "tacots" && selectedRecord.kind === "tracking",
	});

	const outreachDetailQueryResult = useQuery({
		...outreachTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "outreaches",
	});

	const capacityDetailQueryResult = useQuery({
		...capacityBuildingTrackerDataDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "capacity-building",
	});

	const record =
		ashAttendanceDetailQueryResult.data?.data
		?? ashExitDetailQueryResult.data?.data
		?? ashTrackingDetailQueryResult.data?.data
		?? tacotsExitDetailQueryResult.data?.data
		?? tacotsOnboardingDetailQueryResult.data?.data
		?? tacotsTrackingDetailQueryResult.data?.data
		?? outreachDetailQueryResult.data?.data
		?? capacityDetailQueryResult.data?.data;

	const rows = getDetailRows(record);

	return (
		<DialogAnimated.Root
			open={Boolean(selectedRecord)}
			onOpenChange={(open) => !open && onOpenChange(null)}
		>
			<DialogAnimated.Content
				withCloseButton={false}
				className="flex max-h-[92vh] w-[min(calc(100vw-32px),760px)] flex-col overflow-hidden
					rounded-[28px] border-0 bg-cedar-white p-0 lg:w-[760px]"
			>
				{selectedRecord && (
					<>
						<DialogAnimated.Header
							className="shrink-0 flex-row items-start justify-between gap-6 border-b
								border-cedar-black/10 px-7 pt-7 pb-6 text-left lg:px-10 lg:pt-10"
						>
							<div>
								<DialogAnimated.Title className="text-[22px] text-cedar-black">
									{selectedRecord.title}
								</DialogAnimated.Title>
								<DialogAnimated.Description className="mt-1 text-[16px] text-cedar-black/64">
									Submitted - {getRecordDate(record)}
								</DialogAnimated.Description>
							</div>
						</DialogAnimated.Header>

						<ForWithWrapper
							className="grow overflow-x-hidden overflow-y-auto px-7 py-4 lg:px-10"
							each={rows}
							renderItem={(row) => (
								<li
									key={row.label}
									className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-6
										border-b border-cedar-black/10 py-3 text-[15px] last:border-b-0
										lg:text-[17px]"
								>
									<span className="min-w-0 wrap-break-word text-cedar-black/72">{row.label}</span>
									<span
										className="min-w-0 text-right font-medium wrap-break-word
											text-cedar-black/72"
									>
										{row.value}
									</span>
								</li>
							)}
						/>

						<DialogAnimated.Footer
							className="shrink-0 border-t border-cedar-black/10 px-7 pt-5 pb-7 lg:px-10 lg:pb-10"
						>
							<DialogAnimated.Close
								className="h-12 rounded-[12px] border border-cedar-red px-6 text-[15px] font-medium
									text-cedar-red transition-colors hover:bg-cedar-red hover:text-cedar-white"
							>
								Close
							</DialogAnimated.Close>
						</DialogAnimated.Footer>
					</>
				)}
			</DialogAnimated.Content>
		</DialogAnimated.Root>
	);
}

const HIDDEN_DETAIL_KEYS = new Set(["deletedAt", "id", "updatedAt"]);

const getDetailRows = (record: TrackerRecord | undefined) => {
	if (!record) {
		return [];
	}

	return Object.entries(record)
		.filter(([key]) => !HIDDEN_DETAIL_KEYS.has(key))
		.map(([key, value]) => ({ label: labelizeKey(key), value: formatDetailValue(value) }));
};

const labelizeKey = (key: string) => {
	return key
		.replaceAll(/([A-Z])/g, " $1")
		.replaceAll(/[_-]/g, " ")
		.replace(/^./, (value) => value.toUpperCase());
};

const getRecordDate = (
	record:
		| {
				createdAt?: string;
				dateSubmitted?: string;
				exitDate?: string;
				onboardingDate?: string;
				outreachStartDate?: string;
				programDate?: string;
				sessionDate?: string;
				submissionDate?: string;
		  }
		| undefined
) => {
	const value =
		record?.createdAt
		?? record?.submissionDate
		?? record?.sessionDate
		?? record?.exitDate
		?? record?.onboardingDate
		?? record?.outreachStartDate
		?? record?.programDate
		?? record?.dateSubmitted;

	if (!value) {
		return EMPTY_VALUE_PLACEHOLDER;
	}

	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
};

const getSelectedTrackerRecord = (
	target: TrackerActionTarget,
	id: string,
	dialogTitle: string,
	recordTitle: string
): SelectedTrackerRecord => {
	const title = `${dialogTitle}${recordTitle ? ` - ${recordTitle}` : ""}`;

	if (target.program === "ash") {
		return { id, kind: target.kind, program: target.program, title };
	}

	if (target.program === "tacots") {
		return { id, kind: target.kind, program: target.program, title };
	}

	if (target.program === "outreaches") {
		return { id, kind: target.kind, program: target.program, title };
	}

	return { id, kind: target.kind, program: target.program, title };
};

const getFullName = (record: { firstName: string; surname: string }) => {
	return `${record.firstName} ${record.surname}`;
};

const getPerformanceMetric = (record: TrackerRecord) => {
	if ("studentAveragePct" in record) {
		return record.studentAveragePct;
	}

	if ("posttestAverage" in record && typeof record.posttestAverage === "number") {
		return record.posttestAverage;
	}

	if ("schoolAverage" in record && typeof record.schoolAverage === "number") {
		return record.schoolAverage;
	}

	return void 0;
};

const formatDetailValue = (value: unknown): string => {
	if (value === null || value === undefined || value === "") {
		return EMPTY_VALUE_PLACEHOLDER;
	}

	if (typeof value === "boolean") {
		return value ? "True" : "False";
	}

	if (Array.isArray(value)) {
		return value.map((item) => formatDetailValue(item)).join(", ");
	}

	if (typeof value === "number" || typeof value === "string") {
		return String(value);
	}

	return EMPTY_VALUE_PLACEHOLDER;
};

const getTrackerDataStats = (props: { completedRecords: number; records: TrackerRecord[] }) => {
	const { completedRecords, records } = props;

	const riskCount = records.filter((record) => isHighRiskRecord(record)).length;
	const averageMetric = getAverageMetric(records);

	return [
		{
			description: "this week",
			label: "Total Records",
			note: `+${records.length} this week`,
			value: records.length,
		},
		{ description: "review", label: "High-risk beneficiary", note: "Requires review", value: riskCount },
		{
			description: "attendance",
			label: "Avg. Attendance",
			note: "Across all programs",
			value: `${averageMetric}%`,
		},
		{ description: "No change", label: "Completed", note: "No change", value: completedRecords },
	] as const;
};

const isHighRiskRecord = (record: TrackerRecord) => {
	const value = getPerformanceMetric(record);

	return value !== undefined && value < 50;
};

const getAverageMetric = (records: TrackerRecord[]) => {
	const values = records
		.map((record) => getPerformanceMetric(record))
		.filter((value) => value !== undefined);

	if (values.length === 0) {
		return 0;
	}

	const total = values.reduce((sum, value) => sum + value, 0);

	return Math.round(total / values.length);
};

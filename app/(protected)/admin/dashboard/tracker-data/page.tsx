"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { DialogAnimated, TabsAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { DropdownMenu } from "@/components/ui";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
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
	type AshTrackingTrackerDataQueryResult,
	type CapacityBuildingTrackerDataQueryResult,
	type OutreachTrackerDataQueryResult,
	type TacotsExitTrackerDataQueryResult,
	type TacotsOnboardingTrackerDataQueryResult,
	type TacotsTrackingTrackerDataQueryResult,
} from "@/lib/react-query/queryOptions";
import { cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import { DashboardDataStats } from "../-components/DashboardDataStats";
import {
	DashboardDataTableSection,
	formatDashboardDetailValue,
	getDashboardDetailRows,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
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
		search: "ashAttendanceSearch",
		sort: "ashAttendanceSort",
	},
	exit: {
		filters: "ashExitFilters",
		joinOperator: "ashExitJoinOperator",
		page: "ashExitPage",
		perPage: "ashExitPerPage",
		search: "ashExitSearch",
		sort: "ashExitSort",
	},
	tracking: {
		filters: "ashTrackingFilters",
		joinOperator: "ashTrackingJoinOperator",
		page: "ashTrackingPage",
		perPage: "ashTrackingPerPage",
		search: "ashTrackerDataSearch",
		sort: "ashTrackingSort",
	},
} as const satisfies Record<AshTrackerDataKind, QueryKeys>;

const TACOTS_TRACKER_DATA_QUERY_KEYS = {
	exit: {
		filters: "tacotsExitFilters",
		joinOperator: "tacotsExitJoinOperator",
		page: "tacotsExitPage",
		perPage: "tacotsExitPerPage",
		search: "tacotsExitSearch",
		sort: "tacotsExitSort",
	},
	onboarding: {
		filters: "tacotsOnboardingFilters",
		joinOperator: "tacotsOnboardingJoinOperator",
		page: "tacotsOnboardingPage",
		perPage: "tacotsOnboardingPerPage",
		search: "tacotsOnboardingSearch",
		sort: "tacotsOnboardingSort",
	},
	tracking: {
		filters: "tacotsTrackingFilters",
		joinOperator: "tacotsTrackingJoinOperator",
		page: "tacotsTrackingPage",
		perPage: "tacotsTrackingPerPage",
		search: "tacotsTrackerDataSearch",
		sort: "tacotsTrackingSort",
	},
} as const satisfies Record<TacotsTrackerDataKind, QueryKeys>;

const OUTREACH_TRACKER_DATA_QUERY_KEYS = {
	filters: "outreachTrackerDataFilters",
	joinOperator: "outreachTrackerDataJoinOperator",
	page: "outreachTrackerDataPage",
	perPage: "outreachTrackerDataPerPage",
	search: "outreachTrackerDataSearch",
	sort: "outreachTrackerDataSort",
} as const satisfies QueryKeys;

const CAPACITY_TRACKER_DATA_QUERY_KEYS = {
	filters: "capacityTrackerDataFilters",
	joinOperator: "capacityTrackerDataJoinOperator",
	page: "capacityTrackerDataPage",
	perPage: "capacityTrackerDataPerPage",
	search: "capacityTrackerDataSearch",
	sort: "capacityTrackerDataSort",
} as const satisfies QueryKeys;

const ASH_TRACKING_SORT_OPTIONS = [
	{ label: "Academic Session", value: "academicSession" },
	{ label: "School Name", value: "schoolName" },
	{ label: "Term", value: "term" },
	{ label: "Assigned Mentor", value: "mentorName" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof AshTrackingRecordSortByOptions)[number];
}>;

const ASH_EXIT_SORT_OPTIONS = [
	{ label: "Age at Exit", value: "ageAtExit" },
	{ label: "School Name", value: "schoolName" },
	{ label: "Class at Exit", value: "classAtExit" },
	{ label: "Duration in Program", value: "durationInProgram" },
	{ label: "Facilitator Name", value: "facilitatorName" },
	{ label: "Exit Date", value: "exitDate" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{ label: string; value: (typeof AshExitSortByOptions)[number] }>;

const TACOTS_TRACKING_SORT_OPTIONS = [
	{ label: "Academic Session", value: "academicSession" },
	{ label: "Term", value: "academicTerm" },
	{ label: "Region", value: "region" },
	{ label: "Assessment Period", value: "assessmentPeriod" },
	{ label: "Student Average", value: "studentAveragePct" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof TacotsTrackingRecordSortByOptions)[number];
}>;

const TACOTS_ONBOARDING_SORT_OPTIONS = [
	{ label: "Current School", value: "enrolledSchoolName" },
	{ label: "Date of Onboarding", value: "onboardingDate" },
	{ label: "General Health Status", value: "generalHealthStatus" },
	{ label: "State", value: "enrolledSchoolState" },
	{ label: "Class", value: "enrolledClass" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof TacotsOnboardingSortByOptions)[number];
}>;

const TACOTS_EXIT_SORT_OPTIONS = [
	{ label: "Year of Exit", value: "yearOfExit" },
	{ label: "School Attended", value: "schoolAttendedDuringProgram" },
	{ label: "Highest Education Attained", value: "highestEducationAttained" },
	{ label: "Reason for Exit", value: "exitReason" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof TacotsExitSortByOptions)[number];
}>;

const OUTREACH_SORT_OPTIONS = [
	{ label: "Start Date", value: "outreachStartDate" },
	{ label: "End Date", value: "outreachEndDate" },
	{ label: "State", value: "outreachState" },   
	{ label: "Number of Beneficiaries", value: "numBeneficiaries" },
	{ label: "Number of Volunteers", value: "numVolunteers" },
	{ label: "Outreach Type", value: "outreachType" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{ label: string; value: (typeof OutreachSortByOptions)[number] }>;

const CAPACITY_SORT_OPTIONS = [
	{ label: "Program Name", value: "programName" },
	{ label: "Program Type", value: "programType" },
	{ label: "Program Date", value: "programDate" },
	{ label: "Location", value: "location" },
	{ label: "Number of Participants", value: "numberOfParticipants" },
	{ label: "Program Coordinator", value: "programCoordinator" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof CapacityEvaluationSortByOptions)[number];
}>;

type AshAttendanceRecord = AshAttendanceTrackerDataQueryResult["data"][number];
type AshExitRecord = AshExitTrackerDataQueryResult["data"][number];
type AshTrackingRecord = AshTrackingTrackerDataQueryResult["data"][number];
type CapacityBuildingRecord = CapacityBuildingTrackerDataQueryResult["data"][number];
type OutreachRecord = OutreachTrackerDataQueryResult["data"][number];
type TacotsExitRecord = TacotsExitTrackerDataQueryResult["data"][number];
type TacotsOnboardingRecord = TacotsOnboardingTrackerDataQueryResult["data"][number];
type TacotsTrackingRecord = TacotsTrackingTrackerDataQueryResult["data"][number];

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

			<TabsAnimated.Root defaultValue="ash" className="gap-6">
				<div className="overflow-x-auto rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red",
							list: "h-12 min-w-[650px] rounded-[12px] bg-cedar-grey p-2",
						}}
					>
						<For
							each={TRACKER_DATA_TABS}
							renderItem={(tab) => (
								<TabsAnimated.Trigger
									key={tab.value}
									value={tab.value}
									className="px-5 text-cedar-black/85 data-[state=active]:text-cedar-white"
								>
									{tab.label}
								</TabsAnimated.Trigger>
							)}
						/>
					</TabsAnimated.List>
				</div>

				<TabsAnimated.ContentList className="flex flex-col gap-6">
					<TabsAnimated.Content value={TRACKER_DATA_TABS[0].value} className="flex flex-col gap-6">
						<AshTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_DATA_TABS[1].value} className="flex flex-col gap-6">
						<TacotsTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_DATA_TABS[2].value} className="flex flex-col gap-6">
						<OutreachTrackerDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_DATA_TABS[3].value} className="flex flex-col gap-6">
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

	const trackingColumns = useMemo<Array<ColumnDef<AshTrackingRecord>>>(() => {
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
				(row) => `${row.firstName} ${row.surname}`,
				"ASH - Termly Tracking Form"
			),
		];
	}, [onViewMore]);

	const attendanceColumns = useMemo<Array<ColumnDef<AshAttendanceRecord>>>(() => {
		return [
			getTextColumn("sessionDate", "DATE", (row) => row.sessionDate, false),
			getTextColumn(
				"studentsInAttendance",
				"STUDENTS IN ATTENDANCE",
				(row) => formatDashboardDetailValue(row.studentsInAttendance),
				false
			),
			getTextColumn(
				"studentsMentored",
				"STUDENTS MENTORED",
				(row) => formatDashboardDetailValue(row.studentsMentored),
				false
			),
			getTextColumn(
				"sessionsConducted",
				"SESSIONS HAD",
				(row) => formatDashboardDetailValue(row.sessionsConducted),
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

	const exitColumns = useMemo<Array<ColumnDef<AshExitRecord>>>(() => {
		return [
			getTextColumn("studentName", "STUDENT NAME", (row) => `${row.firstName} ${row.surname}`),
			getTextColumn("ageAtExit", "AGE AT EXIT", (row) => row.ageAtExit, false),
			getTextColumn("schoolName", "SCHOOL NAME", (row) => row.schoolName, false),
			getTextColumn("classAtExit", "CLASS AT EXIT", (row) => row.classAtExit, false),
			getTextColumn("durationInProgram", "DURATION IN PROGRAM", (row) => row.durationInProgram, false),
			getTextColumn("facilitatorName", "FACILITATOR NAME", (row) => row.facilitatorName, false),
			getTextColumn("exitDate", "EXIT DATE", (row) => row.exitDate, false),
			getActionsColumn(
				{ kind: "exit", program: "ash" },
				onViewMore,
				(row) => `${row.firstName} ${row.surname}`,
				"ASH - Exit Submitted data"
			),
		];
	}, [onViewMore]);

	const trackingQuery = useDashboardDataTableQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.perPage,
		sortableColumnIds: AshTrackingRecordSortByOptions,
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.tracking.sort,
	});

	const attendanceQuery = useDashboardDataTableQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.perPage,
		sortableColumnIds: [],
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.attendance.sort,
	});

	const exitQuery = useDashboardDataTableQueryState({
		pageKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.page,
		perPageKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.perPage,
		sortableColumnIds: AshExitSortByOptions,
		sortKey: ASH_TRACKER_DATA_QUERY_KEYS.exit.sort,
	});

	const [trackingSearch] = useQueryState(
		ASH_TRACKER_DATA_QUERY_KEYS.tracking.search,
		parseAsString.withDefault("")
	);
	const [attendanceSearch] = useQueryState(
		ASH_TRACKER_DATA_QUERY_KEYS.attendance.search,
		parseAsString.withDefault("")
	);
	const [exitSearch] = useQueryState(
		ASH_TRACKER_DATA_QUERY_KEYS.exit.search,
		parseAsString.withDefault("")
	);

	const trackingQueryResult = useQuery(
		ashTrackingTrackerDataQuery({
			limit: trackingQuery.limit,
			orderBy: trackingQuery.orderBy,
			page: trackingQuery.page,
			...(trackingSearch && { search: trackingSearch }),
			...(trackingQuery.sortBy && { sortBy: trackingQuery.sortBy }),
		})
	);

	const attendanceQueryResult = useQuery(
		ashAttendanceTrackerDataQuery({
			limit: attendanceQuery.limit,
			page: attendanceQuery.page,
			...(attendanceSearch && { search: attendanceSearch }),
		})
	);

	const exitQueryResult = useQuery(
		ashExitTrackerDataQuery({
			limit: exitQuery.limit,
			orderBy: exitQuery.orderBy,
			page: exitQuery.page,
			...(exitSearch && { search: exitSearch }),
			...(exitQuery.sortBy && { sortBy: exitQuery.sortBy }),
		})
	);

	const trackingRecords = trackingQueryResult.data?.data ?? [];
	const attendanceRecords = attendanceQueryResult.data?.data ?? [];
	const exitRecords = exitQueryResult.data?.data ?? [];
	const metadata = trackingQueryResult.data?.meta.metadata;

	const stats = [
		{
			label: "Total Records",
			value: metadata?.totalRecords ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "High-risk Students",
			value: metadata?.highRiskStudents ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Avg. Attendance",
			value: (() => {
				if (metadata?.avgAttendanceRate == null) return EMPTY_VALUE_PLACEHOLDER;

				return `${metadata.avgAttendanceRate}%`;
			})(),
		},
		{
			label: "Completed",
			value: metadata?.completed ?? EMPTY_VALUE_PLACEHOLDER,
		},
	] as const;

	const trackingTable = useDataTable<AshTrackingRecord>({
		columns: trackingColumns,
		data: trackingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: trackingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.tracking,
		sortableColumnIds: AshTrackingRecordSortByOptions,
	});

	const attendanceTable = useDataTable<AshAttendanceRecord>({
		columns: attendanceColumns,
		data: attendanceRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: attendanceQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.attendance,
		sortableColumnIds: [],
	});

	const exitTable = useDataTable<AshExitRecord>({
		columns: exitColumns,
		data: exitRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: exitQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_TRACKER_DATA_QUERY_KEYS.exit,
		sortableColumnIds: AshExitSortByOptions,
	});

	const trackingDownloadMutation = useMutation(ashTrackerDataDownloadMutation("tracking"));
	const attendanceDownloadMutation = useMutation(ashTrackerDataDownloadMutation("attendance"));
	const exitDownloadMutation = useMutation(ashTrackerDataDownloadMutation("exit"));

	return (
		<>
			<DashboardDataStats stats={stats} />
			<DashboardDataTableSection
				color="yellow"
				count={trackingRecords.length}
				isLoading={trackingQueryResult.isPending}
				isDownloadLoading={trackingDownloadMutation.isPending}
				label="ASH - Termly Tracking Form"
				sortOptions={ASH_TRACKING_SORT_OPTIONS}
				table={trackingTable.table}
				onDownload={() => trackingDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="yellow"
				count={attendanceRecords.length}
				isDownloadLoading={attendanceDownloadMutation.isPending}
				isLoading={attendanceQueryResult.isPending}
				label="ASH - Weekly activity & Attendance"
				table={attendanceTable.table}
				onDownload={() => attendanceDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="red"
				count={exitRecords.length}
				isDownloadLoading={exitDownloadMutation.isPending}
				isLoading={exitQueryResult.isPending}
				label="ASH - Exit Submitted data"
				sortOptions={ASH_EXIT_SORT_OPTIONS}
				table={exitTable.table}
				onDownload={() => exitDownloadMutation.mutate()}
			/>
		</>
	);
}

function TacotsTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const trackingColumns = useMemo<Array<ColumnDef<TacotsTrackingRecord>>>(() => {
		return [
			getTextColumn("fullName", "FULL NAME", (row) => `${row.firstName} ${row.surname}`),
			getTextColumn("academicSession", "ACADEMIC SESSION", (row) => row.academicSession, false),
			getTextColumn("academicTerm", "TERM", (row) => row.academicTerm, false),
			getTextColumn("region", "REGION", (row) => row.region, false),
			getTextColumn("assessmentPeriod", "ASSESSMENT PERIOD", (row) => row.assessmentPeriod, false),
			getTextColumn("studentAveragePct", "STUDENT AVERAGE(%)", (row) => row.studentAveragePct, false),
			getActionsColumn(
				{ kind: "tracking", program: "tacots" },
				onViewMore,
				(row) => `${row.firstName} ${row.surname}`,
				"TACOTS - Student Tracking"
			),
		];
	}, [onViewMore]);

	const onboardingColumns = useMemo<Array<ColumnDef<TacotsOnboardingRecord>>>(() => {
		return [
			getTextColumn("fullName", "FULL NAME", (row) => `${row.firstName} ${row.surname}`),
			getTextColumn("onboardingDate", "ONBOARDING DATE", (row) => row.onboardingDate, false),
			getTextColumn(
				"generalHealthStatus",
				"GEN. HEALTH STATUS",
				(row) => row.generalHealthStatus,
				false
			),
			getTextColumn(
				"enrolledSchoolName",
				"ENROLLED SCHOOL NAME",
				(row) => row.enrolledSchoolName,
				false
			),
			getTextColumn(
				"enrolledSchoolState",
				"ENROLLED SCHOOL STATE",
				(row) => row.enrolledSchoolState,
				false
			),
			getTextColumn("enrolledClass", "ENROLLED CLASS", (row) => row.enrolledClass, false),
			getActionsColumn(
				{ kind: "onboarding", program: "tacots" },
				onViewMore,
				(row) => `${row.firstName} ${row.surname}`,
				"TACOTS - Beneficiary Onboarding"
			),
		];
	}, [onViewMore]);

	const exitColumns = useMemo<Array<ColumnDef<TacotsExitRecord>>>(() => {
		return [
			getTextColumn("studentName", "STUDENT NAME", (row) => `${row.firstName} ${row.surname}`),
			getTextColumn("yearOfExit", "YEAR OF EXIT", (row) => row.yearOfExit, false),
			getTextColumn(
				"schoolAttendedDuringProgram",
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
			getTextColumn("exitReason", "REASONS FOR EXIT", (row) => row.exitReason, false),
			getActionsColumn(
				{ kind: "exit", program: "tacots" },
				onViewMore,
				(row) => `${row.firstName} ${row.surname}`,
				"TACOTS - Exit Completion"
			),
		];
	}, [onViewMore]);

	const trackingQuery = useDashboardDataTableQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.perPage,
		sortableColumnIds: TacotsTrackingRecordSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.sort,
	});

	const onboardingQuery = useDashboardDataTableQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.perPage,
		sortableColumnIds: TacotsOnboardingSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.sort,
	});

	const exitQuery = useDashboardDataTableQueryState({
		pageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.page,
		perPageKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.perPage,
		sortableColumnIds: TacotsExitSortByOptions,
		sortKey: TACOTS_TRACKER_DATA_QUERY_KEYS.exit.sort,
	});

	const [trackingSearch] = useQueryState(
		TACOTS_TRACKER_DATA_QUERY_KEYS.tracking.search,
		parseAsString.withDefault("")
	);
	const [onboardingSearch] = useQueryState(
		TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding.search,
		parseAsString.withDefault("")
	);
	const [exitSearch] = useQueryState(
		TACOTS_TRACKER_DATA_QUERY_KEYS.exit.search,
		parseAsString.withDefault("")
	);

	const trackingQueryResult = useQuery(
		tacotsTrackingTrackerDataQuery({
			limit: trackingQuery.limit,
			orderBy: trackingQuery.orderBy,
			page: trackingQuery.page,
			...(trackingSearch && { search: trackingSearch }),
			...(trackingQuery.sortBy && { sortBy: trackingQuery.sortBy }),
		})
	);

	const onboardingQueryResult = useQuery(
		tacotsOnboardingTrackerDataQuery({
			limit: onboardingQuery.limit,
			orderBy: onboardingQuery.orderBy,
			page: onboardingQuery.page,
			...(onboardingSearch && { search: onboardingSearch }),
			...(onboardingQuery.sortBy && { sortBy: onboardingQuery.sortBy }),
		})
	);

	const exitQueryResult = useQuery(
		tacotsExitTrackerDataQuery({
			limit: exitQuery.limit,
			orderBy: exitQuery.orderBy,
			page: exitQuery.page,
			...(exitSearch && { search: exitSearch }),
			...(exitQuery.sortBy && { sortBy: exitQuery.sortBy }),
		})
	);

	const trackingRecords = trackingQueryResult.data?.data ?? [];
	const onboardingRecords = onboardingQueryResult.data?.data ?? [];
	const exitRecords = exitQueryResult.data?.data ?? [];
	const metadata = trackingQueryResult.data?.meta.metadata;

	const stats = [
		{
			label: "Total Records",
			value: metadata?.totalRecords ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "High-risk Beneficiaries",
			value: metadata?.highRiskStudents ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Onboarding Rate",
			value: (() => {
				if (metadata?.onboardingRate == null) return EMPTY_VALUE_PLACEHOLDER;

				return `${Math.round(metadata.onboardingRate)}%`;
			})(),
		},
		{
			label: "Completed",
			value: metadata?.completed ?? EMPTY_VALUE_PLACEHOLDER,
		},
	] as const;

	const trackingTable = useDataTable<TacotsTrackingRecord>({
		columns: trackingColumns,
		data: trackingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: trackingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.tracking,
		sortableColumnIds: TacotsTrackingRecordSortByOptions,
	});

	const onboardingTable = useDataTable<TacotsOnboardingRecord>({
		columns: onboardingColumns,
		data: onboardingRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: onboardingQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.onboarding,
		sortableColumnIds: TacotsOnboardingSortByOptions,
	});

	const exitTable = useDataTable<TacotsExitRecord>({
		columns: exitColumns,
		data: exitRecords,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: exitQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_TRACKER_DATA_QUERY_KEYS.exit,
		sortableColumnIds: TacotsExitSortByOptions,
	});

	const trackingDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("tracking"));
	const onboardingDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("onboarding"));
	const exitDownloadMutation = useMutation(tacotsTrackerDataDownloadMutation("exit"));

	return (
		<>
			<DashboardDataStats stats={stats} />
			<DashboardDataTableSection
				color="yellow"
				count={trackingRecords.length}
				isLoading={trackingQueryResult.isPending}
				isDownloadLoading={trackingDownloadMutation.isPending}
				label="TACOTS - Student Tracking"
				sortOptions={TACOTS_TRACKING_SORT_OPTIONS}
				table={trackingTable.table}
				onDownload={() => trackingDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="yellow"
				count={onboardingRecords.length}
				isLoading={onboardingQueryResult.isPending}
				isDownloadLoading={onboardingDownloadMutation.isPending}
				label="TACOTS - Beneficiary Onboarding"
				sortOptions={TACOTS_ONBOARDING_SORT_OPTIONS}
				table={onboardingTable.table}
				onDownload={() => onboardingDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="red"
				count={exitRecords.length}
				isLoading={exitQueryResult.isPending}
				isDownloadLoading={exitDownloadMutation.isPending}
				label="TACOTS - Exit Completion"
				sortOptions={TACOTS_EXIT_SORT_OPTIONS}
				table={exitTable.table}
				onDownload={() => exitDownloadMutation.mutate()}
			/>
		</>
	);
}

function OutreachTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const columns = useMemo<Array<ColumnDef<OutreachRecord>>>(() => {
		return [
			getTextColumn("outreachStartDate", "START DATE", (row) => row.outreachStartDate, false),
			getTextColumn("outreachEndDate", "END DATE", (row) => row.outreachEndDate, false),
			getTextColumn("outreachState", "OUTREACH STATE", (row) => row.outreachState, false),
			getTextColumn("volunteers", "NUM. OF VOLUNTEERS", (row) => row.numVolunteers, false),
			getTextColumn("beneficiaries", "NUM. OF BENEFICIARIES", (row) => row.numBeneficiaries, false),
			getTextColumn(
				"outreachType",
				"OUTREACH TYPE",
				(row) => formatDashboardDetailValue(row.outreachType),
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
	const queryState = useDashboardDataTableQueryState({
		pageKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.page,
		perPageKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.perPage,
		sortableColumnIds: OutreachSortByOptions,
		sortKey: OUTREACH_TRACKER_DATA_QUERY_KEYS.sort,
	});

	const [search] = useQueryState(OUTREACH_TRACKER_DATA_QUERY_KEYS.search, parseAsString.withDefault(""));

	const queryResult = useQuery(
		outreachTrackerDataQuery({
			limit: queryState.limit,
			orderBy: queryState.orderBy,
			page: queryState.page,
			...(search && { search }),
			...(queryState.sortBy && { sortBy: queryState.sortBy }),
		})
	);

	const records = queryResult.data?.data ?? [];
	const metadata = queryResult.data?.meta.metadata;
	const stats = [
		{
			label: "Communities Engaged",
			value: metadata?.communitiesEngaged ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Beneficiaries Reached",
			value: metadata?.beneficiariesReached ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Volunteers",
			value: metadata?.volunteers ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Outreach Events",
			value: metadata?.outreachEvents ?? EMPTY_VALUE_PLACEHOLDER,
		},
	] as const;
	const table = useDataTable<OutreachRecord>({
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: queryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: OUTREACH_TRACKER_DATA_QUERY_KEYS,
		sortableColumnIds: OutreachSortByOptions,
	});

	const downloadMutation = useMutation(outreachTrackerDataDownloadMutation());

	return (
		<>
			<DashboardDataStats stats={stats} />
			<DashboardDataTableSection
				color="yellow"
				count={records.length}
				isDownloadLoading={downloadMutation.isPending}
				isLoading={queryResult.isPending}
				label="Cedar Outreach - Tracker Data"
				sortOptions={OUTREACH_SORT_OPTIONS}
				table={table.table}
				onDownload={() => downloadMutation.mutate()}
			/>
		</>
	);
}

function CapacityBuildingTrackerDataTab(props: { onViewMore: (record: SelectedTrackerRecord) => void }) {
	const { onViewMore } = props;

	const columns = useMemo<Array<ColumnDef<CapacityBuildingRecord>>>(() => {
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
	const queryState = useDashboardDataTableQueryState({
		pageKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.page,
		perPageKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.perPage,
		sortableColumnIds: CapacityEvaluationSortByOptions,
		sortKey: CAPACITY_TRACKER_DATA_QUERY_KEYS.sort,
	});

	const [search] = useQueryState(CAPACITY_TRACKER_DATA_QUERY_KEYS.search, parseAsString.withDefault(""));

	const queryResult = useQuery(
		capacityBuildingTrackerDataQuery({
			limit: queryState.limit,
			orderBy: queryState.orderBy,
			page: queryState.page,
			...(search && { search }),
			...(queryState.sortBy && { sortBy: queryState.sortBy }),
		})
	);

	const records = queryResult.data?.data ?? [];
	const metadata = queryResult.data?.meta.metadata;
	const stats = [
		{
			label: "Participants Impacted",
			value: metadata?.participantsImpacted ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Organizations Partnered With",
			value: metadata?.organizationsPartneredWith ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Volunteers Engaged",
			value: metadata?.volunteersEngaged ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Workshops Conducted",
			value: metadata?.workshopsConducted ?? EMPTY_VALUE_PLACEHOLDER,
		},
	] as const;

	const table = useDataTable<CapacityBuildingRecord>({
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: TRACKER_DATA_TABLE_INITIAL_STATE,
		pageCount: queryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: CAPACITY_TRACKER_DATA_QUERY_KEYS,
		sortableColumnIds: CapacityEvaluationSortByOptions,
	});

	const downloadMutation = useMutation(capacityBuildingTrackerDataDownloadMutation());

	return (
		<>
			<DashboardDataStats stats={stats} />
			<DashboardDataTableSection
				color="yellow"
				isLoading={queryResult.isPending}
				isDownloadLoading={downloadMutation.isPending}
				count={records.length}
				label="Capacity Building Program Evaluation"
				sortOptions={CAPACITY_SORT_OPTIONS}
				table={table.table}
				onDownload={() => downloadMutation.mutate()}
			/>
		</>
	);
}

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
					"text-[14px] text-cedar-black/87",
					options?.truncate && "block max-w-[220px] truncate"
				)}
			>
				{formatDashboardDetailValue(row.getValue(id))}
			</span>
		),
		enableColumnFilter,
		header: ({ column }) => <DataTableColumnHeader column={column} label={label} />,
		id,
		meta: {
			label,
			placeholder: "Search this section",
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
				onViewMore={() => {
					const recordTitle = getTitle(row.original);

					const title = `${dialogTitle}${recordTitle ? ` - ${recordTitle}` : ""}`;

					const id = row.original.id;

					const selectedRecordByProgram = {
						ash: {
							id,
							kind: target.program === "ash" ? target.kind : "tracking",
							program: "ash",
							title,
						},
						"capacity-building": { id, kind: "evaluation", program: "capacity-building", title },
						outreaches: { id, kind: "tracker", program: "outreaches", title },
						tacots: {
							id,
							kind: target.program === "tacots" ? target.kind : "tracking",
							program: "tacots",
							title,
						},
					} satisfies Record<SelectedTrackerRecord["program"], SelectedTrackerRecord>;

					onViewMore(selectedRecordByProgram[target.program]);
				}}
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

	const invalidateListQueries = () => {
		if (target.program === "ash" && target.kind === "attendance") {
			void queryClient.invalidateQueries({
				queryKey: ashAttendanceTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "ash" && target.kind === "exit") {
			void queryClient.invalidateQueries({
				queryKey: ashExitTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "ash" && target.kind === "tracking") {
			void queryClient.invalidateQueries({
				queryKey: ashTrackingTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "tacots" && target.kind === "exit") {
			void queryClient.invalidateQueries({
				queryKey: tacotsExitTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "tacots" && target.kind === "onboarding") {
			void queryClient.invalidateQueries({
				queryKey: tacotsOnboardingTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "tacots" && target.kind === "tracking") {
			void queryClient.invalidateQueries({
				queryKey: tacotsTrackingTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (target.program === "outreaches") {
			void queryClient.invalidateQueries({
				queryKey: outreachTrackerDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		void queryClient.invalidateQueries({
			queryKey: capacityBuildingTrackerDataQuery().queryKey.slice(0, -1),
		});
	};

	const handleDelete = () => {
		if (target.program === "ash" && target.kind === "attendance") {
			ashAttendanceDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "ash" && target.kind === "exit") {
			ashExitDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "ash" && target.kind === "tracking") {
			ashTrackingDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "exit") {
			tacotsExitDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "onboarding") {
			tacotsOnboardingDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "tacots" && target.kind === "tracking") {
			tacotsTrackingDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		if (target.program === "outreaches") {
			outreachDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
			return;
		}

		capacityDelete.mutate(undefined, { onSuccess: () => invalidateListQueries() });
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="rounded-[10px] border border-cedar-black/16 px-4 py-2 text-[14px]
					text-cedar-black/87 transition-colors hover:bg-cedar-grey"
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

	const { record, submittedAt } = (() => {
		if (selectedRecord?.program === "ash" && selectedRecord.kind === "tracking") {
			const trackerRecord = ashTrackingDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.createdAt };
		}

		if (selectedRecord?.program === "ash" && selectedRecord.kind === "attendance") {
			const trackerRecord = ashAttendanceDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.sessionDate };
		}

		if (selectedRecord?.program === "ash" && selectedRecord.kind === "exit") {
			const trackerRecord = ashExitDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.exitDate };
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "tracking") {
			const trackerRecord = tacotsTrackingDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.submissionDate };
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "onboarding") {
			const trackerRecord = tacotsOnboardingDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.onboardingDate };
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "exit") {
			const trackerRecord = tacotsExitDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.submissionDate };
		}

		if (selectedRecord?.program === "outreaches") {
			const trackerRecord = outreachDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.outreachStartDate };
		}

		if (selectedRecord?.program === "capacity-building") {
			const trackerRecord = capacityDetailQueryResult.data?.data;
			return { record: trackerRecord, submittedAt: trackerRecord?.programDate };
		}

		return {};
	})();

	const rows = getDashboardDetailRows(record);

	const submittedDate =
		typeof submittedAt === "string" ?
			new Intl.DateTimeFormat("en", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}).format(new Date(submittedAt))
		:	EMPTY_VALUE_PLACEHOLDER;

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
								<DialogAnimated.Description className="mt-1 text-[16px] text-cedar-black/79">
									Submitted - {submittedDate}
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
									<span className="min-w-0 wrap-break-word text-cedar-black/87 capitalize">
										{row.label}
									</span>
									<span
										className="min-w-0 text-right font-medium wrap-break-word
											text-cedar-black/87"
									>
										{row.url ?
											<a
												href={row.url}
												target="_blank"
												rel="noreferrer"
												className="text-cedar-red underline underline-offset-4"
											>
												View attachment
											</a>
										:	row.value}
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

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { DialogAnimated, TabsAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { DropdownMenu } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import {
	AdminReviewStatusOptions,
	AshTrackingSortByOptions,
	ReviewStatusOptions,
	TacotsRecommendationSortByOptions,
	VolunteerSortByOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import {
	ashFormDataDownloadMutation,
	ashRegistrationDeleteMutation,
	ashRegistrationStatusMutation,
	tacotsFeedbackDeleteMutation,
	tacotsFormDataDownloadMutation,
	tacotsRecommendationDeleteMutation,
	tacotsRecommendationStatusMutation,
	volunteerFeedbackDeleteMutation,
	volunteerFormDataDownloadMutation,
	volunteerRegistrationDeleteMutation,
	volunteerRegistrationStatusMutation,
	type AshFormKind,
	type TacotsFormKind,
	type VolunteerFormKind,
} from "@/lib/react-query/mutationOptions";
import {
	ashFeedbackFormDataQuery,
	ashFeedbackFormDetailQuery,
	ashRegistrationFormDataQuery,
	ashRegistrationFormDetailQuery,
	tacotsFeedbackFormDataQuery,
	tacotsFeedbackFormDetailQuery,
	tacotsRecommendationFormDataQuery,
	tacotsRecommendationFormDetailQuery,
	volunteerFeedbackFormDataQuery,
	volunteerFeedbackFormDetailQuery,
	volunteerRegistrationFormDataQuery,
	volunteerRegistrationFormDetailQuery,
	type AshFeedbackFormDataQueryResult,
	type AshRegistrationFormDataQueryResult,
	type TacotsFeedbackFormDataQueryResult,
	type TacotsRecommendationFormDataQueryResult,
	type VolunteerFeedbackFormDataQueryResult,
	type VolunteerRegistrationFormDataQueryResult,
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

const FORM_DATA_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

const ASH_FORM_DATA_QUERY_KEYS = {
	feedback: {
		filters: "ashFeedbackFilters",
		joinOperator: "ashFeedbackJoinOperator",
		page: "ashFeedbackPage",
		perPage: "ashFeedbackPerPage",
		search: "ashFeedbackSearch",
		sort: "ashFeedbackSort",
	},
	registration: {
		filters: "ashRegistrationFilters",
		joinOperator: "ashRegistrationJoinOperator",
		page: "ashRegistrationPage",
		perPage: "ashRegistrationPerPage",
		search: "ashFormDataSearch",
		sort: "ashRegistrationSort",
		status: "ashFormDataStatus",
	},
} as const satisfies Record<AshFormKind, QueryKeys>;

const TACOTS_FORM_DATA_QUERY_KEYS = {
	feedback: {
		filters: "tacotsFeedbackFilters",
		joinOperator: "tacotsFeedbackJoinOperator",
		page: "tacotsFeedbackPage",
		perPage: "tacotsFeedbackPerPage",
		search: "tacotsFeedbackSearch",
		sort: "tacotsFeedbackSort",
	},
	recommendation: {
		filters: "tacotsRecommendationFilters",
		joinOperator: "tacotsRecommendationJoinOperator",
		page: "tacotsRecommendationPage",
		perPage: "tacotsRecommendationPerPage",
		search: "tacotsFormDataSearch",
		sort: "tacotsRecommendationSort",
		status: "tacotsRecommendationStatus",
	},
} as const satisfies Record<TacotsFormKind, QueryKeys>;

const VOLUNTEER_FORM_DATA_QUERY_KEYS = {
	feedback: {
		filters: "volunteerFeedbackFilters",
		joinOperator: "volunteerFeedbackJoinOperator",
		page: "volunteerFeedbackPage",
		perPage: "volunteerFeedbackPerPage",
		search: "volunteerFeedbackSearch",
		sort: "volunteerFeedbackSort",
	},
	registration: {
		filters: "volunteerRegistrationFilters",
		joinOperator: "volunteerRegistrationJoinOperator",
		page: "volunteerRegistrationPage",
		perPage: "volunteerRegistrationPerPage",
		search: "volunteerFormDataSearch",
		sort: "volunteerRegistrationSort",
		status: "volunteerRegistrationStatus",
	},
} as const satisfies Record<VolunteerFormKind, QueryKeys>;

const FORM_DATA_TABSANIMATED = [
	{ label: "ASH", value: "ash" },
	{ label: "TACOTS", value: "tacots" },
	{ label: "Volunteer", value: "volunteer" },
] as const;

const ASH_SORT_OPTIONS = [
	{ label: "First Name", value: "firstName" },
	{ label: "Surname", value: "surname" },
	{ label: "Gender", value: "gender" },
	{ label: "School State", value: "schoolState" },
	{ label: "Current Class", value: "currentClass" },
	{ label: "Assigned Mentor", value: "assignedMentor" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof AshTrackingSortByOptions)[number];
}>;

const TACOTS_RECOMMENDATION_SORT_OPTIONS = [
	{ label: "First Name", value: "firstName" },
	{ label: "Surname", value: "surname" },
	{ label: "Gender", value: "gender" },
	{ label: "School Name", value: "schoolName" },
	{ label: "Last Class", value: "lastClass" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof TacotsRecommendationSortByOptions)[number];
}>;

const VOLUNTEER_SORT_OPTIONS = [
	{ label: "First Name", value: "firstName" },
	{ label: "Surname", value: "surname" },
	{ label: "Gender", value: "gender" },
	{ label: "State", value: "state" },
	{ label: "Email", value: "emailAddress" },
	{ label: "Availability", value: "availability" },
	{ label: "Volunteer Area", value: "volunteerAreas" },
	{ label: "Created At", value: "createdAt" },
] as const satisfies ReadonlyArray<{
	label: string;
	value: (typeof VolunteerSortByOptions)[number];
}>;

const ASH_STATUS_OPTIONS = [
	{ label: "Accepted", value: "accepted" },
	{ label: "Pending", value: "pending" },
	{ label: "Rejected", value: "rejected" },
] as const;

const TACOTS_RECOMMENDATION_STATUS_OPTIONS = [
	{ label: "Selected", value: "SELECTED" },
	{ label: "Keep In View", value: "KEEP IN VIEW" },
	{ label: "Not Selected", value: "NOT SELECTED" },
] as const;

type AshRegistrationFormRecord = AshRegistrationFormDataQueryResult["data"][number];

type AshFeedbackFormRecord = AshFeedbackFormDataQueryResult["data"][number];

type TacotsRecommendationFormRecord = TacotsRecommendationFormDataQueryResult["data"][number];

type TacotsFeedbackFormRecord = TacotsFeedbackFormDataQueryResult["data"][number];

type VolunteerRegistrationFormRecord = VolunteerRegistrationFormDataQueryResult["data"][number];

type VolunteerFeedbackFormRecord = VolunteerFeedbackFormDataQueryResult["data"][number];

type FormRecord =
	| AshFeedbackFormRecord
	| AshRegistrationFormRecord
	| TacotsFeedbackFormRecord
	| TacotsRecommendationFormRecord
	| VolunteerFeedbackFormRecord
	| VolunteerRegistrationFormRecord;

type AshSelectedRecord = {
	id: string;
	kind: AshFormKind;
	program: "ash";
	status?: string | null;
	title: string;
};

type TacotsSelectedRecord = {
	id: string;
	kind: TacotsFormKind;
	program: "tacots";
	status?: string | null;
	title: string;
};

type VolunteerSelectedRecord = {
	id: string;
	kind: VolunteerFormKind;
	program: "volunteer";
	status?: string | null;
	title: string;
};

type SelectedRecord = AshSelectedRecord | TacotsSelectedRecord | VolunteerSelectedRecord;

type FormDataActionTarget =
	| {
			kind: AshFormKind;
			program: "ash";
	  }
	| {
			kind: TacotsFormKind;
			program: "tacots";
	  }
	| {
			kind: VolunteerFormKind;
			program: "volunteer";
	  };

function FormDataPage() {
	const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);

	return (
		<Main className="gap-6 lg:gap-12">
			<TabsAnimated.Root defaultValue="ash" className="gap-6">
				<div className="rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red",
							list: "h-12 rounded-[12px] bg-cedar-grey p-2",
						}}
					>
						<For
							each={FORM_DATA_TABSANIMATED}
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

				<TabsAnimated.ContentList>
					<TabsAnimated.Content value="ash" className="flex flex-col gap-6">
						<AshFormDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>
					<TabsAnimated.Content value="tacots" className="flex flex-col gap-6">
						<TacotsFormDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>
					<TabsAnimated.Content value="volunteer" className="flex flex-col gap-6">
						<VolunteerFormDataTab onViewMore={setSelectedRecord} />
					</TabsAnimated.Content>
				</TabsAnimated.ContentList>
			</TabsAnimated.Root>

			<FormDataDetailsDialog selectedRecord={selectedRecord} onOpenChange={setSelectedRecord} />
		</Main>
	);
}

export default FormDataPage;

function AshFormDataTab(props: { onViewMore: (record: SelectedRecord) => void }) {
	const { onViewMore } = props;

	const registrationColumns = useMemo<Array<ColumnDef<AshRegistrationFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.firstName),
			getTextColumn("surname", "SURNAME", (row) => row.surname),
			getTextColumn("gender", "GENDER", (row) => row.gender, false),
			getTextColumn("schoolState", "SCHOOL STATE", (row) => row.schoolState, false),
			getTextColumn("currentClass", "CURRENT CLASS", (row) => row.currentClass, false),
			{
				accessorFn: (row) => row.status,
				cell: ({ row }) => <StatusPill status={row.original.status} />,
				enableColumnFilter: true,
				header: ({ column }) => <DataTableColumnHeader column={column} label="STATUS" />,
				id: "status",
				meta: {
					label: "Status",
					options: [...ASH_STATUS_OPTIONS],
					variant: "select",
				},
			},
			getTextColumn("assignedMentor", "ASSIGNED MENTOR", (row) => row.assignedMentor, false),
			getActionsColumn({ kind: "registration", program: "ash" }, onViewMore),
		];
	}, [onViewMore]);

	const feedbackColumns = useMemo<Array<ColumnDef<AshFeedbackFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.studentFirstName),
			getTextColumn("surname", "SURNAME", (row) => row.studentSurname),
			getTextColumn("schoolName", "SCHOOL NAME", (row) => row.schoolName, false),
			getTextColumn("confidenceRating", "CONFIDENCE RATING", (row) => row.confidenceRating, false),
			getTextColumn(
				"volunteerSupportRating",
				"VOLUNTEER SUPPORT RATING",
				(row) => row.volunteerSupportRating,
				false
			),
			getTextColumn("currentClass", "CURRENT CLASS", (row) => row.currentClass, false),
			getActionsColumn({ kind: "feedback", program: "ash" }, onViewMore),
		];
	}, [onViewMore]);

	const registrationQuery = useDashboardDataTableQueryState({
		pageKey: ASH_FORM_DATA_QUERY_KEYS.registration.page,
		perPageKey: ASH_FORM_DATA_QUERY_KEYS.registration.perPage,
		sortableColumnIds: AshTrackingSortByOptions,
		sortKey: ASH_FORM_DATA_QUERY_KEYS.registration.sort,
	});

	const feedbackQuery = useDashboardDataTableQueryState({
		pageKey: ASH_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: ASH_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: ASH_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [registrationSearch] = useQueryState(
		ASH_FORM_DATA_QUERY_KEYS.registration.search,
		parseAsString.withDefault("")
	);
	const [feedbackSearch] = useQueryState(
		ASH_FORM_DATA_QUERY_KEYS.feedback.search,
		parseAsString.withDefault("")
	);
	const [statusFilter] = useQueryState(
		ASH_FORM_DATA_QUERY_KEYS.registration.status,
		parseAsArrayOf(parseAsStringLiteral(ReviewStatusOptions)).withDefault([])
	);

	const registrationQueryResult = useQuery(
		ashRegistrationFormDataQuery({
			limit: registrationQuery.limit,
			orderBy: registrationQuery.orderBy,
			page: registrationQuery.page,
			...(registrationSearch && { search: registrationSearch }),
			...(registrationQuery.sortBy && { sortBy: registrationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		ashFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackSearch && { search: feedbackSearch }),
		})
	);

	const registrationDownloadMutation = useMutation(ashFormDataDownloadMutation("registration"));
	const feedbackDownloadMutation = useMutation(ashFormDataDownloadMutation("feedback"));

	const registrationMetadata = registrationQueryResult.data?.meta.metadata;
	const registrationRecords = registrationQueryResult.data?.data ?? [];
	const registrationPagination = registrationQueryResult.data?.meta.pagination;
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];
	const feedbackPagination = feedbackQueryResult.data?.meta.pagination;

	const dashboardStats = [
		{
			label: "Total Submissions",
			value: registrationMetadata?.totalSubmissions ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{ label: "Pending Review", value: registrationMetadata?.pendingStudents ?? EMPTY_VALUE_PLACEHOLDER },
		{ label: "Accepted", value: registrationMetadata?.acceptedStudents ?? EMPTY_VALUE_PLACEHOLDER },
		{ label: "Rejected", value: registrationMetadata?.rejectedStudents ?? EMPTY_VALUE_PLACEHOLDER },
	] as const;

	const registrationTable = useDataTable<AshRegistrationFormRecord>({
		columns: registrationColumns,
		data: registrationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: registrationPagination?.totalPages ?? 1,
		queryKeys: ASH_FORM_DATA_QUERY_KEYS.registration,
		sortableColumnIds: AshTrackingSortByOptions,
	});

	const feedbackTable = useDataTable<AshFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackPagination?.totalPages ?? 1,
		queryKeys: ASH_FORM_DATA_QUERY_KEYS.feedback,
		sortableColumnIds: [],
	});

	return (
		<>
			<DashboardDataStats stats={dashboardStats} />
			<DashboardDataTableSection
				color="yellow"
				count={(registrationPagination?.totalPages ?? 1) * (registrationPagination?.limit ?? 0)}
				isLoading={registrationQueryResult.isPending}
				isDownloadLoading={registrationDownloadMutation.isPending}
				label="ASH - Student Registrations"
				sortOptions={ASH_SORT_OPTIONS}
				statusOptions={ASH_STATUS_OPTIONS}
				table={registrationTable.table}
				onDownload={() => registrationDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="red"
				count={(feedbackPagination?.totalPages ?? 1) * (feedbackPagination?.limit ?? 0)}
				isLoading={feedbackQueryResult.isPending}
				isDownloadLoading={feedbackDownloadMutation.isPending}
				label="ASH - Program Feedback"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

function TacotsFormDataTab(props: { onViewMore: (record: SelectedRecord) => void }) {
	const { onViewMore } = props;

	const recommendationColumns = useMemo<Array<ColumnDef<TacotsRecommendationFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.firstName),
			getTextColumn("surname", "SURNAME", (row) => row.surname),
			getTextColumn("gender", "GENDER", (row) => row.gender, false),
			getTextColumn("schoolName", "SCHOOL NAME", (row) => row.schoolName, false),
			getTextColumn("lastClass", "LAST CLASS", (row) => row.lastClass, false),
			{
				accessorFn: (row) => row.adminStatus,
				cell: ({ row }) => <StatusPill status={row.original.adminStatus} />,
				enableColumnFilter: true,
				header: ({ column }) => <DataTableColumnHeader column={column} label="ADMIN STATUS" />,
				id: "adminStatus",
				meta: {
					label: "Admin Status",
					options: [...TACOTS_RECOMMENDATION_STATUS_OPTIONS],
					variant: "select",
				},
			},
			getActionsColumn({ kind: "recommendation", program: "tacots" }, onViewMore),
		];
	}, [onViewMore]);

	const feedbackColumns = useMemo<Array<ColumnDef<TacotsFeedbackFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.studentFirstName),
			getTextColumn("surname", "SURNAME", (row) => row.studentSurname),
			getTextColumn("parentGuardianPhone", "PARENT/GUARDIAN PHONE", (row) => row.parentPhone, false),
			getTextColumn("currentSchool", "CURRENT SCHOOL", (row) => row.currentSchool, false),
			getTextColumn("currentClass", "CURRENT CLASS", (row) => row.currentClass, false),
			getActionsColumn({ kind: "feedback", program: "tacots" }, onViewMore),
		];
	}, [onViewMore]);

	const recommendationQuery = useDashboardDataTableQueryState({
		pageKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.page,
		perPageKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.perPage,
		sortableColumnIds: TacotsRecommendationSortByOptions,
		sortKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.sort,
	});

	const feedbackQuery = useDashboardDataTableQueryState({
		pageKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [recommendationSearch] = useQueryState(
		TACOTS_FORM_DATA_QUERY_KEYS.recommendation.search,
		parseAsString.withDefault("")
	);
	const [feedbackSearch] = useQueryState(
		TACOTS_FORM_DATA_QUERY_KEYS.feedback.search,
		parseAsString.withDefault("")
	);
	const [statusFilter] = useQueryState(
		TACOTS_FORM_DATA_QUERY_KEYS.recommendation.status,
		parseAsArrayOf(parseAsStringLiteral(AdminReviewStatusOptions)).withDefault([])
	);

	const recommendationQueryResult = useQuery(
		tacotsRecommendationFormDataQuery({
			limit: recommendationQuery.limit,
			orderBy: recommendationQuery.orderBy,
			page: recommendationQuery.page,
			...(recommendationSearch && { search: recommendationSearch }),
			...(recommendationQuery.sortBy && { sortBy: recommendationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		tacotsFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackSearch && { search: feedbackSearch }),
		})
	);

	const recommendationDownloadMutation = useMutation(tacotsFormDataDownloadMutation("recommendation"));
	const feedbackDownloadMutation = useMutation(tacotsFormDataDownloadMutation("feedback"));

	const recommendationMetadata = recommendationQueryResult.data?.meta.metadata;
	const recommendationRecords = recommendationQueryResult.data?.data ?? [];
	const recommendationPagination = recommendationQueryResult.data?.meta.pagination;
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];
	const feedbackPagination = feedbackQueryResult.data?.meta.pagination;

	const dashboardStats = [
		{
			label: "Total Submissions",
			value: recommendationMetadata?.totalSubmissions ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Pending Review",
			value: recommendationMetadata?.pendingStudents ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{ label: "Accepted", value: recommendationMetadata?.acceptedStudents ?? EMPTY_VALUE_PLACEHOLDER },
		{ label: "Rejected", value: recommendationMetadata?.rejectedStudents ?? EMPTY_VALUE_PLACEHOLDER },
	] as const;

	const recommendationTable = useDataTable<TacotsRecommendationFormRecord>({
		columns: recommendationColumns,
		data: recommendationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: recommendationPagination?.totalPages ?? 1,
		queryKeys: TACOTS_FORM_DATA_QUERY_KEYS.recommendation,
		sortableColumnIds: TacotsRecommendationSortByOptions,
	});

	const feedbackTable = useDataTable<TacotsFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackPagination?.totalPages ?? 1,
		queryKeys: TACOTS_FORM_DATA_QUERY_KEYS.feedback,
		sortableColumnIds: [],
	});

	return (
		<>
			<DashboardDataStats stats={dashboardStats} />
			<DashboardDataTableSection
				color="yellow"
				count={(recommendationPagination?.totalPages ?? 1) * (recommendationPagination?.limit ?? 0)}
				isLoading={recommendationQueryResult.isPending}
				isDownloadLoading={recommendationDownloadMutation.isPending}
				label="TACOTS - Recommendations"
				sortOptions={TACOTS_RECOMMENDATION_SORT_OPTIONS}
				statusOptions={TACOTS_RECOMMENDATION_STATUS_OPTIONS}
				table={recommendationTable.table}
				onDownload={() => recommendationDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="red"
				count={(feedbackPagination?.totalPages ?? 1) * (feedbackPagination?.limit ?? 0)}
				isDownloadLoading={feedbackDownloadMutation.isPending}
				isLoading={feedbackQueryResult.isPending}
				label="TACOTS - Program Feedback"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

function VolunteerFormDataTab(props: { onViewMore: (record: SelectedRecord) => void }) {
	const { onViewMore } = props;

	const registrationColumns = useMemo<Array<ColumnDef<VolunteerRegistrationFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.firstName),
			getTextColumn("surname", "SURNAME", (row) => row.surname),
			getTextColumn("gender", "GENDER", (row) => row.gender, false),
			getTextColumn("state", "STATE", (row) => row.state, false),
			getTextColumn("emailAddress", "E-MAIL", (row) => row.emailAddress, false),
			{
				accessorFn: (row) => row.status,
				cell: ({ row }) => <StatusPill status={row.original.status} />,
				enableColumnFilter: true,
				header: ({ column }) => <DataTableColumnHeader column={column} label="STATUS" />,
				id: "status",
				meta: {
					label: "Status",
					options: [...ASH_STATUS_OPTIONS],
					variant: "select",
				},
			},
			getTextColumn("volunteerAreas", "VOLUNTEER AREA", (row) => row.volunteerAreas, false),
			getTextColumn("availability", "AVAILABILITY", (row) => row.availability, false),
			getActionsColumn({ kind: "registration", program: "volunteer" }, onViewMore),
		];
	}, [onViewMore]);

	const feedbackColumns = useMemo<Array<ColumnDef<VolunteerFeedbackFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.firstName),
			getTextColumn("surname", "SURNAME", (row) => row.surname),
			getTextColumn(
				"programVolunteered",
				"PROGRAM VOLUNTEERED",
				(row) => row.programVolunteered,
				false
			),
			getTextColumn("volunteerDuration", "VOLUNTEER DURATION", (row) => row.volunteerDuration, false),
			getTextColumn(
				"overallExperienceRating",
				"OVERALL EXPERIENCE RATING",
				(row) => `${row.overallExperienceRating}/5`,
				false
			),
			getTextColumn("wouldRecommend", "WOULD RECOMMEND", (row) => row.wouldRecommend, false),
			getActionsColumn({ kind: "feedback", program: "volunteer" }, onViewMore),
		];
	}, [onViewMore]);

	const registrationQuery = useDashboardDataTableQueryState({
		pageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.page,
		perPageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.perPage,
		sortableColumnIds: VolunteerSortByOptions,
		sortKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.sort,
	});

	const feedbackQuery = useDashboardDataTableQueryState({
		pageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [registrationSearch] = useQueryState(
		VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.search,
		parseAsString.withDefault("")
	);
	const [feedbackSearch] = useQueryState(
		VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.search,
		parseAsString.withDefault("")
	);
	const [statusFilter] = useQueryState(
		VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.status,
		parseAsArrayOf(parseAsStringLiteral(ReviewStatusOptions)).withDefault([])
	);

	const registrationQueryResult = useQuery(
		volunteerRegistrationFormDataQuery({
			limit: registrationQuery.limit,
			orderBy: registrationQuery.orderBy,
			page: registrationQuery.page,
			...(registrationSearch && { search: registrationSearch }),
			...(registrationQuery.sortBy && { sortBy: registrationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		volunteerFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackSearch && { search: feedbackSearch }),
		})
	);

	const registrationDownloadMutation = useMutation(volunteerFormDataDownloadMutation("registration"));
	const feedbackDownloadMutation = useMutation(volunteerFormDataDownloadMutation("feedback"));

	const registrationMetadata = registrationQueryResult.data?.meta.metadata;
	const registrationRecords = registrationQueryResult.data?.data ?? [];
	const registrationPagination = registrationQueryResult.data?.meta.pagination;
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];
	const feedbackPagination = feedbackQueryResult.data?.meta.pagination;

	const dashboardStats = [
		{
			label: "Total Submissions",
			value: registrationMetadata?.totalSubmissions ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{ label: "Pending Review", value: registrationMetadata?.pendingStudents ?? EMPTY_VALUE_PLACEHOLDER },
		{ label: "Accepted", value: registrationMetadata?.acceptedStudents ?? EMPTY_VALUE_PLACEHOLDER },
		{ label: "Rejected", value: registrationMetadata?.rejectedStudents ?? EMPTY_VALUE_PLACEHOLDER },
	] as const;

	const registrationTable = useDataTable<VolunteerRegistrationFormRecord>({
		columns: registrationColumns,
		data: registrationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: registrationPagination?.totalPages ?? 1,
		queryKeys: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration,
		sortableColumnIds: VolunteerSortByOptions,
	});

	const feedbackTable = useDataTable<VolunteerFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackPagination?.totalPages ?? 1,
		queryKeys: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback,
		sortableColumnIds: [],
	});

	return (
		<>
			<DashboardDataStats stats={dashboardStats} />
			<DashboardDataTableSection
				color="yellow"
				count={(registrationPagination?.totalPages ?? 1) * (registrationPagination?.limit ?? 0)}
				isLoading={registrationQueryResult.isPending}
				isDownloadLoading={registrationDownloadMutation.isPending}
				label="Volunteer - Registration"
				sortOptions={VOLUNTEER_SORT_OPTIONS}
				statusOptions={ASH_STATUS_OPTIONS}
				table={registrationTable.table}
				onDownload={() => registrationDownloadMutation.mutate()}
			/>
			<DashboardDataTableSection
				color="red"
				count={(feedbackPagination?.totalPages ?? 1) * (feedbackPagination?.limit ?? 0)}
				isLoading={feedbackQueryResult.isPending}
				isDownloadLoading={feedbackDownloadMutation.isPending}
				label="Volunteer - Feedback"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

const getTextColumn = <TRecord extends FormRecord>(
	id: string,
	label: string,
	accessorFn: (row: TRecord) => unknown,
	enableColumnFilter = true
): ColumnDef<TRecord> => {
	return {
		accessorFn,
		cell: ({ row }) => (
			<p className="text-[14px] text-cedar-black/87">{formatDashboardDetailValue(row.getValue(id))}</p>
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

const getActionsColumn = <TRecord extends FormRecord>(
	target: FormDataActionTarget,
	onViewMore: (record: SelectedRecord) => void
): ColumnDef<TRecord> => {
	return {
		cell: ({ row }) => (
			<RowActions
				record={row.original}
				target={target}
				onViewMore={() => {
					const firstName =
						"firstName" in row.original ? row.original.firstName : row.original.studentFirstName;
					const surname =
						"surname" in row.original ? row.original.surname : row.original.studentSurname;
					const title = `${firstName || EMPTY_VALUE_PLACEHOLDER} ${surname || EMPTY_VALUE_PLACEHOLDER}`;

					const id = row.original.id;

					const getStatus = () => {
						if ("status" in row.original) {
							return row.original.status;
						}

						if ("adminStatus" in row.original) {
							return row.original.adminStatus;
						}

						return null;
					};

					const status = getStatus();

					const selectedRecordByProgram = {
						ash: {
							id,
							kind: target.program === "ash" ? target.kind : "feedback",
							program: "ash",
							status,
							title,
						},
						tacots: {
							id,
							kind: target.program === "tacots" ? target.kind : "feedback",
							program: "tacots",
							status,
							title,
						},
						volunteer: {
							id,
							kind: target.program === "volunteer" ? target.kind : "feedback",
							program: "volunteer",
							status,
							title,
						},
					} satisfies Record<SelectedRecord["program"], SelectedRecord>;

					onViewMore(selectedRecordByProgram[target.program]);
				}}
			/>
		),
		enableHiding: false,
		header: "ACTIONS",
		id: "actions",
	};
};

function RowActions(props: { onViewMore: () => void; record: FormRecord; target: FormDataActionTarget }) {
	const { onViewMore, record, target } = props;
	const queryClient = useQueryClient();

	const ashStatusMutation = useMutation(ashRegistrationStatusMutation(record.id));
	const ashDeleteMutation = useMutation(ashRegistrationDeleteMutation(record.id));
	const tacotsStatusMutation = useMutation(tacotsRecommendationStatusMutation(record.id));
	const tacotsDeleteMutation = useMutation(tacotsRecommendationDeleteMutation(record.id));
	const tacotsFeedbackDelete = useMutation(tacotsFeedbackDeleteMutation(record.id));
	const volunteerStatusMutation = useMutation(volunteerRegistrationStatusMutation(record.id));
	const volunteerRegistrationDelete = useMutation(volunteerRegistrationDeleteMutation(record.id));
	const volunteerFeedbackDelete = useMutation(volunteerFeedbackDeleteMutation(record.id));

	const isAshRegistration = target.program === "ash" && target.kind === "registration";
	const isAshFeedback = target.program === "ash" && target.kind === "feedback";
	const isTacotsRecommendation = target.program === "tacots" && target.kind === "recommendation";
	const isTacotsFeedback = target.program === "tacots" && target.kind === "feedback";
	const isVolunteerRegistration = target.program === "volunteer" && target.kind === "registration";
	const isVolunteerFeedback = target.program === "volunteer" && target.kind === "feedback";

	const invalidateListQueries = () => {
		if (isAshRegistration) {
			void queryClient.invalidateQueries({
				queryKey: ashRegistrationFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (isAshFeedback) {
			void queryClient.invalidateQueries({
				queryKey: ashFeedbackFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (isTacotsRecommendation) {
			void queryClient.invalidateQueries({
				queryKey: tacotsRecommendationFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (isTacotsFeedback) {
			void queryClient.invalidateQueries({
				queryKey: tacotsFeedbackFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (isVolunteerRegistration) {
			void queryClient.invalidateQueries({
				queryKey: volunteerRegistrationFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (isVolunteerFeedback) {
			void queryClient.invalidateQueries({
				queryKey: volunteerFeedbackFormDataQuery().queryKey.slice(0, -1),
			});
		}
	};

	const acceptAction = (() => {
		if (isAshRegistration) {
			return () => ashStatusMutation.mutate("accepted", { onSuccess: invalidateListQueries });
		}

		if (isTacotsRecommendation) {
			return () => tacotsStatusMutation.mutate("SELECTED", { onSuccess: invalidateListQueries });
		}

		if (isVolunteerRegistration) {
			return () => volunteerStatusMutation.mutate("accepted", { onSuccess: invalidateListQueries });
		}

		return null;
	})();

	const rejectAction = (() => {
		if (isAshRegistration) {
			return () => ashStatusMutation.mutate("rejected", { onSuccess: invalidateListQueries });
		}

		if (isTacotsRecommendation) {
			return () => tacotsStatusMutation.mutate("NOT SELECTED", { onSuccess: invalidateListQueries });
		}

		if (isVolunteerRegistration) {
			return () => volunteerStatusMutation.mutate("rejected", { onSuccess: invalidateListQueries });
		}

		return null;
	})();

	const canDelete = Boolean(acceptAction) || isAshFeedback || isTacotsFeedback || isVolunteerFeedback;

	const handleDelete = () => {
		if (isAshRegistration || isAshFeedback) {
			ashDeleteMutation.mutate(undefined, { onSuccess: invalidateListQueries });
			return;
		}

		if (isTacotsRecommendation) {
			tacotsDeleteMutation.mutate(undefined, { onSuccess: invalidateListQueries });
			return;
		}

		if (isTacotsFeedback) {
			tacotsFeedbackDelete.mutate(undefined, { onSuccess: invalidateListQueries });
			return;
		}

		if (isVolunteerRegistration) {
			volunteerRegistrationDelete.mutate(undefined, { onSuccess: invalidateListQueries });
			return;
		}

		if (isVolunteerFeedback) {
			volunteerFeedbackDelete.mutate(undefined, { onSuccess: invalidateListQueries });
		}
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="rounded-[10px] border border-cedar-black/16 px-4 py-2 text-[14px]
					text-cedar-black/87 transition-colors hover:bg-cedar-grey"
			>
				Actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" className="w-[150px] rounded-[20px] border-cedar-black/16 p-3">
				<DropdownMenu.Item className="justify-center" onClick={onViewMore}>
					View More
				</DropdownMenu.Item>
				{acceptAction && (
					<DropdownMenu.Item
						className="justify-center text-cedar-yellow focus:text-cedar-yellow"
						onClick={acceptAction}
					>
						Accept
					</DropdownMenu.Item>
				)}
				{rejectAction && (
					<DropdownMenu.Item
						className="justify-center text-cedar-red focus:text-cedar-red"
						onClick={rejectAction}
					>
						Reject
					</DropdownMenu.Item>
				)}
				{canDelete && (
					<DropdownMenu.Item
						className="justify-center text-cedar-red focus:text-cedar-red"
						onClick={handleDelete}
					>
						Delete
					</DropdownMenu.Item>
				)}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

function FormDataDetailsDialog(props: {
	onOpenChange: (record: SelectedRecord | null) => void;
	selectedRecord: SelectedRecord | null;
}) {
	const { onOpenChange, selectedRecord } = props;
	const queryClient = useQueryClient();

	const selectedRecordId = selectedRecord?.id ?? "";

	const ashRegistrationDetailQueryResult = useQuery({
		...ashRegistrationFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "ash" && selectedRecord.kind === "registration",
	});

	const ashFeedbackDetailQueryResult = useQuery({
		...ashFeedbackFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "ash" && selectedRecord.kind === "feedback",
	});

	const tacotsRecommendationDetailQueryResult = useQuery({
		...tacotsRecommendationFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation",
	});

	const tacotsFeedbackDetailQueryResult = useQuery({
		...tacotsFeedbackFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "tacots" && selectedRecord.kind === "feedback",
	});

	const volunteerRegistrationDetailQueryResult = useQuery({
		...volunteerRegistrationFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration",
	});

	const volunteerFeedbackDetailQueryResult = useQuery({
		...volunteerFeedbackFormDetailQuery(selectedRecordId),
		enabled: selectedRecord?.program === "volunteer" && selectedRecord.kind === "feedback",
	});

	const ashStatusMutation = useMutation(ashRegistrationStatusMutation(selectedRecordId));
	const ashDeleteMutation = useMutation(ashRegistrationDeleteMutation(selectedRecordId));
	const tacotsStatusMutation = useMutation(tacotsRecommendationStatusMutation(selectedRecordId));
	const tacotsDeleteMutation = useMutation(tacotsRecommendationDeleteMutation(selectedRecordId));
	const volunteerStatusMutation = useMutation(volunteerRegistrationStatusMutation(selectedRecordId));
	const volunteerDeleteMutation = useMutation(volunteerRegistrationDeleteMutation(selectedRecordId));

	const record = (() => {
		if (selectedRecord?.program === "ash" && selectedRecord.kind === "registration") {
			return ashRegistrationDetailQueryResult.data?.data;
		}

		if (selectedRecord?.program === "ash" && selectedRecord.kind === "feedback") {
			return ashFeedbackDetailQueryResult.data?.data;
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation") {
			return tacotsRecommendationDetailQueryResult.data?.data;
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "feedback") {
			return tacotsFeedbackDetailQueryResult.data?.data;
		}

		if (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration") {
			return volunteerRegistrationDetailQueryResult.data?.data;
		}

		if (selectedRecord?.program === "volunteer" && selectedRecord.kind === "feedback") {
			return volunteerFeedbackDetailQueryResult.data?.data;
		}

		return null;
	})();

	const rows = getDashboardDetailRows(record);

	const status =
		(() => {
			if (!record) return;

			if ("status" in record) {
				return record.status;
			}

			if ("adminStatus" in record) {
				return record.adminStatus;
			}

			return selectedRecord?.status;
		})() ?? selectedRecord?.status;
	const statusLabel = status === "NOT SELECTED" ? "Reject" : status;

	const submittedAt = record?.createdAt;

	const submittedDate =
		submittedAt ?
			new Intl.DateTimeFormat("en", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}).format(new Date(submittedAt))
		:	EMPTY_VALUE_PLACEHOLDER;

	const isReviewableRecord =
		(selectedRecord?.program === "ash" && selectedRecord.kind === "registration")
		|| (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation")
		|| (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration");

	const invalidateListQueries = () => {
		if (selectedRecord?.program === "ash" && selectedRecord.kind === "registration") {
			void queryClient.invalidateQueries({
				queryKey: ashRegistrationFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation") {
			void queryClient.invalidateQueries({
				queryKey: tacotsRecommendationFormDataQuery().queryKey.slice(0, -1),
			});
			return;
		}

		if (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration") {
			void queryClient.invalidateQueries({
				queryKey: volunteerRegistrationFormDataQuery().queryKey.slice(0, -1),
			});
		}
	};

	const onDetailActionSuccess = () => {
		invalidateListQueries();
		onOpenChange(null);
	};

	const handleAccept = () => {
		if (selectedRecord?.program === "ash" && selectedRecord.kind === "registration") {
			ashStatusMutation.mutate("accepted", { onSuccess: onDetailActionSuccess });
			return;
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation") {
			tacotsStatusMutation.mutate("SELECTED", { onSuccess: onDetailActionSuccess });
			return;
		}

		if (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration") {
			volunteerStatusMutation.mutate("accepted", { onSuccess: onDetailActionSuccess });
		}
	};

	const handleDelete = () => {
		if (selectedRecord?.program === "ash" && selectedRecord.kind === "registration") {
			ashDeleteMutation.mutate(undefined, { onSuccess: onDetailActionSuccess });
			return;
		}

		if (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation") {
			tacotsDeleteMutation.mutate(undefined, { onSuccess: onDetailActionSuccess });
			return;
		}

		if (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration") {
			volunteerDeleteMutation.mutate(undefined, { onSuccess: onDetailActionSuccess });
		}
	};

	const isActionPending =
		ashStatusMutation.isPending
		|| ashDeleteMutation.isPending
		|| tacotsStatusMutation.isPending
		|| tacotsDeleteMutation.isPending
		|| volunteerStatusMutation.isPending
		|| volunteerDeleteMutation.isPending;

	const detailDescription = (() => {
		if (selectedRecord?.program === "ash") {
			return selectedRecord.kind === "registration" ? "ASH Registration" : "ASH Feedback";
		}

		if (selectedRecord?.program === "tacots") {
			return selectedRecord.kind === "recommendation" ? "TACOTS Recommendation" : "TACOTS Feedback";
		}

		if (selectedRecord?.program === "volunteer") {
			return selectedRecord.kind === "registration" ? "Volunteer Registration" : "Volunteer Feedback";
		}

		return "";
	})();

	return (
		<DialogAnimated.Root
			open={Boolean(selectedRecord)}
			onOpenChange={(open) => !open && onOpenChange(null)}
		>
			<DialogAnimated.Content
				withCloseButton={false}
				className="flex max-h-[92vh] w-[min(calc(100vw-32px),760px)] flex-col overflow-hidden
					rounded-[28px] border-0 bg-cedar-white p-0 shadow-[0_24px_80px_hsl(0,0%,0%,0.24)]
					lg:w-[760px]"
			>
				{selectedRecord && (
					<>
						<DialogAnimated.Header
							className="shrink-0 flex-row items-start justify-between gap-5 border-b
								border-cedar-black/10 bg-cedar-white px-7 pt-7 pb-6 text-left lg:px-10 lg:pt-10"
						>
							<div className="flex flex-col gap-1">
								<DialogAnimated.Title className="text-[22px] text-cedar-black">
									{selectedRecord.title}
								</DialogAnimated.Title>
								<DialogAnimated.Description
									className="text-[15px] text-cedar-black/72 lg:text-[16px]"
								>
									{detailDescription} - {submittedDate}
								</DialogAnimated.Description>
							</div>
							{statusLabel && <StatusPill status={statusLabel} />}
						</DialogAnimated.Header>

						<ForWithWrapper
							className="grow overflow-x-hidden overflow-y-auto bg-cedar-grey/24 p-5 lg:px-8"
							each={rows}
							renderItem={(row) => (
								<li
									key={row.label}
									className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-5
										border-b border-cedar-black/8 bg-cedar-white px-5 py-4 text-[14px]
										first:rounded-t-[18px] last:rounded-b-[18px] last:border-b-0 lg:text-[16px]"
								>
									<span className="min-w-0 wrap-break-word text-cedar-black/87 capitalize">
										{row.label}
									</span>
									<span
										className="min-w-0 text-right font-semibold wrap-break-word
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
							className="shrink-0 gap-4 border-t border-cedar-black/10 bg-cedar-white px-7 pt-5 pb-7
								lg:px-10 lg:pb-10"
						>
							{isReviewableRecord && (
								<div className="flex gap-4">
									<Button
										isDisabled={isActionPending}
										className="h-12 w-full rounded-[12px] px-6 text-[15px] lg:h-12 lg:px-6
											lg:text-[15px]"
										onClick={handleAccept}
									>
										Accept
									</Button>
									<Button
										theme="secondary"
										isDisabled={isActionPending}
										className="h-12 w-full rounded-[12px] px-6 text-[15px] lg:h-12 lg:px-6
											lg:text-[15px]"
										onClick={handleDelete}
									>
										Delete
									</Button>
								</div>
							)}

							<DialogAnimated.Close
								className="h-12 rounded-[12px] border border-cedar-red text-[15px] font-semibold
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

function StatusPill({ status }: { status: string }) {
	const normalizedStatus = status.toLowerCase();

	return (
		<span
			className={cnMerge(
				"inline-flex rounded-[8px] px-4 py-2 text-[12px] font-medium whitespace-nowrap",
				(normalizedStatus.includes("accept") || normalizedStatus.includes("select"))
					&& !normalizedStatus.includes("not")
					&& "bg-cedar-yellow/16 text-cedar-yellow",
				(normalizedStatus.includes("pending") || normalizedStatus.includes("keep"))
					&& "bg-cedar-black/12 text-cedar-black",
				(normalizedStatus.includes("reject")
					|| normalizedStatus.includes("delete")
					|| normalizedStatus.includes("not selected"))
					&& "bg-cedar-red/16 text-cedar-red",
				normalizedStatus.includes("review") && "bg-cedar-grey text-cedar-black/85"
			)}
		>
			{status}
		</span>
	);
}

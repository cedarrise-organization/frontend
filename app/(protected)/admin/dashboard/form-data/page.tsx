"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
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
	type AshRegistrationFormDataListQuery,
	type AshRegistrationFormDataQueryResult,
	type TacotsFeedbackFormDataQueryResult,
	type TacotsRecommendationFormDataQueryResult,
	type VolunteerFeedbackFormDataQueryResult,
	type VolunteerRegistrationFormDataQueryResult,
} from "@/lib/react-query/queryOptions";
import { cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
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
		sort: "ashFeedbackSort",
	},
	registration: {
		filters: "ashRegistrationFilters",
		joinOperator: "ashRegistrationJoinOperator",
		page: "ashRegistrationPage",
		perPage: "ashRegistrationPerPage",
		sort: "ashRegistrationSort",
	},
} as const satisfies Record<AshFormKind, QueryKeys>;

const TACOTS_FORM_DATA_QUERY_KEYS = {
	feedback: {
		filters: "tacotsFeedbackFilters",
		joinOperator: "tacotsFeedbackJoinOperator",
		page: "tacotsFeedbackPage",
		perPage: "tacotsFeedbackPerPage",
		sort: "tacotsFeedbackSort",
	},
	recommendation: {
		filters: "tacotsRecommendationFilters",
		joinOperator: "tacotsRecommendationJoinOperator",
		page: "tacotsRecommendationPage",
		perPage: "tacotsRecommendationPerPage",
		sort: "tacotsRecommendationSort",
	},
} as const satisfies Record<TacotsFormKind, QueryKeys>;

const VOLUNTEER_FORM_DATA_QUERY_KEYS = {
	feedback: {
		filters: "volunteerFeedbackFilters",
		joinOperator: "volunteerFeedbackJoinOperator",
		page: "volunteerFeedbackPage",
		perPage: "volunteerFeedbackPerPage",
		sort: "volunteerFeedbackSort",
	},
	registration: {
		filters: "volunteerRegistrationFilters",
		joinOperator: "volunteerRegistrationJoinOperator",
		page: "volunteerRegistrationPage",
		perPage: "volunteerRegistrationPerPage",
		sort: "volunteerRegistrationSort",
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
	{ label: "Created", value: "createdAt" },
] as const;

const TACOTS_RECOMMENDATION_SORT_OPTIONS = [
	{ label: "First Name", value: "firstName" },
	{ label: "Surname", value: "surname" },
	{ label: "Gender", value: "gender" },
	{ label: "School Name", value: "schoolName" },
	{ label: "Last Class", value: "lastClass" },
	{ label: "Created", value: "createdAt" },
] as const;

const VOLUNTEER_SORT_OPTIONS = [
	{ label: "First Name", value: "firstName" },
	{ label: "Surname", value: "surname" },
	{ label: "Email", value: "emailAddress" },
	{ label: "Phone", value: "phoneNumber" },
	{ label: "State", value: "state" },
	{ label: "Volunteer Area", value: "volunteerAreas" },
	{ label: "Created", value: "createdAt" },
] as const;

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

const TOOLBAR_ORDER_OPTIONS = [
	{ label: "Ascending", value: "asc" },
	{ label: "Descending", value: "desc" },
] as const;

const EMPTY_SORT_OPTIONS: ReadonlyArray<{ label: string; value: string }> = [];

type AshRegistrationFormRecord = AshRegistrationFormDataQueryResult["data"][number];

type AshFeedbackFormRecord = AshFeedbackFormDataQueryResult["data"][number];

type TacotsRecommendationFormRecord = TacotsRecommendationFormDataQueryResult["data"][number];

type TacotsFeedbackFormRecord = TacotsFeedbackFormDataQueryResult["data"][number];

type VolunteerRegistrationFormRecord = VolunteerRegistrationFormDataQueryResult["data"][number];

type VolunteerFeedbackFormRecord = VolunteerFeedbackFormDataQueryResult["data"][number];

type FormDataOrderBy = NonNullable<AshRegistrationFormDataListQuery>["orderBy"];

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
	title: string;
};

type TacotsSelectedRecord = {
	id: string;
	kind: TacotsFormKind;
	program: "tacots";
	title: string;
};

type VolunteerSelectedRecord = {
	id: string;
	kind: VolunteerFormKind;
	program: "volunteer";
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
		<Main className="gap-6 lg:gap-8">
			<header>
				<h1 className="text-[24px] font-semibold text-cedar-black lg:text-[40px]">Forms & Tracking</h1>
			</header>

			<TabsAnimated.Root defaultValue="ash">
				<Card.Root className="rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red shadow-none",
							list: "h-12 min-w-[330px] rounded-[12px] bg-cedar-grey p-1",
						}}
					>
						<For
							each={FORM_DATA_TABSANIMATED}
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

	const registrationColumns = useAshRegistrationColumns({ onViewMore });
	const feedbackColumns = useAshFeedbackColumns({ onViewMore });

	const registrationQuery = useFormDataQueryState({
		pageKey: ASH_FORM_DATA_QUERY_KEYS.registration.page,
		perPageKey: ASH_FORM_DATA_QUERY_KEYS.registration.perPage,
		sortableColumnIds: AshTrackingSortByOptions,
		sortKey: ASH_FORM_DATA_QUERY_KEYS.registration.sort,
	});

	const feedbackQuery = useFormDataQueryState({
		pageKey: ASH_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: ASH_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: ASH_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [search] = useQueryState("ashFormDataSearch", parseAsString.withDefault(""));
	const [statusFilter] = useQueryState(
		"ashFormDataStatus",
		parseAsArrayOf(parseAsStringLiteral(ReviewStatusOptions)).withDefault([])
	);

	const registrationQueryResult = useQuery(
		ashRegistrationFormDataQuery({
			limit: registrationQuery.limit,
			page: registrationQuery.page,
			...(registrationQuery.orderBy && { orderBy: registrationQuery.orderBy }),
			...(search && { search }),
			...(registrationQuery.sortBy && { sortBy: registrationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		ashFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackQuery.orderBy && { orderBy: feedbackQuery.orderBy }),
			...(search && { search }),
		})
	);

	const registrationDownloadMutation = useMutation(ashFormDataDownloadMutation("registration"));
	const feedbackDownloadMutation = useMutation(ashFormDataDownloadMutation("feedback"));

	const registrationMetadata = registrationQueryResult.data?.meta.metadata;
	const registrationRecords = registrationQueryResult.data?.data ?? [];
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];

	const dashboardStats = [
		{ label: "Total Submissions", value: registrationMetadata?.totalSubmissions ?? 0 },
		{ label: "Pending Review", value: registrationMetadata?.pendingStudents ?? 0 },
		{ label: "Accepted", value: registrationMetadata?.acceptedStudents ?? 0 },
		{ label: "Rejected", value: registrationMetadata?.rejectedStudents ?? 0 },
	] as const;

	const registrationTable = useDataTable<AshRegistrationFormRecord>({
		columns: registrationColumns,
		data: registrationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: registrationQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_FORM_DATA_QUERY_KEYS.registration,
	});

	const feedbackTable = useDataTable<AshFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: ASH_FORM_DATA_QUERY_KEYS.feedback,
	});

	return (
		<>
			<FormDataStats stats={dashboardStats} />
			<FormDataTableSection
				color="yellow"
				count={registrationRecords.length}
				isLoading={registrationQueryResult.isPending}
				label="ASH - Student Registrations"
				searchQueryKey="ashFormDataSearch"
				sortOptions={ASH_SORT_OPTIONS}
				statusColumnId="status"
				statusQueryKey="ashFormDataStatus"
				statusOptions={ASH_STATUS_OPTIONS}
				table={registrationTable.table}
				onDownload={() => registrationDownloadMutation.mutate()}
			/>
			<FormDataTableSection
				color="red"
				count={feedbackRecords.length}
				isLoading={feedbackQueryResult.isPending}
				label="ASH - Program Feedback"
				searchQueryKey="ashFormDataSearch"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

function TacotsFormDataTab(props: { onViewMore: (record: SelectedRecord) => void }) {
	const { onViewMore } = props;

	const recommendationColumns = useTacotsRecommendationColumns({ onViewMore });
	const feedbackColumns = useTacotsFeedbackColumns({ onViewMore });

	const recommendationQuery = useFormDataQueryState({
		pageKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.page,
		perPageKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.perPage,
		sortableColumnIds: TacotsRecommendationSortByOptions,
		sortKey: TACOTS_FORM_DATA_QUERY_KEYS.recommendation.sort,
	});

	const feedbackQuery = useFormDataQueryState({
		pageKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: TACOTS_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [search] = useQueryState("tacotsFormDataSearch", parseAsString.withDefault(""));
	const [statusFilter] = useQueryState(
		"tacotsRecommendationStatus",
		parseAsArrayOf(parseAsStringLiteral(AdminReviewStatusOptions)).withDefault([])
	);

	const recommendationQueryResult = useQuery(
		tacotsRecommendationFormDataQuery({
			limit: recommendationQuery.limit,
			page: recommendationQuery.page,
			...(recommendationQuery.orderBy && { orderBy: recommendationQuery.orderBy }),
			...(search && { search }),
			...(recommendationQuery.sortBy && { sortBy: recommendationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		tacotsFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackQuery.orderBy && { orderBy: feedbackQuery.orderBy }),
			...(search && { search }),
		})
	);

	const recommendationDownloadMutation = useMutation(tacotsFormDataDownloadMutation("recommendation"));
	const feedbackDownloadMutation = useMutation(tacotsFormDataDownloadMutation("feedback"));

	const recommendationMetadata = recommendationQueryResult.data?.meta.metadata;
	const recommendationRecords = recommendationQueryResult.data?.data ?? [];
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];

	const dashboardStats = [
		{ label: "Total Submissions", value: recommendationMetadata?.totalSubmissions ?? 0 },
		{ label: "Pending Review", value: recommendationMetadata?.pendingStudents ?? 0 },
		{ label: "Accepted", value: recommendationMetadata?.acceptedStudents ?? 0 },
		{ label: "Rejected", value: recommendationMetadata?.rejectedStudents ?? 0 },
	] as const;

	const recommendationTable = useDataTable<TacotsRecommendationFormRecord>({
		columns: recommendationColumns,
		data: recommendationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: recommendationQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_FORM_DATA_QUERY_KEYS.recommendation,
	});

	const feedbackTable = useDataTable<TacotsFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: TACOTS_FORM_DATA_QUERY_KEYS.feedback,
	});

	return (
		<>
			<FormDataStats stats={dashboardStats} />
			<FormDataTableSection
				color="yellow"
				count={recommendationRecords.length}
				isLoading={recommendationQueryResult.isPending}
				label="TACOTS - Recommendations"
				searchQueryKey="tacotsFormDataSearch"
				sortOptions={TACOTS_RECOMMENDATION_SORT_OPTIONS}
				statusColumnId="adminStatus"
				statusQueryKey="tacotsRecommendationStatus"
				statusOptions={TACOTS_RECOMMENDATION_STATUS_OPTIONS}
				table={recommendationTable.table}
				onDownload={() => recommendationDownloadMutation.mutate()}
			/>
			<FormDataTableSection
				color="red"
				count={feedbackRecords.length}
				isLoading={feedbackQueryResult.isPending}
				label="TACOTS - Program Feedback"
				searchQueryKey="tacotsFormDataSearch"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

function VolunteerFormDataTab(props: { onViewMore: (record: SelectedRecord) => void }) {
	const { onViewMore } = props;

	const registrationColumns = useVolunteerRegistrationColumns({ onViewMore });
	const feedbackColumns = useVolunteerFeedbackColumns({ onViewMore });

	const registrationQuery = useFormDataQueryState({
		pageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.page,
		perPageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.perPage,
		sortableColumnIds: VolunteerSortByOptions,
		sortKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration.sort,
	});

	const feedbackQuery = useFormDataQueryState({
		pageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.page,
		perPageKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.perPage,
		sortableColumnIds: [],
		sortKey: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback.sort,
	});

	const [search] = useQueryState("volunteerFormDataSearch", parseAsString.withDefault(""));
	const [statusFilter] = useQueryState(
		"volunteerRegistrationStatus",
		parseAsArrayOf(parseAsStringLiteral(ReviewStatusOptions)).withDefault([])
	);

	const registrationQueryResult = useQuery(
		volunteerRegistrationFormDataQuery({
			limit: registrationQuery.limit,
			page: registrationQuery.page,
			...(registrationQuery.orderBy && { orderBy: registrationQuery.orderBy }),
			...(search && { search }),
			...(registrationQuery.sortBy && { sortBy: registrationQuery.sortBy }),
			...(statusFilter[0] && { status: statusFilter[0] }),
		})
	);

	const feedbackQueryResult = useQuery(
		volunteerFeedbackFormDataQuery({
			limit: feedbackQuery.limit,
			page: feedbackQuery.page,
			...(feedbackQuery.orderBy && { orderBy: feedbackQuery.orderBy }),
			...(search && { search }),
		})
	);

	const registrationDownloadMutation = useMutation(volunteerFormDataDownloadMutation("registration"));
	const feedbackDownloadMutation = useMutation(volunteerFormDataDownloadMutation("feedback"));

	const registrationMetadata = registrationQueryResult.data?.meta.metadata;
	const registrationRecords = registrationQueryResult.data?.data ?? [];
	const feedbackRecords = feedbackQueryResult.data?.data ?? [];

	const dashboardStats = [
		{ label: "Total Submissions", value: registrationMetadata?.totalSubmissions ?? 0 },
		{ label: "Pending Review", value: registrationMetadata?.pendingStudents ?? 0 },
		{ label: "Accepted", value: registrationMetadata?.acceptedStudents ?? 0 },
		{ label: "Rejected", value: registrationMetadata?.rejectedStudents ?? 0 },
	] as const;

	const registrationTable = useDataTable<VolunteerRegistrationFormRecord>({
		columns: registrationColumns,
		data: registrationRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: registrationQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: VOLUNTEER_FORM_DATA_QUERY_KEYS.registration,
	});

	const feedbackTable = useDataTable<VolunteerFeedbackFormRecord>({
		columns: feedbackColumns,
		data: feedbackRecords,
		getRowId: (row) => row.id,
		initialState: FORM_DATA_TABLE_INITIAL_STATE,
		pageCount: feedbackQueryResult.data?.meta.pagination.totalPages ?? 1,
		queryKeys: VOLUNTEER_FORM_DATA_QUERY_KEYS.feedback,
	});

	return (
		<>
			<FormDataStats stats={dashboardStats} />
			<FormDataTableSection
				color="yellow"
				count={registrationRecords.length}
				isLoading={registrationQueryResult.isPending}
				label="Volunteer - Registration"
				searchQueryKey="volunteerFormDataSearch"
				sortOptions={VOLUNTEER_SORT_OPTIONS}
				statusColumnId="status"
				statusQueryKey="volunteerRegistrationStatus"
				statusOptions={ASH_STATUS_OPTIONS}
				table={registrationTable.table}
				onDownload={() => registrationDownloadMutation.mutate()}
			/>
			<FormDataTableSection
				color="red"
				count={feedbackRecords.length}
				isLoading={feedbackQueryResult.isPending}
				label="Volunteer - Feedback"
				searchQueryKey="volunteerFormDataSearch"
				table={feedbackTable.table}
				onDownload={() => feedbackDownloadMutation.mutate()}
			/>
		</>
	);
}

function FormDataStats(props: { stats: ReadonlyArray<{ label: string; value: number }> }) {
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
						</Card.Content>
					</Card.Root>
				)}
			/>
		</section>
	);
}

const useFormDataQueryState = <const TSortBy extends string>(props: {
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

const getOrderBy = (sort: { desc: boolean } | undefined): FormDataOrderBy => {
	if (!sort) return;

	return sort.desc ? "desc" : "asc";
};

function FormDataTableSection<TRecord extends FormRecord>(props: {
	color: "red" | "yellow";
	count: number;
	isLoading: boolean;
	label: string;
	onDownload: () => void;
	searchQueryKey: string;
	sortOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusColumnId?: string;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusQueryKey?: string;
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
		statusColumnId,
		statusOptions,
		statusQueryKey,
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
				<FormDataTableToolbar
					searchQueryKey={searchQueryKey}
					sortOptions={sortOptions}
					statusColumnId={statusColumnId}
					statusQueryKey={statusQueryKey}
					statusOptions={statusOptions}
					table={table}
				/>
			</Card.Content>

			<Card.Footer className="block p-0">
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

function FormDataTableToolbar<TRecord extends FormRecord>(props: {
	searchQueryKey: string;
	sortOptions: ReadonlyArray<{ label: string; value: string }>;
	statusColumnId?: string;
	statusOptions?: ReadonlyArray<{ label: string; value: string }>;
	statusQueryKey?: string;
	table: ReturnType<typeof useDataTable<TRecord>>["table"];
}) {
	const { searchQueryKey, sortOptions, statusColumnId, statusOptions, statusQueryKey, table } = props;

	const queryKeys = table.options.meta?.queryKeys;
	const pageQueryKey = queryKeys?.page ?? "page";
	const sortQueryKey = queryKeys?.sort ?? "sort";
	const resolvedStatusQueryKey = statusQueryKey ?? "unusedStatusFilter";

	const [, setSearch] = useQueryState(searchQueryKey, parseAsString.withDefault(""));
	const [, setPage] = useQueryState(pageQueryKey, parseAsInteger.withDefault(1));
	const [, setSort] = useQueryState(sortQueryKey, parseAsString);
	const [, setStatus] = useQueryState(
		resolvedStatusQueryKey,
		parseAsArrayOf(parseAsString).withDefault([])
	);

	const columns = table.getAllColumns();
	const searchColumn = columns.find((column) => column.id === "firstName");
	const statusColumn =
		statusColumnId ? columns.find((column) => column.id === statusColumnId) : undefined;
	const sorting = table.getState().sorting[0];
	const statusFilterValue = statusColumn?.getFilterValue();
	const status =
		Array.isArray(statusFilterValue) && typeof statusFilterValue[0] === "string" ?
			statusFilterValue[0]
		:	"";
	const sortBy = sorting?.id ?? "";
	const orderBy = getOrderBy(sorting) ?? "";
	const searchFilterValue = searchColumn?.getFilterValue() as string | undefined;
	const hasSortControls = sortOptions.length > 0;

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		searchColumn?.setFilterValue(value);
		void setSearch(value || null);
		void setPage(1);
	};

	const handleSortByChange = (value: string) => {
		table.setSorting(value ? [{ desc: orderBy === "desc", id: value }] : []);
	};

	const handleOrderByChange = (value: string) => {
		if (!sortBy) return;

		table.setSorting([{ desc: value === "desc", id: sortBy }]);
	};

	const handleStatusChange = (value: string) => {
		statusColumn?.setFilterValue(value ? [value] : undefined);
		void setStatus(value ? [value] : null);
		void setPage(1);
	};

	const handleResetFilters = () => {
		searchColumn?.setFilterValue(null);
		statusColumn?.setFilterValue(null);
		table.setSorting([]);
		table.setPageIndex(0);
		void setSearch(null);
		void setStatus(null);
		void setSort(null);
	};

	return (
		<div className="flex flex-wrap items-center gap-3 lg:gap-4">
			<label
				className="flex h-[40px] w-full max-w-[430px] items-center gap-3 rounded-[12px] bg-cedar-white
					px-4 text-[12px] text-cedar-black/64 lg:h-[40px] lg:max-w-[220px]"
			>
				<input
					placeholder="search this section"
					className="w-full bg-transparent outline-none placeholder:text-cedar-black/36"
					value={searchFilterValue}
					onChange={handleSearchChange}
				/>
			</label>

			{hasSortControls && (
				<ToolbarSelect
					placeholder="Sort By"
					value={sortBy}
					onValueChange={handleSortByChange}
					options={sortOptions}
				/>
			)}

			{statusColumn && statusOptions && (
				<ToolbarSelect
					placeholder="Status"
					value={status}
					onValueChange={handleStatusChange}
					options={statusOptions}
				/>
			)}

			{hasSortControls && (
				<ToolbarSelect
					placeholder="Order By"
					value={orderBy}
					onValueChange={handleOrderByChange}
					options={TOOLBAR_ORDER_OPTIONS}
				/>
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

const useAshRegistrationColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<AshRegistrationFormRecord>>>(() => {
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
};

const useAshFeedbackColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<AshFeedbackFormRecord>>>(() => {
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
};

const useTacotsRecommendationColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<TacotsRecommendationFormRecord>>>(() => {
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
};

const useTacotsFeedbackColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<TacotsFeedbackFormRecord>>>(() => {
		return [
			getTextColumn("firstName", "FIRST NAME", (row) => row.studentFirstName),
			getTextColumn("surname", "SURNAME", (row) => row.studentSurname),
			getTextColumn("parentGuardianPhone", "PARENT/GUARDIAN PHONE", (row) => row.parentPhone, false),
			getTextColumn("currentSchool", "CURRENT SCHOOL", (row) => row.currentSchool, false),
			getTextColumn("currentClass", "CURRENT CLASS", (row) => row.currentClass, false),
			getActionsColumn({ kind: "feedback", program: "tacots" }, onViewMore),
		];
	}, [onViewMore]);
};

const useVolunteerRegistrationColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<VolunteerRegistrationFormRecord>>>(() => {
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
};

const useVolunteerFeedbackColumns = (props: { onViewMore: (record: SelectedRecord) => void }) => {
	const { onViewMore } = props;

	return useMemo<Array<ColumnDef<VolunteerFeedbackFormRecord>>>(() => {
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
};

const getTextColumn = <TRecord extends FormRecord>(
	id: string,
	label: string,
	accessorFn: (row: TRecord) => unknown,
	enableColumnFilter = true
): ColumnDef<TRecord> => {
	return {
		accessorFn,
		cell: ({ row }) => (
			<span className="text-[13px] text-cedar-black/72">{formatDetailValue(row.getValue(id))}</span>
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

const getActionsColumn = <TRecord extends FormRecord>(
	target: FormDataActionTarget,
	onViewMore: (record: SelectedRecord) => void
): ColumnDef<TRecord> => {
	return {
		cell: ({ row }) => (
			<RowActions
				record={row.original}
				target={target}
				onViewMore={() =>
					onViewMore(
						getSelectedRecordFromActionTarget(target, row.original.id, getRecordName(row.original))
					)
				}
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
	const volunteerStatusMutation = useMutation(volunteerRegistrationStatusMutation(record.id));
	const volunteerRegistrationDelete = useMutation(volunteerRegistrationDeleteMutation(record.id));
	const volunteerFeedbackDelete = useMutation(volunteerFeedbackDeleteMutation(record.id));

	const isAshRegistration = target.program === "ash" && target.kind === "registration";
	const isTacotsRecommendation = target.program === "tacots" && target.kind === "recommendation";
	const isVolunteerRegistration = target.program === "volunteer" && target.kind === "registration";
	const isVolunteerFeedback = target.program === "volunteer" && target.kind === "feedback";
	const canReview = isAshRegistration || isTacotsRecommendation || isVolunteerRegistration;
	const canDelete = canReview || isVolunteerFeedback;

	const invalidateListQueries = async () => {
		if (isAshRegistration) {
			await queryClient.invalidateQueries({ queryKey: ashRegistrationFormDataQuery().queryKey });
			return;
		}

		if (isTacotsRecommendation) {
			await queryClient.invalidateQueries({ queryKey: tacotsRecommendationFormDataQuery().queryKey });
			return;
		}

		if (isVolunteerRegistration) {
			await queryClient.invalidateQueries({ queryKey: volunteerRegistrationFormDataQuery().queryKey });
			return;
		}

		if (isVolunteerFeedback) {
			await queryClient.invalidateQueries({ queryKey: volunteerFeedbackFormDataQuery().queryKey });
		}
	};

	const handleAccept = () => {
		if (isAshRegistration) {
			ashStatusMutation.mutate("accepted", { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (isTacotsRecommendation) {
			tacotsStatusMutation.mutate("SELECTED", { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (isVolunteerRegistration) {
			volunteerStatusMutation.mutate("accepted", { onSuccess: () => void invalidateListQueries() });
		}
	};

	const handleDelete = () => {
		if (isAshRegistration) {
			ashDeleteMutation.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (isTacotsRecommendation) {
			tacotsDeleteMutation.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (isVolunteerRegistration) {
			volunteerRegistrationDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
			return;
		}

		if (isVolunteerFeedback) {
			volunteerFeedbackDelete.mutate(undefined, { onSuccess: () => void invalidateListQueries() });
		}
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
				{canReview && (
					<DropdownMenu.Item
						className="justify-center text-cedar-yellow focus:text-cedar-yellow"
						onClick={handleAccept}
					>
						Accept
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

	const record = getSelectedRecordDetails({
		ashFeedbackRecord: ashFeedbackDetailQueryResult.data?.data,
		ashRegistrationRecord: ashRegistrationDetailQueryResult.data?.data,
		selectedRecord,
		tacotsFeedbackRecord: tacotsFeedbackDetailQueryResult.data?.data,
		tacotsRecommendationRecord: tacotsRecommendationDetailQueryResult.data?.data,
		volunteerFeedbackRecord: volunteerFeedbackDetailQueryResult.data?.data,
		volunteerRegistrationRecord: volunteerRegistrationDetailQueryResult.data?.data,
	});

	const rows = getDetailRows(record);
	const status = getRecordStatus(record);
	const isReviewableRecord =
		(selectedRecord?.program === "ash" && selectedRecord.kind === "registration")
		|| (selectedRecord?.program === "tacots" && selectedRecord.kind === "recommendation")
		|| (selectedRecord?.program === "volunteer" && selectedRecord.kind === "registration");

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
									{getDetailDescription(selectedRecord)} - {getRecordDate(record)}
								</DialogAnimated.Description>
							</div>
							{status && <StatusPill status={status} />}
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
							className="shrink-0 gap-5 border-t border-cedar-black/10 px-7 pt-5 pb-7 lg:px-10
								lg:pb-10"
						>
							{isReviewableRecord && (
								<div className="grid gap-4 sm:grid-cols-3">
									<Button
										className="h-12 rounded-[12px] px-6 text-[15px] lg:h-12 lg:px-6
											lg:text-[15px]"
									>
										Accept
									</Button>
									<Button
										theme="secondary"
										className="h-12 rounded-[12px] px-6 text-[15px] lg:h-12 lg:px-6
											lg:text-[15px]"
									>
										Delete
									</Button>
								</div>
							)}

							<DialogAnimated.Close
								className="h-12 rounded-[12px] border border-cedar-red text-[15px] font-medium
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

const getSelectedRecordDetails = (records: {
	ashFeedbackRecord: AshFeedbackFormRecord | undefined;
	ashRegistrationRecord: AshRegistrationFormRecord | undefined;
	selectedRecord: SelectedRecord | null;
	tacotsFeedbackRecord: TacotsFeedbackFormRecord | undefined;
	tacotsRecommendationRecord: TacotsRecommendationFormRecord | undefined;
	volunteerFeedbackRecord: VolunteerFeedbackFormRecord | undefined;
	volunteerRegistrationRecord: VolunteerRegistrationFormRecord | undefined;
}): FormRecord | undefined => {
	const {
		ashFeedbackRecord,
		ashRegistrationRecord,
		selectedRecord,
		tacotsFeedbackRecord,
		tacotsRecommendationRecord,
		volunteerFeedbackRecord,
		volunteerRegistrationRecord,
	} = records;

	if (selectedRecord?.program === "ash") {
		return selectedRecord.kind === "registration" ? ashRegistrationRecord : ashFeedbackRecord;
	}

	if (selectedRecord?.program === "tacots") {
		return selectedRecord.kind === "recommendation" ? tacotsRecommendationRecord : tacotsFeedbackRecord;
	}

	if (selectedRecord?.program === "volunteer") {
		return selectedRecord.kind === "registration" ?
				volunteerRegistrationRecord
			:	volunteerFeedbackRecord;
	}

	return undefined;
};

const getSelectedRecordFromActionTarget = (
	target: FormDataActionTarget,
	id: string,
	title: string
): SelectedRecord => {
	if (target.program === "ash") {
		return { id, kind: target.kind, program: target.program, title };
	}

	if (target.program === "tacots") {
		return { id, kind: target.kind, program: target.program, title };
	}

	return { id, kind: target.kind, program: target.program, title };
};

const getDetailDescription = (selectedRecord: SelectedRecord) => {
	if (selectedRecord.program === "ash") {
		return selectedRecord.kind === "registration" ? "ASH Registration" : "ASH Feedback";
	}

	if (selectedRecord.program === "tacots") {
		return selectedRecord.kind === "recommendation" ? "TACOTS Recommendation" : "TACOTS Feedback";
	}

	return selectedRecord.kind === "registration" ? "Volunteer Registration" : "Volunteer Feedback";
};

const getRecordDate = (record: { createdAt?: string } | undefined) => {
	const value = record?.createdAt;

	if (!value) {
		return EMPTY_VALUE_PLACEHOLDER;
	}

	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
};

const getRecordName = (record: FormRecord) => {
	const firstName = "firstName" in record ? record.firstName : record.studentFirstName;
	const surname = "surname" in record ? record.surname : record.studentSurname;

	return [firstName, surname].join(" ") || "Unnamed submission";
};

const getRecordStatus = (record: FormRecord | undefined): string | undefined => {
	if (!record) return;

	if ("status" in record) return record.status;

	if ("adminStatus" in record) return record.adminStatus;

	return undefined;
};

const labelizeKey = (key: string) => {
	return key
		.replaceAll(/([A-Z])/g, " $1")
		.replaceAll(/[_-]/g, " ")
		.replace(/^./, (value) => value.toUpperCase());
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

const FORM_RECORD_HIDDEN_KEYS = new Set(["deletedAt", "id", "updatedAt"]);

const getDetailRows = (record: FormRecord | undefined) => {
	if (!record) {
		return [];
	}

	return Object.entries(record)
		.filter(([key]) => !FORM_RECORD_HIDDEN_KEYS.has(key))
		.map(([key, value]) => ({ label: labelizeKey(key), value: formatDetailValue(value) }));
};

function StatusPill({ status }: { status: string }) {
	const normalizedStatus = status.toLowerCase();

	return (
		<span
			className={cnMerge(
				"inline-flex rounded-[8px] px-4 py-2 text-[12px] font-medium",
				(normalizedStatus.includes("accept") || normalizedStatus.includes("select"))
					&& !normalizedStatus.includes("not")
					&& "bg-cedar-yellow/16 text-cedar-yellow",
				(normalizedStatus.includes("pending") || normalizedStatus.includes("keep"))
					&& "bg-cedar-black/12 text-cedar-black",
				(normalizedStatus.includes("reject")
					|| normalizedStatus.includes("delete")
					|| normalizedStatus.includes("not selected"))
					&& "bg-cedar-red/16 text-cedar-red",
				normalizedStatus.includes("review") && "bg-cedar-grey text-cedar-black/70"
			)}
		>
			{status}
		</span>
	);
}

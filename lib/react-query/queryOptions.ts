import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { backendApiSchemaRoutes } from "../api/callBackendApi/apiSchema";
import { checkUserSessionForQuery } from "../api/callBackendApi/plugins/utils/session";

export const sessionQuery = (...params: Parameters<typeof checkUserSessionForQuery>) => {
	// eslint-disable-next-line tanstack-query/exhaustive-deps
	return queryOptions({
		queryFn: () => checkUserSessionForQuery(...params),
		queryKey: ["auth", "session"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export const ashRegistrationFormDataQuery = (query?: AshRegistrationFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/ash/registration", { query }),
		queryKey: ["form-data", "ash", "registration", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const ashFeedbackFormDataQuery = (query?: AshFeedbackFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/ash/feedback", { query }),
		queryKey: ["form-data", "ash", "feedback", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const ashRegistrationFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/ash/registration/:id", { params: { id } }),
		queryKey: ["form-data", "ash", "registration", id],
	});
};

export const ashFeedbackFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/ash/feedback/:id", { params: { id } }),
		queryKey: ["form-data", "ash", "feedback", id],
	});
};

export type AshRegistrationFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashRegistrationFormDataQuery>["queryFn"]>>
>;

export type AshFeedbackFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashFeedbackFormDataQuery>["queryFn"]>>
>;

export type AshRegistrationFormDetailQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashRegistrationFormDetailQuery>["queryFn"]>>
>;

export type AshFeedbackFormDetailQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashFeedbackFormDetailQuery>["queryFn"]>>
>;

export const tacotsRecommendationFormDataQuery = (query?: TacotsRecommendationFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/recommendation", { query }),
		queryKey: ["form-data", "tacots", "recommendation", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const tacotsFeedbackFormDataQuery = (query?: TacotsFeedbackFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/feedback", { query }),
		queryKey: ["form-data", "tacots", "feedback", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const tacotsRecommendationFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/recommendation/:id", { params: { id } }),
		queryKey: ["form-data", "tacots", "recommendation", id],
	});
};

export const tacotsFeedbackFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/feedback/:id", { params: { id } }),
		queryKey: ["form-data", "tacots", "feedback", id],
	});
};

export type TacotsRecommendationFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsRecommendationFormDataQuery>["queryFn"]>>
>;

export type TacotsFeedbackFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsFeedbackFormDataQuery>["queryFn"]>>
>;

export const volunteerRegistrationFormDataQuery = (query?: VolunteerRegistrationFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/volunteer", { query }),
		queryKey: ["form-data", "volunteer", "registration", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const volunteerFeedbackFormDataQuery = (query?: VolunteerFeedbackFormDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/volunteer/all/feedback", { query }),
		queryKey: ["form-data", "volunteer", "feedback", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const volunteerRegistrationFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/volunteer/:id", { params: { id } }),
		queryKey: ["form-data", "volunteer", "registration", id],
	});
};

export const volunteerFeedbackFormDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/volunteer/feedback/:id", { params: { id } }),
		queryKey: ["form-data", "volunteer", "feedback", id],
	});
};

export type VolunteerRegistrationFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof volunteerRegistrationFormDataQuery>["queryFn"]>>
>;

export type VolunteerFeedbackFormDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof volunteerFeedbackFormDataQuery>["queryFn"]>>
>;

export const ashAttendanceTrackerDataQuery = (query?: AshAttendanceTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/ash/attendance", { query }),
		queryKey: ["tracker-data", "ash", "attendance", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const ashAttendanceTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/ash/attendance/:id", { params: { id } }),
		queryKey: ["tracker-data", "ash", "attendance", id],
	});
};

export const ashExitTrackerDataQuery = (query?: AshExitTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/ash/exit", { query }),
		queryKey: ["tracker-data", "ash", "exit", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const ashExitTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/ash/exit/:id", { params: { id } }),
		queryKey: ["tracker-data", "ash", "exit", id],
	});
};

export const ashTrackingTrackerDataQuery = (query?: AshTrackingTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/ash/tracking", { query }),
		queryKey: ["tracker-data", "ash", "tracking", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const ashTrackingTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/ash/tracking/:id", { params: { id } }),
		queryKey: ["tracker-data", "ash", "tracking", id],
	});
};

export const capacityBuildingTrackerDataQuery = (query?: CapacityBuildingTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/capacity-building", { query }),
		queryKey: ["tracker-data", "capacity-building", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const capacityBuildingTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/capacity-building/:id", { params: { id } }),
		queryKey: ["tracker-data", "capacity-building", id],
	});
};

export const outreachTrackerDataQuery = (query?: OutreachTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/outreaches", { query }),
		queryKey: ["tracker-data", "outreaches", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const outreachTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/outreaches/:id", { params: { id } }),
		queryKey: ["tracker-data", "outreaches", id],
	});
};

export const tacotsExitTrackerDataQuery = (query?: TacotsExitTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/exit", { query }),
		queryKey: ["tracker-data", "tacots", "exit", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const tacotsExitTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/exit/:id", { params: { id } }),
		queryKey: ["tracker-data", "tacots", "exit", id],
	});
};

export const tacotsOnboardingTrackerDataQuery = (query?: TacotsOnboardingTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/onboarding", { query }),
		queryKey: ["tracker-data", "tacots", "onboarding", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const tacotsOnboardingTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/onboarding/:id", { params: { id } }),
		queryKey: ["tracker-data", "tacots", "onboarding", id],
	});
};

export const tacotsTrackingTrackerDataQuery = (query?: TacotsTrackingTrackerDataListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/tracking", { query }),
		queryKey: ["tracker-data", "tacots", "tracking", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const tacotsTrackingTrackerDataDetailQuery = (id: string) => {
	return queryOptions({
		enabled: Boolean(id),
		queryFn: () => callBackendApiForQuery("@get/forms/tacots/tracking/:id", { params: { id } }),
		queryKey: ["tracker-data", "tacots", "tracking", id],
	});
};

export type AshAttendanceTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashAttendanceTrackerDataQuery>["queryFn"]>>
>;

export type AshExitTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashExitTrackerDataQuery>["queryFn"]>>
>;

export type AshTrackingTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof ashTrackingTrackerDataQuery>["queryFn"]>>
>;

export type CapacityBuildingTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof capacityBuildingTrackerDataQuery>["queryFn"]>>
>;

export type OutreachTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof outreachTrackerDataQuery>["queryFn"]>>
>;

export type TacotsExitTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsExitTrackerDataQuery>["queryFn"]>>
>;

export type TacotsOnboardingTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsOnboardingTrackerDataQuery>["queryFn"]>>
>;

export type TacotsTrackingTrackerDataQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsTrackingTrackerDataQuery>["queryFn"]>>
>;

export const dashboardCardsQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/cards"),
		queryKey: ["dashboard", "cards"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
	});
};

export const dashboardNotificationsQuery = (query?: DashboardNotificationsQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/notifications", { query }),
		queryKey: ["dashboard", "notifications", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const dashboardProjectsQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/general/projects"),
		queryKey: ["dashboard", "projects"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
	});
};

export type DashboardProjectsQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof dashboardProjectsQuery>["select"]>>
>;

export const blogsQuery = (query?: BlogsListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/blogs", { query }),
		queryKey: ["blogs", query],
		staleTime: 1000 * 60 * 5,
	});
};

export type BlogsQueryResult = Awaited<ReturnType<NonNullable<ReturnType<typeof blogsQuery>["queryFn"]>>>;

export const generalProjectsQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/general/projects"),
		queryKey: ["general", "projects"],
		staleTime: 1000 * 60 * 10,
	});
};

export const generalMetadataQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/general/metadata"),
		queryKey: ["general", "metadata"],
		staleTime: 1000 * 60 * 10,
	});
};

export const generalReceiptsQuery = (query?: GeneralReceiptsListQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/general/receipts", { query }),
		queryKey: ["general", "receipts", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const generalGoogleFormQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/general/google-forms"),
		queryKey: ["general", "google-forms"],
		staleTime: 1000 * 60 * 10,
	});
};

export const adminUsersQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/admin/users"),
		queryKey: ["admin", "users"],
		staleTime: 1000 * 60 * 10,
	});
};

export const adminListUsersQuery = (query?: AdminListUsersQuery) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/admin/listusers", { query }),
		queryKey: ["admin", "listusers", query],
		staleTime: 1000 * 60 * 5,
	});
};

export const adminUserRolesQuery = (userId: string) => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/admin/roles/:userId", { params: { userId } }),
		queryKey: ["admin", "roles", userId],
		staleTime: 1000 * 60 * 5,
	});
};

export const dashboardStudentPerformanceQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/student-performance"),
		queryKey: ["dashboard", "student-performance"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
	});
};

export const dashboardEnrollmentQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/enrollment"),
		queryKey: ["dashboard", "enrollment"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
	});
};

export const dashboardInstitutionalEffectivenessQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/institutional-effectiveness"),
		queryKey: ["dashboard", "institutional-effectiveness"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
	});
};

export const ashStudentsLookupQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/lookup/ash-students"),
		queryKey: ["lookup", "ash-students"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export const tacotsOnboardedLookupQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/lookup/tacots-onboarded"),
		queryKey: ["lookup", "tacots-onboarded"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export const tacotsRecommendedLookupQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/lookup/tacots-recommended"),
		queryKey: ["lookup", "tacots-recommended"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export const capacityBuildingCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/capacity-building", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "capacity-building"],
		staleTime: Infinity,
	});
};

export const ashCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/ash", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "ash"],
		staleTime: Infinity,
	});
};

export const outreachesCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/outreaches", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "outreaches"],
		staleTime: Infinity,
	});
};

export const tacotsCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/tacots", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "tacots"],
		staleTime: Infinity,
	});
};

export type CarouselItemQueryResultType = Awaited<
	ReturnType<NonNullable<ReturnType<typeof tacotsCarouselsQuery>["select"]>>
>;

export type AshRegistrationFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/ash/registration"]["query"]
>;

export type AshFeedbackFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/ash/feedback"]["query"]
>;

export type TacotsRecommendationFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/tacots/recommendation"]["query"]
>;

export type TacotsFeedbackFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/tacots/feedback"]["query"]
>;

export type VolunteerRegistrationFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/volunteer"]["query"]
>;

export type VolunteerFeedbackFormDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/volunteer/all/feedback"]["query"]
>;

export type AshAttendanceTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/ash/attendance"]["query"]
>;

export type AshExitTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/ash/exit"]["query"]
>;

export type AshTrackingTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/ash/tracking"]["query"]
>;

export type CapacityBuildingTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/capacity-building"]["query"]
>;

export type OutreachTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/outreaches"]["query"]
>;

export type TacotsExitTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/tacots/exit"]["query"]
>;

export type TacotsOnboardingTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/tacots/onboarding"]["query"]
>;

export type TacotsTrackingTrackerDataListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/forms/tacots/tracking"]["query"]
>;

export type GeneralReceiptsListQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/general/receipts"]["query"]
>;

export type AdminListUsersQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/admin/listusers"]["query"]
>;

export type DashboardNotificationsQuery = z.infer<
	(typeof backendApiSchemaRoutes)["@get/dashboard/notifications"]["query"]
>;

export type BlogsListQuery = z.infer<(typeof backendApiSchemaRoutes)["@get/blogs"]["query"]>;

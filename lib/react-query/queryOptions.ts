import { queryOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkUserSessionForQuery } from "../api/callBackendApi/plugins/utils/session";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkUserSessionForQuery(),
		queryKey: ["auth", "session"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export const dashboardCardsQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/cards"),
		queryKey: ["dashboard", "cards"],
		select: (data) => data.data,
		staleTime: 1000 * 60 * 10,
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

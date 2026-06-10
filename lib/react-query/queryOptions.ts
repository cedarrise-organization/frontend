import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkUserSessionForQuery } from "../api/callBackendApi/plugins/utils/session";

const chartDatasetSchema = z.object({
	datasets: z.array(
		z.object({
			data: z.array(z.number()),
			label: z.string().optional(),
		})
	),
	labels: z.array(z.string()),
	type: z.enum(["bar", "line", "doughnut", "pie"]),
});

const dashboardLineDataSchema = z.array(
	z.object({
		amount: z.number(),
		title: z.string(),
	})
);

const dashboardCardsSchema = z.object({
	ash: z.object({
		communitiesEngaged: z.number(),
		currentBeneficiaries: z.number(),
		dropOuts: z.number(),
		graduated: z.number(),
		improvedGrades: z.number(),
		studentsEnrolled: z.number(),
		volunteers: z.number(),
	}),
	capacityBuilding: z.object({
		organizationsPartneredWith: z.number(),
		participantsImpacted: z.number(),
		volunteersEngaged: z.number(),
		workshopsConducted: z.number(),
	}),
	outreaches: z.object({
		beneficiariesReached: z.number(),
		communitiesEngaged: z.number(),
		outreachEvents: z.number(),
		partners: z.number(),
		volunteers: z.number(),
	}),
	tacots: z.object({
		benefactors: z.number(),
		currentlyInSchools: z.number(),
		enrolled: z.number(),
		graduated: z.number(),
		partners: z.number(),
		partnerSchools: z.number(),
		sponsors: z.number(),
	}),
	volunteer: z.object({
		accepted: z.number(),
		applied: z.number(),
		currentVolunteers: z.number(),
		Partners: z.number(),
		sponsors: z.number(),
	}),
});

const studentPerformanceMetricsSchema = z.object({
	c_attendanceTrend: chartDatasetSchema,
	c_dropoutTrend: chartDatasetSchema,
	c_graduationRate: chartDatasetSchema,
	c_risk: chartDatasetSchema,
	c_testScores: chartDatasetSchema,
});

const enrollmentMetricsSchema = z.object({
	c_acceptanceRate: dashboardLineDataSchema,
	c_applicationNumbers: chartDatasetSchema,
	c_classAgeDistribution: chartDatasetSchema,
	c_genderDiversity: chartDatasetSchema,
	c_geographicalDistribution: dashboardLineDataSchema,
});

const institutionalEffectivenessMetricsSchema = z.object({
	c_averageMentorshipHours: chartDatasetSchema,
	c_communityServiceHours: chartDatasetSchema,
	c_spendPerstudent: chartDatasetSchema,
	c_studentBenchMark: chartDatasetSchema,
	c_totalAccHours: dashboardLineDataSchema,
});

export type DashboardChartDataset = z.infer<typeof chartDatasetSchema>;
export type DashboardLineData = z.infer<typeof dashboardLineDataSchema>;

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
		select: (data) => dashboardCardsSchema.parse(data.data),
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
		select: (data) => studentPerformanceMetricsSchema.parse(data.data),
		staleTime: 1000 * 60 * 10,
	});
};

export const dashboardEnrollmentQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/enrollment"),
		queryKey: ["dashboard", "enrollment"],
		select: (data) => enrollmentMetricsSchema.parse(data.data),
		staleTime: 1000 * 60 * 10,
	});
};

export const dashboardInstitutionalEffectivenessQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard/institutional-effectiveness"),
		queryKey: ["dashboard", "institutional-effectiveness"],
		select: (data) => institutionalEffectivenessMetricsSchema.parse(data.data),
		staleTime: 1000 * 60 * 10,
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

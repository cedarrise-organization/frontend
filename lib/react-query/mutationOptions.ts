/* eslint-disable unicorn/no-nested-ternary */
import { mutationOptions } from "@tanstack/react-query";
import type { ExtractUnion } from "@zayne-labs/toolkit-type-helpers";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { AdminReviewStatusOptions, ReviewStatusOptions } from "../api/callBackendApi/apiSchema";

export type AshFormKind = "feedback" | "registration";
export type AshTrackerDataKind = "attendance" | "exit" | "tracking";
export type TacotsFormKind = "feedback" | "recommendation";
export type TacotsTrackerDataKind = "exit" | "onboarding" | "tracking";
export type VolunteerFormKind = "feedback" | "registration";

export type FormDataProgram = "ash" | "tacots" | "volunteer";
export type FormDataSectionKind = AshFormKind | TacotsFormKind | VolunteerFormKind;

export const dismissDashboardNotificationMutation = () => {
	return mutationOptions({
		mutationFn: (id: string) => {
			return callBackendApiForQuery("@patch/dashboard/notifications/:id", { params: { id } });
		},
	});
};

export const deleteBlogMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/blogs/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const ashFormDataDownloadMutation = (kind: AshFormKind) => {
	const filename = kind === "registration" ? "ash_students" : "ash_program_feedback";

	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "registration" ?
					"@get/forms/ash/download/ashstudent"
				:	"@get/forms/ash/download/ashfeedback",
				{
					onSuccess: (ctx) => forceDownload(ctx.data, filename),
					responseType: "blob",
				}
			);
		},
	});
};

export const ashRegistrationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof ReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/forms/ash/registration/:id/status", {
				meta: { toast: { success: true } },
				params: { id },
				query: { status },
			});
		},
	});
};

export const ashRegistrationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/ash/registration/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const ashTrackerDataDownloadMutation = (kind: AshTrackerDataKind) => {
	const filename =
		kind === "attendance" ? "ash_weekly_attendance"
		: kind === "exit" ? "ash_exit"
		: "ash_termly_tracking";

	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "attendance" ? "@get/forms/ash/download/ashattendance"
				: kind === "exit" ? "@get/forms/ash/download/ashexit"
				: "@get/forms/ash/download/ashtracking",
				{
					onSuccess: (ctx) => forceDownload(ctx.data, filename),
					responseType: "blob",
				}
			);
		},
	});
};

export const ashAttendanceDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/ash/attendance/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const ashExitDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/ash/exit/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const ashTrackingDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/ash/tracking/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const tacotsFormDataDownloadMutation = (kind: TacotsFormKind) => {
	const filename = kind === "recommendation" ? "tacots_recommendation" : "tacots_feedback";

	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "recommendation" ?
					"@get/forms/tacots/download/tacotsrecommendation"
				:	"@get/forms/tacots/download/tacotsfeedback",
				{
					onSuccess: (ctx) => forceDownload(ctx.data, filename),
					responseType: "blob",
				}
			);
		},
	});
};

export const tacotsRecommendationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof AdminReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/forms/tacots/recommendation/:id/status", {
				meta: { toast: { success: true } },
				params: { id },
				query: { status },
			});
		},
	});
};

export const tacotsRecommendationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/tacots/recommendation/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const tacotsTrackerDataDownloadMutation = (kind: TacotsTrackerDataKind) => {
	const filename =
		kind === "exit" ? "tacots_exit"
		: kind === "onboarding" ? "tacots_onboarding"
		: "tacots_tracking";

	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "exit" ? "@get/forms/tacots/download/tacotsexit"
				: kind === "onboarding" ? "@get/forms/tacots/download/tacotsonboarding"
				: "@get/forms/tacots/download/tacotstracking",
				{
					onSuccess: (ctx) => forceDownload(ctx.data, filename),
					responseType: "blob",
				}
			);
		},
	});
};

export const tacotsExitDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/tacots/exit/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const tacotsOnboardingDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/tacots/onboarding/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const tacotsTrackingDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/tacots/tracking/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const outreachTrackerDataDownloadMutation = () => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@get/forms/outreaches/download/outreachtracker", {
				onSuccess: (ctx) => forceDownload(ctx.data, "outreach_tracker"),
				responseType: "blob",
			});
		},
	});
};

export const outreachDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/outreaches/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const capacityBuildingTrackerDataDownloadMutation = () => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@get/forms/capacity-building/download/capacityevaluation", {
				onSuccess: (ctx) => forceDownload(ctx.data, "capacity_building_evaluation"),
				responseType: "blob",
			});
		},
	});
};

export const capacityBuildingDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/capacity-building/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const generalReceiptsDownloadMutation = () => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@get/general/download/receipts", {
				onSuccess: (ctx) => forceDownload(ctx.data, "receipts"),
				responseType: "blob",
			});
		},
	});
};

export const volunteerFormDataDownloadMutation = (kind: VolunteerFormKind) => {
	const filename = kind === "registration" ? "volunteer_registration" : "volunteer_feedback";

	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "registration" ?
					"@get/volunteer/download/volunteerregistration"
				:	"@get/volunteer/download/volunteerfeedback",
				{
					onSuccess: (ctx) => forceDownload(ctx.data, filename),
					responseType: "blob",
				}
			);
		},
	});
};

export const volunteerRegistrationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof ReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/volunteer/:id/status", {
				meta: { toast: { success: true } },
				params: { id },
				query: { status },
			});
		},
	});
};

export const volunteerRegistrationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/volunteer/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

export const volunteerFeedbackDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/volunteer/feedback/:id", {
				meta: { toast: { success: true } },
				params: { id },
			});
		},
	});
};

const forceDownload = (data: Blob, filename: string) => {
	const fileUrl = URL.createObjectURL(data);
	const link = document.createElement("a");

	link.href = fileUrl;
	link.download = `${filename}.csv`;
	link.click();

	URL.revokeObjectURL(fileUrl);
};

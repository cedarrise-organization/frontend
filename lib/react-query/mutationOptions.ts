import { mutationOptions } from "@tanstack/react-query";
import type { ExtractUnion } from "@zayne-labs/toolkit-type-helpers";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { AdminReviewStatusOptions, ReviewStatusOptions } from "../api/callBackendApi/apiSchema";

export type AshFormKind = "feedback" | "registration";
export type TacotsFormKind = "feedback" | "recommendation";
export type VolunteerFormKind = "feedback" | "registration";

export type FormDataProgram = "ash" | "tacots" | "volunteer";
export type FormDataSectionKind = AshFormKind | TacotsFormKind | VolunteerFormKind;

export const ashFormDataDownloadMutation = (kind: AshFormKind) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "registration" ?
					"@get/forms/ash/download/ashstudent"
				:	"@get/forms/ash/download/ashfeedback"
			);
		},
	});
};

export const ashRegistrationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof ReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/forms/ash/registration/:id/status", {
				params: { id },
				query: { status },
			});
		},
	});
};

export const ashRegistrationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/ash/registration/:id", { params: { id } });
		},
	});
};

export const tacotsFormDataDownloadMutation = (kind: TacotsFormKind) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "recommendation" ?
					"@get/forms/tacots/download/tacotsrecommendation"
				:	"@get/forms/tacots/download/tacotsfeedback"
			);
		},
	});
};

export const tacotsRecommendationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof AdminReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/forms/tacots/recommendation/:id/status", {
				params: { id },
				query: { status },
			});
		},
	});
};

export const tacotsRecommendationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/tacots/recommendation/:id", { params: { id } });
		},
	});
};

export const volunteerFormDataDownloadMutation = (kind: VolunteerFormKind) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery(
				kind === "registration" ?
					"@get/volunteer/download/volunteerregistration"
				:	"@get/volunteer/download/volunteerfeedback"
			);
		},
	});
};

export const volunteerRegistrationStatusMutation = (id: string) => {
	return mutationOptions({
		mutationFn: (status: ExtractUnion<typeof ReviewStatusOptions>) => {
			return callBackendApiForQuery("@patch/forms/volunteer/:id/status", {
				params: { id },
				query: { status },
			});
		},
	});
};

export const volunteerRegistrationDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/volunteer/:id", { params: { id } });
		},
	});
};

export const volunteerFeedbackDeleteMutation = (id: string) => {
	return mutationOptions({
		mutationFn: () => {
			return callBackendApiForQuery("@delete/forms/volunteer/feedback/:id", { params: { id } });
		},
	});
};

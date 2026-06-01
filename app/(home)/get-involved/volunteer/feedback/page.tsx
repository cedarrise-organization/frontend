"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	CheckboxQuestionField,
	DateField,
	OptionQuestionField,
	RatingQuestionField,
	TextAreaField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import {
	defineFormStepItems,
	FormPageHeader,
	FormStepComponentSectionHeader,
	FormStepFooter,
	FormStepList,
	FormStepMainContent,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Form, useFormRootContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	backendApiSchemaRoutes,
	VolunteerActivityOptions,
	VolunteerFeedbackDurationOptions,
	VolunteerFeedbackProgramOptions,
	VolunteerProgramImpactOptions,
	VolunteerSkillDevelopedOptions,
	VolunteerSkillGainedOptions,
	VolunteerWaysProgramHelpedOptions,
	YesMaybeNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";

const VolunteerFeedbackSchema = backendApiSchemaRoutes["@post/volunteer/feedback"].body;

function VolunteerFeedbackPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="Volunteer Feedback Form" href="/get-involved/volunteer" />
			<VolunteerFeedbackForm />
		</Main>
	);
}
export default VolunteerFeedbackPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: VolunteerExperienceStep,
		title: "Volunteer experience",
		validator: VolunteerFeedbackSchema.pick({
			firstName: true,
			organizationRating: true,
			overallExperienceRating: true,
			programVolunteered: true,
			roleClarityRating: true,
			surname: true,
			teamSupportRating: true,
			volunteerDuration: true,
		}),
	},
	{
		StepComponent: VolunteerImpactStep,
		title: "Volunteer information",
		validator: VolunteerFeedbackSchema.pick({
			activitiesInvolvedIn: true,
			programMadeImpact: true,
			skillsDeveloped: true,
			skillsGained: true,
			waysProgramHelped: true,
		}),
	},
	{
		StepComponent: SuggestionsImprovementStep,
		title: "Suggestions and improvement",
		validator: VolunteerFeedbackSchema.pick({
			additionalComments: true,
			challengesExperienced: true,
			continueVolunteering: true,
			enjoyedMost: true,
			improvementSuggestions: true,
			submissionDate: true,
			wouldRecommend: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type VolunteerFeedbackFormStoreType = {
	currentStep: number;
	formStepData: z.infer<typeof VolunteerFeedbackSchema>;
};

const useVolunteerFeedbackStorageState = createUseStorageState<VolunteerFeedbackFormStoreType>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			activitiesInvolvedIn: [],
			additionalComments: "",
			challengesExperienced: "",
			continueVolunteering: "",
			enjoyedMost: "",
			firstName: "",
			improvementSuggestions: "",
			organizationRating: "",
			overallExperienceRating: "",
			programMadeImpact: "",
			programVolunteered: "",
			roleClarityRating: "",
			skillsDeveloped: "",
			skillsGained: [],
			submissionDate: "",
			surname: "",
			teamSupportRating: "",
			volunteerDuration: "",
			waysProgramHelped: [],
			wouldRecommend: "",
		} as unknown as VolunteerFeedbackFormStoreType["formStepData"],
	},
	key: "volunteer-feedback-form-data",
});

function VolunteerFeedbackForm() {
	const [storeValues, storeActions] = useVolunteerFeedbackStorageState();

	const form = useForm({
		resolver: zodResolver(stepItems[storeValues.currentStep]?.validator ?? VolunteerFeedbackSchema),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/volunteer/feedback", {
			body: {
				...storeValues.formStepData,
				...data,
			},
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
				storeActions.removeState();
			},
		});
	});

	return (
		<Steps.Root
			count={stepItemsCount}
			linear={true}
			step={storeValues.currentStep}
			onStepChange={(details) => storeActions.setState({ currentStep: details.step })}
			className="flex min-h-screen w-full flex-col gap-10 lg:max-w-[590px] lg:gap-12"
			suppressHydrationWarning={true}
		>
			<FormStepList items={stepItems} />

			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-10 lg:gap-12">
				<FormStepMainContent items={stepItems} />

				<FormStepFooter />
			</Form.Root>
		</Steps.Root>
	);
}

function VolunteerExperienceStep() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[0]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Volunteer Information" />

				<TextField control={control} name="firstName" placeholder="First Name" />
				<TextField control={control} name="surname" placeholder="Surname" />

				<OptionQuestionField
					control={control}
					name="programVolunteered"
					question="1. Program you volunteered with"
					options={VolunteerFeedbackProgramOptions}
				/>

				<OptionQuestionField
					control={control}
					name="volunteerDuration"
					question="3. How long have you volunteered with CedarRise?"
					options={VolunteerFeedbackDurationOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Experience</h2>

				<RatingQuestionField
					control={control}
					name="overallExperienceRating"
					question="1. My volunteering experience with CedarRise has been positive."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={control}
					name="roleClarityRating"
					question="2. I clearly understood my role as a volunteer"
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={control}
					name="teamSupportRating"
					question="3. I felt supported by the CedarRise team."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={control}
					name="organizationRating"
					question="4. The volunteer activities were well organized."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>
			</section>
		</>
	);
}

function VolunteerImpactStep() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Volunteer Information" />

				<OptionQuestionField
					control={control}
					name="programMadeImpact"
					question="1. Do you believe the program you supported made a positive impact?"
					options={VolunteerProgramImpactOptions}
				/>

				<CheckboxQuestionField
					control={control}
					name="waysProgramHelped"
					question="2. In what ways do you think the program helped beneficiaries?"
					options={VolunteerWaysProgramHelpedOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Engagement</h2>

				<CheckboxQuestionField
					control={control}
					name="activitiesInvolvedIn"
					question="1. What activities were you mainly involved in?"
					options={VolunteerActivityOptions}
				/>

				<OptionQuestionField
					control={control}
					name="skillsDeveloped"
					question="2. Did volunteering with CedarRise help you develop new skills?"
					options={VolunteerSkillDevelopedOptions}
				/>

				<CheckboxQuestionField
					control={control}
					name="skillsGained"
					question="3. If yes, what skills did you gain?"
					options={VolunteerSkillGainedOptions}
				/>
			</section>
		</>
	);
}

function SuggestionsImprovementStep() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[2]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Suggestions and Improvement" />

				<TextAreaField
					control={control}
					name="enjoyedMost"
					label="What did you enjoy most about volunteering with CedarRise?"
				/>
				<TextAreaField
					control={control}
					name="challengesExperienced"
					label="What challenges did you experience while volunteering?"
				/>
				<TextAreaField
					control={control}
					name="improvementSuggestions"
					label="What improvements would you suggest for the volunteer program?"
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Future Engagement</h2>

				<OptionQuestionField
					control={control}
					name="continueVolunteering"
					question="1. Would you like to continue volunteering with CedarRise?"
					options={YesMaybeNoOptions}
				/>
				<OptionQuestionField
					control={control}
					name="wouldRecommend"
					question="2. Would you recommend volunteering with CedarRise to others?"
					options={YesMaybeNoOptions}
				/>
				<TextAreaField
					control={control}
					name="additionalComments"
					label="Any additional comments or feedback"
				/>
				<DateField control={control} name="submissionDate" placeholder="Date" />
			</section>
		</>
	);
}

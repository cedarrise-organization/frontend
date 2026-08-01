"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	CheckboxQuestionField,
	OptionQuestionField,
	RatingQuestionField,
	SelectField,
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
	type GetFormStepStoreType,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AcademicImprovementNoticedOptions,
	backendApiSchemaRoutes,
	ParentGuardianRelationshipOptions,
	PositiveChangeNoticedOptions,
	TacotsCurrentChallengeOptions,
	TacotsFeedbackClassOptions,
	TacotsMostHelpfulSupportOptions,
	TacotsScholarshipHelpedStayOptions,
	TacotsScholarshipReducedBurdenOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const TacotsFeedbackSchema = backendApiSchemaRoutes["@post/forms/tacots/feedback"].body;

function FeedbackFormPage() {
	return (
		<Main showWatermark={true} className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Feedback Form" href="/social-initiatives/tacots" />
			<TacotsFeedbackForm />
		</Main>
	);
}

export default FeedbackFormPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentFeedbackStep,
		title: "Student feedback",
		validator: TacotsFeedbackSchema.pick({
			currentChallenges: true,
			currentClass: true,
			currentSchool: true,
			likedMost: true,
			mentorshipImpactRating: true,
			mostHelpfulSupport: true,
			scholarshipHelpedStay: true,
			studentFirstName: true,
			studentImprovementSuggestions: true,
			studentSurname: true,
			studyMotivationRating: true,
		}),
	},
	{
		StepComponent: ParentFeedbackStep,
		title: "Parent feedback",
		validator: TacotsFeedbackSchema.pick({
			academicImprovementNoticed: true,
			additionalComments: true,
			attitudeChangeNoticed: true,
			parentGuardianName: true,
			parentGuardianRelationship: true,
			parentImprovementSuggestions: true,
			parentPhone: true,
			parentSatisfactionRating: true,
			programImpactOnFamily: true,
			scholarshipReducedBurden: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof TacotsFeedbackSchema>;

const useTacotsFeedbackStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			academicImprovementNoticed: undefined,
			additionalComments: "",
			attitudeChangeNoticed: undefined,
			currentChallenges: [],
			currentClass: undefined,
			currentSchool: "",
			likedMost: "",
			mentorshipImpactRating: 0,
			mostHelpfulSupport: [],
			parentGuardianName: "",
			parentGuardianRelationship: undefined,
			parentImprovementSuggestions: "",
			parentPhone: "",
			parentSatisfactionRating: undefined,
			programImpactOnFamily: "",
			scholarshipHelpedStay: undefined,
			scholarshipReducedBurden: undefined,
			studentFirstName: "",
			studentImprovementSuggestions: "",
			studentSurname: "",
			studyMotivationRating: 0,
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "tacots-feedback-form-data",
});

function TacotsFeedbackForm() {
	const [storeValues, storeActions] = useTacotsFeedbackStorageState();

	const form = useForm({
		resolver: zodResolver(stepItems[storeValues.currentStep]?.validator ?? TacotsFeedbackSchema),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/tacots/feedback", {
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

function StudentFeedbackStep() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[0]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Student Information" />

				<TextField
					control={control}
					name="studentFirstName"
					placeholder="Student First name"
					required={true}
				/>

				<TextField
					control={control}
					name="studentSurname"
					placeholder="Student Surname"
					required={true}
				/>

				<TextField
					control={control}
					name="currentSchool"
					placeholder="Current School"
					required={true}
				/>

				<SelectField
					control={control}
					classNames={{ trigger: "max-w-[305px]" }}
					name="currentClass"
					placeholder="Current Class"
					options={TacotsFeedbackClassOptions}
					required={true}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Student Feedback</h2>

				<OptionQuestionField
					control={control}
					name="scholarshipHelpedStay"
					question="1. Has the TACOTS scholarship helped you stay in school?"
					options={TacotsScholarshipHelpedStayOptions}
					required={true}
				/>

				<CheckboxQuestionField
					control={control}
					name="mostHelpfulSupport"
					question="2. What support from TACOTS has helped you the most?"
					options={TacotsMostHelpfulSupportOptions}
				/>

				<RatingQuestionField
					control={control}
					name="studyMotivationRating"
					question="3. Because of TACOTS, my motivation to study has improved."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
					required={true}
				/>

				<RatingQuestionField
					control={control}
					name="mentorshipImpactRating"
					question="4. TACOTS mentorship and guidance have helped me personally."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
					required={true}
				/>

				<CheckboxQuestionField
					control={control}
					name="currentChallenges"
					question="5. What challenges are you currently facing in school?"
					options={TacotsCurrentChallengeOptions}
				/>

				<TextAreaField
					control={control}
					name="likedMost"
					label="What do you like most about the TACOTS program?"
				/>

				<TextAreaField
					control={control}
					name="studentImprovementSuggestions"
					label="What suggestions do you have to improve the program?"
				/>
			</section>
		</>
	);
}

function ParentFeedbackStep() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Student Information" />

				<TextField
					control={control}
					name="parentGuardianName"
					placeholder="Parent / Guardian Name"
					required={true}
				/>

				<OptionQuestionField
					control={control}
					name="parentGuardianRelationship"
					question="Relationship to Student"
					options={ParentGuardianRelationshipOptions}
					required={true}
				/>

				<TextField control={control} name="parentPhone" placeholder="Phone Number" type="tel" />
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Parent / Guardian Feedback</h2>

				<OptionQuestionField
					control={control}
					name="scholarshipReducedBurden"
					question="1. Has the TACOTS scholarship helped reduce the financial burden?"
					options={TacotsScholarshipReducedBurdenOptions}
					required={true}
				/>

				<OptionQuestionField
					control={control}
					name="academicImprovementNoticed"
					question="2. Have you noticed improvement in your child's academic performance?"
					options={AcademicImprovementNoticedOptions}
				/>

				<OptionQuestionField
					control={control}
					name="attitudeChangeNoticed"
					question="3. Have you observed positive changes in your child's attitude toward school?"
					options={PositiveChangeNoticedOptions}
				/>

				<RatingQuestionField
					control={control}
					name="parentSatisfactionRating"
					question="4. How satisfied are you with the TACOTS scholarship program?"
					leftLabel="Very dissatisfied"
					rightLabel="Very satisfied"
				/>

				<TextAreaField
					control={control}
					name="programImpactOnFamily"
					label="What impact has the TACOTS program had on your child or family?"
				/>

				<TextAreaField
					control={control}
					name="parentImprovementSuggestions"
					label="What improvements would you recommend for the program?"
				/>

				<TextAreaField
					control={control}
					name="additionalComments"
					label="Any additional comments or feedback"
				/>
			</section>
		</>
	);
}

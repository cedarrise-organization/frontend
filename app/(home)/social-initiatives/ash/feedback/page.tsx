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
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Form, useFormRootContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AcademicImprovementNoticedOptions,
	AshAttendanceFrequencyOptions,
	AshChildBenefitedOptions,
	AshEnjoyedPartsOptions,
	AshFeedbackClassOptions,
	AshMostValuableAspectsOptions,
	backendApiSchemaRoutes,
	ParentGuardianRelationshipOptions,
	PositiveChangeNoticedOptions,
} from "@/lib/api/callBackendApi/apiSchema";

const AshFeedbackSchema = backendApiSchemaRoutes["@post/forms/ash/feedback"].body;

function FeedbackFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="ASH Program Feedback Form" href="/social-initiatives/ash" />
			<AshFeedbackForm />
		</Main>
	);
}

export default FeedbackFormPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentFeedbackStepOne,
		title: "Student feedback",
		validator: AshFeedbackSchema.pick({
			attendanceFrequency: true,
			confidenceRating: true,
			currentClass: true,
			enjoyedParts: true,
			learningImprovementRating: true,
			schoolName: true,
			studentEnjoyedMost: true,
			studentFirstName: true,
			studentImprovementSuggestions: true,
			studentSurname: true,
			volunteerSupportRating: true,
		}),
	},
	{
		StepComponent: ParentGuardianFeedbackStepTwo,
		title: "Parent / guardian feedback",
		validator: AshFeedbackSchema.pick({
			academicImprovementNoticed: true,
			additionalComments: true,
			childBenefited: true,
			confidenceBehaviorChange: true,
			mostValuableAspects: true,
			parentGuardianName: true,
			parentGuardianRelationship: true,
			parentImprovementSuggestions: true,
			parentPhone: true,
			parentSatisfactionRating: true,
			programImpactOnChild: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type AshFeedbackFormStoreType = {
	currentStep: number;
	formStepData: z.infer<typeof AshFeedbackSchema>;
};

const useAshFeedbackStorageState = createUseStorageState<AshFeedbackFormStoreType>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			academicImprovementNoticed: "",
			additionalComments: "",
			attendanceFrequency: "",
			childBenefited: "",
			confidenceBehaviorChange: "",
			confidenceRating: "",
			currentClass: "",
			enjoyedParts: [],
			learningImprovementRating: "",
			mostValuableAspects: [],
			parentGuardianName: "",
			parentGuardianRelationship: "",
			parentImprovementSuggestions: "",
			parentPhone: "",
			parentSatisfactionRating: "",
			programImpactOnChild: "",
			schoolName: "",
			studentEnjoyedMost: "",
			studentFirstName: "",
			studentImprovementSuggestions: "",
			studentSurname: "",
			volunteerSupportRating: "",
		} as unknown as AshFeedbackFormStoreType["formStepData"],
	},
	key: "ash-feedback-form-data",
});

function AshFeedbackForm() {
	const [storeValues, storeActions] = useAshFeedbackStorageState();

	const form = useForm({
		resolver: zodResolver(AshFeedbackSchema),
		values: storeValues.formStepData as unknown as z.input<typeof AshFeedbackSchema>,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/ash/feedback", {
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

function StudentFeedbackStepOne() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[0]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Student Information" />

				<TextField control={control} name="studentFirstName" placeholder="Student First Name" />
				<TextField control={control} name="studentSurname" placeholder="Student Surname" />
				<TextField control={control} name="schoolName" placeholder="Current School" />
				<SelectField
					control={control}
					classNames={{ trigger: "max-w-[305px]" }}
					name="currentClass"
					placeholder="Current Class"
					options={AshFeedbackClassOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Student Feedback</h2>

				<OptionQuestionField
					control={control}
					name="attendanceFrequency"
					question="1. How much do you enjoy attending ASH?"
					options={AshAttendanceFrequencyOptions}
				/>

				<CheckboxQuestionField
					control={control}
					name="enjoyedParts"
					question="2. What part of ASH has helped you the most?"
					options={AshEnjoyedPartsOptions}
				/>

				<RatingQuestionField
					control={control}
					name="learningImprovementRating"
					question="3. Which subject area has improved the most?"
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={control}
					name="confidenceRating"
					question="4. ASH has improved my confidence in school work."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={control}
					name="volunteerSupportRating"
					question="5. Tutors and mentors explain things clearly."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<TextAreaField
					control={control}
					name="studentEnjoyedMost"
					label="What challenges are you still facing in school?"
				/>

				<TextAreaField
					control={control}
					name="studentImprovementSuggestions"
					label="What can make ASH better for students?"
				/>
			</section>
		</>
	);
}

function ParentGuardianFeedbackStepTwo() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Parent / Guardian Information" />

				<TextField control={control} name="parentGuardianName" placeholder="Parent / Guardian Name" />
				<OptionQuestionField
					control={control}
					name="parentGuardianRelationship"
					question="Relationship to Student"
					options={ParentGuardianRelationshipOptions}
				/>
				<TextField control={control} name="parentPhone" placeholder="Phone Number" type="tel" />
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Parent / Guardian Feedback</h2>

				<OptionQuestionField
					control={control}
					name="academicImprovementNoticed"
					question="1. Have you noticed improvement in your child's school performance?"
					options={AcademicImprovementNoticedOptions}
				/>

				<OptionQuestionField
					control={control}
					name="confidenceBehaviorChange"
					question="2. Have you noticed positive changes in your child's study habits?"
					options={PositiveChangeNoticedOptions}
				/>

				<CheckboxQuestionField
					control={control}
					name="mostValuableAspects"
					question="3. Does the student practice ASH assignments or lessons at home?"
					options={AshMostValuableAspectsOptions}
				/>

				<OptionQuestionField
					control={control}
					name="childBenefited"
					question="4. How would you describe the student's attendance experience?"
					options={AshChildBenefitedOptions}
				/>

				<RatingQuestionField
					control={control}
					name="parentSatisfactionRating"
					question="5. How satisfied are you with the ASH program?"
					leftLabel="Very dissatisfied"
					rightLabel="Very satisfied"
				/>

				<TextAreaField
					control={control}
					name="programImpactOnChild"
					label="What impact has ASH had on your child or family?"
				/>

				<TextAreaField
					control={control}
					name="parentImprovementSuggestions"
					label="What improvements would you recommend?"
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

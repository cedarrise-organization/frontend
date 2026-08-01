"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
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
	type GetFormStepStoreType,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(protected)/admin/dashboard/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	backendApiSchemaRoutes,
	CapacityObjectiveAchievementOptions,
	CapacityOverallSuccessOptions,
	CapacityPartnershipLevelOptions,
	CapacityProgramTypeOptions,
	CapacitySponsorshipTypeOptions,
	CapacityYesNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const CapacityBuildingEvaluationSchema = backendApiSchemaRoutes["@post/forms/capacity-building"].body;

const stepItems = defineFormStepItems([
	{
		StepComponent: BasicProgramDetailsStep,
		title: "Basic program details",
		validator: CapacityBuildingEvaluationSchema.pick({
			listOfSponsors: true,
			location: true,
			numberOfSponsors: true,
			partnerOrganizations: true,
			partnershipLevel: true,
			programCoordinator: true,
			programDate: true,
			programName: true,
			programType: true,
			sponsorshipType: true,
		}),
	},
	{
		StepComponent: ParticipationOutcomesStep,
		title: "Participation data",
		validator: CapacityBuildingEvaluationSchema.pick({
			communicationAndCoordination: true,
			effectiveActivities: true,
			majorActivities: true,
			numberOfFacilitators: true,
			numberOfParticipants: true,
			numberOfVolunteers: true,
			objectiveAchievement: true,
			participantEngagementLevel: true,
			programImpact: true,
			programObjectives: true,
			programOutcome: true,
			resourceAvailability: true,
			targetAudience: true,
			teamworkAmongOrganizers: true,
			timeManagement: true,
			venueSuitability: true,
		}),
	},
	{
		StepComponent: EvaluationSubmissionStep,
		title: "Evaluation",
		validator: CapacityBuildingEvaluationSchema.pick({
			budgetAllocated: true,
			budgetUtilized: true,
			challengesAddressed: true,
			challengesEncountered: true,
			dateSubmitted: true,
			improvementSuggestions: true,
			inadequateResourcesExplanation: true,
			lessonsLearned: true,
			name: true,
			overallSuccess: true,
			recommendFuturePrograms: true,
			recommendTheProgram: true,
			role: true,
			wereResourcesAdequate: true,
		}),
	},
]);

type FormStepDataType = z.infer<typeof CapacityBuildingEvaluationSchema>;

const stepItemsCount = stepItems.length - 1;

const useCapacityBuildingEvaluationStorageState = createUseStorageState<
	GetFormStepStoreType<FormStepDataType>
>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			budgetAllocated: "",
			budgetUtilized: "",
			challengesAddressed: "",
			challengesEncountered: "",
			communicationAndCoordination: 0,
			dateSubmitted: "",
			effectiveActivities: "",
			improvementSuggestions: "",
			inadequateResourcesExplanation: "",
			lessonsLearned: "",
			listOfSponsors: "",
			location: "",
			majorActivities: "",
			name: "",
			numberOfFacilitators: undefined,
			numberOfParticipants: undefined,
			numberOfSponsors: undefined,
			numberOfVolunteers: undefined,
			objectiveAchievement: undefined,
			overallSuccess: undefined,
			participantEngagementLevel: undefined,
			partnerOrganizations: "",
			partnershipLevel: undefined,
			programCoordinator: "",
			programDate: "",
			programImpact: "",
			programName: "",
			programObjectives: "",
			programOutcome: "",
			programType: undefined,
			recommendFuturePrograms: "",
			recommendTheProgram: undefined,
			resourceAvailability: 0,
			role: "",
			sponsorshipType: undefined,
			targetAudience: "",
			teamworkAmongOrganizers: 0,
			timeManagement: 0,
			venueSuitability: 0,
			wereResourcesAdequate: undefined,
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "admin-capacity-building-evaluation-form-data",
});

function CapacityBuildingProgramEvaluationPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader
				title="Capacity Building Program Evaluation Form"
				href="/admin/dashboard/tracker-forms"
			/>
			<CapacityBuildingProgramEvaluationForm />
		</Main>
	);
}

export default CapacityBuildingProgramEvaluationPage;

function CapacityBuildingProgramEvaluationForm() {
	const [storeValues, storeActions] = useCapacityBuildingEvaluationStorageState();

	const form = useForm({
		resolver: zodResolver(
			stepItems[storeValues.currentStep]?.validator ?? CapacityBuildingEvaluationSchema
		),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/capacity-building", {
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

function BasicProgramDetailsStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[0]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Basic Program Details" />

			<TextField control={form.control} name="programName" placeholder="Program Name" required={true} />

			<OptionQuestionField
				control={form.control}
				name="programType"
				question="Type of Program"
				options={CapacityProgramTypeOptions}
				required={true}
			/>

			<DateField
				control={form.control}
				name="programDate"
				placeholder="Date(s) of Program"
				required={true}
			/>
			<TextField control={form.control} name="location" placeholder="Location/Venue" required={true} />
			<TextField
				control={form.control}
				name="programCoordinator"
				placeholder="Program Coordinator/Lead"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numberOfSponsors"
				placeholder="Number of Sponsors & partners"
				min={0}
				step={1}
				type="number"
				required={true}
			/>
			<TextAreaField
				control={form.control}
				name="listOfSponsors"
				label="List of Sponsors (e.g. organizations, individuals, donors)"
				required={true}
			/>

			<OptionQuestionField
				control={form.control}
				name="sponsorshipType"
				question="Type of Sponsorship Received"
				options={CapacitySponsorshipTypeOptions}
				required={true}
			/>

			<TextAreaField
				control={form.control}
				name="partnerOrganizations"
				label="Partner Organization(s)/Collaborators (e.g. NGOs, hospitals, schools, institutions)"
			/>

			<OptionQuestionField
				control={form.control}
				name="partnershipLevel"
				question="Level of Partner Involvement"
				options={CapacityPartnershipLevelOptions}
				required={true}
			/>
		</>
	);
}

function ParticipationOutcomesStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Participation Data" />

			<TextField
				control={form.control}
				name="numberOfParticipants"
				label="Total Number of Participants"
				min={0}
				step={1}
				type="number"
				required={true}
			/>
			<TextField
				control={form.control}
				name="targetAudience"
				label="Target Audience"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numberOfFacilitators"
				label="Number of Facilitators/Trainers"
				min={0}
				step={1}
				type="number"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numberOfVolunteers"
				label="Number of Volunteers/Support Staff"
				min={0}
				step={1}
				type="number"
				required={true}
			/>

			<OptionQuestionField
				control={form.control}
				name="participantEngagementLevel"
				question="Participant Engagement Level"
				options={[
					{ label: "Low", value: "low" },
					{ label: "Moderate", value: "moderate" },
					{ label: "High", value: "high" },
				]}
				required={true}
			/>

			<FormStepComponentSectionHeader title="Program Objectives and Outcomes" />

			<TextAreaField
				control={form.control}
				name="programObjectives"
				label="What were the objectives of the program?"
			/>

			<OptionQuestionField
				control={form.control}
				name="objectiveAchievement"
				question="Were the objectives achieved?"
				options={CapacityObjectiveAchievementOptions}
				required={true}
			/>

			<TextAreaField
				control={form.control}
				name="programOutcome"
				label="Key outcomes/results of the program"
			/>
			<TextAreaField
				control={form.control}
				name="programImpact"
				label="Describe the impact of the program on participants/community"
			/>

			<FormStepComponentSectionHeader title="Program Activities" />

			<TextAreaField
				control={form.control}
				name="majorActivities"
				label="List major activities carried out"
			/>
			<TextAreaField
				control={form.control}
				name="effectiveActivities"
				label="Which activities were most effective?"
			/>

			<FormStepComponentSectionHeader title="Logistics and Organization" />

			<RatingQuestionField
				control={form.control}
				name="venueSuitability"
				question="Venue suitability"
				leftLabel=" "
				rightLabel=" "
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="timeManagement"
				question="Time management"
				leftLabel=" "
				rightLabel=" "
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="resourceAvailability"
				question="Availability of materials/resources"
				leftLabel=" "
				rightLabel=" "
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="communicationAndCoordination"
				question="Communication & coordination"
				leftLabel=" "
				rightLabel=" "
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="teamworkAmongOrganizers"
				question="Teamwork among organizers"
				leftLabel=" "
				rightLabel=" "
				required={true}
			/>
		</>
	);
}

function EvaluationSubmissionStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[2]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Challenges and Lessons Learnt" />

			<TextAreaField
				control={form.control}
				name="challengesEncountered"
				label="Challenges encountered during the program"
			/>
			<TextAreaField
				control={form.control}
				name="challengesAddressed"
				label="How were these challenges addressed?"
			/>
			<TextAreaField control={form.control} name="lessonsLearned" label="Lessons learned" />

			<FormStepComponentSectionHeader title="Budget and Resources" />

			<TextField control={form.control} name="budgetAllocated" label="Budget allocated" />
			<TextField control={form.control} name="budgetUtilized" label="Budget utilized" />

			<OptionQuestionField
				control={form.control}
				name="wereResourcesAdequate"
				question="Were resources adequate?"
				options={CapacityYesNoOptions}
			/>

			<TextAreaField
				control={form.control}
				name="inadequateResourcesExplanation"
				label="If no, explain"
			/>

			<FormStepComponentSectionHeader title="Overall Evaluation" />

			<OptionQuestionField
				control={form.control}
				name="overallSuccess"
				question="Overall success of the program"
				options={CapacityOverallSuccessOptions}
			/>

			<OptionQuestionField
				control={form.control}
				name="recommendTheProgram"
				question="Would you recommend repeating this program?"
				options={CapacityYesNoOptions}
			/>

			<TextAreaField
				control={form.control}
				name="improvementSuggestions"
				label="Suggestions for improvement"
			/>
			<TextAreaField
				control={form.control}
				name="recommendFuturePrograms"
				label="Recommendations for future programs"
			/>

			<FormStepComponentSectionHeader title="Submitted By" />

			<TextField control={form.control} name="name" placeholder="Name" required={true} />
			<TextField control={form.control} name="role" placeholder="Role" required={true} />
			<DateField control={form.control} name="dateSubmitted" placeholder="Date" required={true} />
		</>
	);
}

"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	DateField,
	FileUploadField,
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
import { Main } from "@/app/(protected)/admin/dashboard/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AcademicSessionOptions,
	NigeriaStateOptions,
	TacotsAcademicTermOptions,
	TacotsAssessmentPeriodOptions,
	TacotsMentorshipDurationOptions,
	TacotsMentorshipModeOptions,
	TacotsServiceActivityTypeOptions,
	TacotsServiceDurationOptions,
	TacotsStudentTrackingFrontendSchema,
} from "@/lib/api/callBackendApi/apiSchema";
import { tacotsOnboardedLookupQuery } from "@/lib/react-query/queryOptions";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentInformationStep,
		title: "Student information",
		validator: TacotsStudentTrackingFrontendSchema.pick({
			academicSession: true,
			academicTerm: true,
			assessmentPeriod: true,
			region: true,
			schoolId: true,
			studentId: true,
			submissionDate: true,
		}),
	},
	{
		StepComponent: TrackingDetailsStep,
		title: "Tracking details",
		validator: TacotsStudentTrackingFrontendSchema.pick({
			academicComment: true,
			financialNotes: true,
			formationComments: true,
			highestSubjectScore: true,
			lowestSubjectScore: true,
			mentorName: true,
			mentorshipDuration: true,
			mentorshipMode: true,
			mentorshipNotes: true,
			mentorshipSessionDate: true,
			paymentEvidence: true,
			resourcesSpent: true,
			responsibilityRating: true,
			schoolRulesRating: true,
			serviceActivityType: true,
			serviceDate: true,
			serviceDescription: true,
			serviceDuration: true,
			serviceSupervisor: true,
			socialBehaviorRating: true,
			studentAveragePct: true,
			studentPositionInClass: true,
			sundriesSpent: true,
			termResult: true,
			totalAmountSpent: true,
			tuitionFeePaid: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof TacotsStudentTrackingFrontendSchema>;

const useTacotsStudentTrackingStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>(
	{
		defaultValue: {
			currentStep: 0,
			formStepData: {
				academicComment: "",
				academicSession: undefined,
				academicTerm: undefined,
				assessmentPeriod: undefined,
				financialNotes: "",
				formationComments: "",
				highestSubjectScore: "",
				lowestSubjectScore: "",
				mentorName: "",
				mentorshipDuration: undefined,
				mentorshipMode: undefined,
				mentorshipNotes: "",
				mentorshipSessionDate: "",
				paymentEvidence: undefined,
				region: undefined,
				resourcesSpent: undefined,
				responsibilityRating: 0,
				schoolId: "",
				schoolRulesRating: 0,
				serviceActivityType: undefined,
				serviceDate: "",
				serviceDescription: "",
				serviceDuration: undefined,
				serviceSupervisor: "",
				socialBehaviorRating: 0,
				studentAveragePct: undefined,
				studentId: "",
				studentPositionInClass: "",
				submissionDate: "",
				sundriesSpent: undefined,
				termResult: undefined,
				totalAmountSpent: undefined,
				tuitionFeePaid: undefined,
			} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
		},
		key: "admin-tacots-student-tracking-form-data",
	}
);

function TacotsStudentTrackingPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Student Tracking Form" href="/admin/dashboard/tracker-forms" />
			<TacotsStudentTrackingForm />
		</Main>
	);
}

export default TacotsStudentTrackingPage;

function TacotsStudentTrackingForm() {
	const [storeValues, storeActions] = useTacotsStudentTrackingStorageState();

	const form = useForm({
		resolver: zodResolver(
			stepItems[storeValues.currentStep]?.validator ?? TacotsStudentTrackingFrontendSchema
		),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/tacots/tracking", {
			body: toFormData({
				...storeValues.formStepData,
				...data,
			}),
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

function StudentInformationStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[0]["validator"]>>();
	const tacotsOnboardedLookupQueryResult = useQuery(tacotsOnboardedLookupQuery());
	const students = tacotsOnboardedLookupQueryResult.data ?? [];
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));
	const schoolOptions = students.map((student) => ({ label: student.schoolName, value: student.id }));

	return (
		<>
			<FormStepComponentSectionHeader title="Student Information" />

			<SelectField
				control={control}
				name="studentId"
				placeholder="Student Full Name"
				classNames={{ item: "capitalize", trigger: "capitalize" }}
				options={studentOptions}
				required={true}
			/>
			<SelectField
				control={control}
				name="schoolId"
				placeholder="School Name"
				classNames={{ item: "capitalize", trigger: "capitalize" }}
				options={schoolOptions}
				required={true}
			/>
			<SelectField
				control={control}
				name="region"
				placeholder="Region"
				options={NigeriaStateOptions}
				required={true}
			/>
			<SelectField
				control={control}
				name="academicSession"
				placeholder="Academic Session"
				options={AcademicSessionOptions}
				required={true}
			/>
			<SelectField
				control={control}
				name="academicTerm"
				placeholder="Academic Term"
				options={TacotsAcademicTermOptions}
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="assessmentPeriod"
				question="Assessment Period"
				options={TacotsAssessmentPeriodOptions}
				required={true}
			/>

			<DateField
				control={control}
				name="submissionDate"
				placeholder="Date of Submission"
				required={true}
			/>
		</>
	);
}

function TrackingDetailsStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="Academic Performance" note="Filled by School Teacher" />

			<TextField
				control={control}
				name="highestSubjectScore"
				placeholder="Highest Subject Score"
				required={true}
			/>
			<TextField
				control={control}
				name="lowestSubjectScore"
				placeholder="Lowest Subject Score"
				required={true}
			/>
			<TextField
				control={control}
				name="studentAveragePct"
				placeholder="Student's Average (%)"
				type="number"
				required={true}
			/>
			<TextField
				control={control}
				name="studentPositionInClass"
				placeholder="Student's Position in Class"
				required={true}
			/>
			<FileUploadField
				control={control}
				name="termResult"
				label="Upload Copy of Result Sheet"
				required={true}
			/>
			<TextAreaField control={control} name="academicComment" label="Academic Comment" />

			<FormStepComponentSectionHeader title="School Formation" note="Filled by School Teacher" />

			<RatingQuestionField
				control={control}
				name="socialBehaviorRating"
				question="Social Behavior"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="schoolRulesRating"
				question="Adherence to School Rules/Punctuality"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="responsibilityRating"
				question="Sense of Responsibility"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<TextAreaField
				control={control}
				name="formationComments"
				label="Other Comments on Student Formation"
			/>

			<FormStepComponentSectionHeader title="Mentorship" note="Filled by Facilitator" />

			<TextField control={control} name="mentorName" placeholder="Mentor's Name" required={true} />
			<DateField
				control={control}
				name="mentorshipSessionDate"
				placeholder="Mentorship Session Date"
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="mentorshipMode"
				question="Mode of Mentorship"
				options={TacotsMentorshipModeOptions}
				required={true}
			/>
			<SelectField
				control={control}
				name="mentorshipDuration"
				placeholder="Duration of Mentorship Session"
				options={TacotsMentorshipDurationOptions}
				required={true}
			/>
			<TextAreaField
				control={control}
				name="mentorshipNotes"
				label="Brief Mentoring Session Notes"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Community Service" note="Filled by Beneficiary" />

			<SelectField
				control={control}
				name="serviceActivityType"
				placeholder="Type of Service Activity"
				options={TacotsServiceActivityTypeOptions}
				required={true}
			/>
			<DateField control={control} name="serviceDate" placeholder="Date of Activity" required={true} />
			<SelectField
				control={control}
				name="serviceDuration"
				placeholder="Duration of Activity (Hours)"
				options={TacotsServiceDurationOptions}
				required={true}
			/>
			<TextAreaField
				control={control}
				name="serviceDescription"
				label="Description of Activity"
				required={true}
			/>
			<TextField
				control={control}
				name="serviceSupervisor"
				placeholder="Supervisor / Validator"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Financial Support Tracking" note="Filled by Coordinator" />

			<TextField
				control={control}
				name="tuitionFeePaid"
				placeholder="Tuition Fee Paid"
				type="number"
				required={true}
			/>
			<TextField
				control={control}
				name="resourcesSpent"
				placeholder="Resources (Books, Stationeries, Learning Materials)"
				type="number"
				required={true}
			/>
			<TextField
				control={control}
				name="sundriesSpent"
				placeholder="Sundries"
				type="number"
				required={true}
			/>
			<TextField
				control={control}
				name="totalAmountSpent"
				placeholder="Total Amount Spent for the Term"
				type="number"
				required={true}
			/>
			<FileUploadField control={control} name="paymentEvidence" label="Upload Payment Evidence" />
			<TextAreaField control={control} name="financialNotes" label="Financial Notes" />
		</>
	);
}

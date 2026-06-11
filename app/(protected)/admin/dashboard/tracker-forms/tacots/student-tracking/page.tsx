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
	ClassOptions,
	TacotsAcademicTermOptions,
	TacotsAssessmentPeriodOptions,
	TacotsMentorshipModeOptions,
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
			assessmentPeriod: true,
			currentClass: true,
			currentSchool: true,
			dateOfSubmission: true,
			studentId: true,
			term: true,
		}),
	},
	{
		StepComponent: TrackingDetailsStep,
		title: "Tracking details",
		validator: TacotsStudentTrackingFrontendSchema.omit({
			academicSession: true,
			assessmentPeriod: true,
			currentClass: true,
			currentSchool: true,
			dateOfSubmission: true,
			studentId: true,
			term: true,
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
				academicSession: "",
				adherenceToSchoolRules: 0,
				assessmentPeriod: undefined,
				briefMentoringSessionNotes: "",
				communityServiceComment: "",
				currentClass: undefined,
				currentSchool: "",
				dateOfActivity: "",
				dateOfSubmission: "",
				descriptionOfActivity: "",
				financialNotes: "",
				highestSubjectScore: "",
				locationOfActivity: "",
				lowestSubjectScore: "",
				mentorName: "",
				mentorshipSessionDate: "",
				modeOfMentorship: undefined,
				resourcesGiven: "",
				resultSheet: undefined,
				schoolFormationComment: "",
				senseOfResponsibility: 0,
				socialBehavior: 0,
				studentId: "",
				studentPositionInClass: "",
				subjectsAverage: "",
				sundries: "",
				supervisorFacilitator: "",
				term: undefined,
				totalAmountSpentForTerm: "",
				tuitionFeePaid: "",
				typeOfServiceActivity: "",
				uploadPaymentEvidence: undefined,
			} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
		},
		key: "admin-tacots-student-tracking-form-data",
	}
);

function TacotsStudentTrackingPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Student Tracking Form" href="/admin/dashboard" />
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
	const { data: students = [] } = useQuery(tacotsOnboardedLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Student Information" />

			<SelectField
				control={form.control}
				name="studentId"
				placeholder="Student Full Name"
				options={studentOptions}
				required={true}
			/>
			<TextField
				control={form.control}
				name="currentSchool"
				placeholder="School Name"
				required={true}
			/>
			<SelectField
				control={form.control}
				name="term"
				placeholder="Term"
				options={TacotsAcademicTermOptions}
				required={true}
			/>
			<SelectField
				control={form.control}
				name="academicSession"
				placeholder="Academic Session"
				options={AcademicSessionOptions}
				required={true}
			/>
			<SelectField
				control={form.control}
				name="currentClass"
				placeholder="Academic Term"
				options={ClassOptions}
				required={true}
			/>

			<OptionQuestionField
				control={form.control}
				name="assessmentPeriod"
				question="Assessment Period"
				options={TacotsAssessmentPeriodOptions}
				required={true}
			/>

			<DateField
				control={form.control}
				name="dateOfSubmission"
				placeholder="Date of Submission"
				required={true}
			/>
		</>
	);
}

function TrackingDetailsStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Academic Performance" note="Filled by School Teacher" />

			<TextField
				control={form.control}
				name="highestSubjectScore"
				placeholder="Highest Subject Score"
			/>
			<TextField control={form.control} name="lowestSubjectScore" placeholder="Lowest Subject Score" />
			<TextField control={form.control} name="subjectsAverage" placeholder="Student's Average (%)" />
			<TextField
				control={form.control}
				name="studentPositionInClass"
				placeholder="Student's Position in Class"
			/>
			<FileUploadField control={form.control} name="resultSheet" label="Upload Copy of Result Sheet" />
			<TextAreaField control={form.control} name="academicComment" label="Academic Comment" />

			<FormStepComponentSectionHeader title="School Formation" note="Filled by School Teacher" />

			<RatingQuestionField
				control={form.control}
				name="socialBehavior"
				question="Social Behavior"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="adherenceToSchoolRules"
				question="Adherence to School Rules/Punctuality"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<RatingQuestionField
				control={form.control}
				name="senseOfResponsibility"
				question="Sense of Responsibility"
				leftLabel="1"
				rightLabel="5"
				required={true}
			/>
			<TextAreaField
				control={form.control}
				name="schoolFormationComment"
				label="Other Comments on Student Formation"
			/>

			<FormStepComponentSectionHeader title="Mentorship" note="Filled by Facilitator" />

			<TextField control={form.control} name="mentorName" placeholder="Mentor's Name" />
			<DateField
				control={form.control}
				name="mentorshipSessionDate"
				placeholder="Mentorship Session Date"
			/>
			<OptionQuestionField
				control={form.control}
				name="modeOfMentorship"
				question="Mode of Mentorship"
				options={TacotsMentorshipModeOptions}
			/>
			<TextAreaField
				control={form.control}
				name="briefMentoringSessionNotes"
				label="Brief Mentoring Session Notes"
			/>

			<FormStepComponentSectionHeader title="Community Service" note="Filled by Beneficiary" />

			<TextField
				control={form.control}
				name="typeOfServiceActivity"
				placeholder="Type of Service Activity"
			/>
			<DateField control={form.control} name="dateOfActivity" placeholder="Date of Activity" />
			<TextField control={form.control} name="locationOfActivity" placeholder="Location of Activity" />
			<TextAreaField
				control={form.control}
				name="descriptionOfActivity"
				label="Description of Activity"
			/>
			<TextField
				control={form.control}
				name="supervisorFacilitator"
				placeholder="Supervisor / Facilitator"
			/>
			<TextAreaField control={form.control} name="communityServiceComment" label="Comments" />

			<FormStepComponentSectionHeader title="Financial Support Tracking" note="Filled by Coordinator" />

			<TextField control={form.control} name="tuitionFeePaid" placeholder="Tuition Fee Paid" />
			<TextField control={form.control} name="resourcesGiven" placeholder="Resources Given" />
			<TextField control={form.control} name="sundries" placeholder="Sundries" />
			<TextField
				control={form.control}
				name="totalAmountSpentForTerm"
				placeholder="Total Amount Spent for the Term"
			/>
			<FileUploadField
				control={form.control}
				name="uploadPaymentEvidence"
				label="Upload Payment Evidence"
			/>
			<TextAreaField control={form.control} name="financialNotes" label="Financial Notes" />
		</>
	);
}

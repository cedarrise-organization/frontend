"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm, type Control, type FieldValues, type Path } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	ClassOptions,
	TacotsOnboardingFrontendSchema,
	YesNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import { tacotsRecommendedLookupQuery } from "@/lib/react-query/queryOptions";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const stepItems = defineFormStepItems([
	{
		StepComponent: MentalHealthStep,
		title: "Mental health",
		validator: TacotsOnboardingFrontendSchema.pick({
			academicDifficulties: true,
			angerManagement: true,
			attendanceRegularity: true,
			behavioralIssues: true,
			dateOfOnboarding: true,
			developmentalConcerns: true,
			disabilityOrSpecialNeeds: true,
			familyChallenges: true,
			learningDifficulties: true,
			lowSelfEsteem: true,
			mentalHealthNotes: true,
			mentalHealthRating: true,
			moodSwings: true,
			recommendedStudentId: true,
			referralRecommended: true,
			socialChallenges: true,
		}),
	},
	{
		StepComponent: PhysicalHealthStep,
		title: "Physical health",
		validator: TacotsOnboardingFrontendSchema.pick({
			chronicIllness: true,
			dentalProblem: true,
			hearingProblem: true,
			immunizationUpToDate: true,
			nutritionStatus: true,
			physicalActivityLevel: true,
			physicalConcernAffectsSchool: true,
			physicalHealthNotes: true,
			physicalHealthRating: true,
			recentHospitalization: true,
		}),
	},
	{
		StepComponent: SchoolConsentStep,
		title: "School and consent",
		validator: TacotsOnboardingFrontendSchema.pick({
			acceptanceConfirmed: true,
			currentClass: true,
			currentSchool: true,
			guardianSignature: true,
			localGovernmentArea: true,
			parentSignature: true,
			schoolEnrollmentDate: true,
			schoolFeeRange: true,
			schoolFeesPaid: true,
			state: true,
			studentCurrentSituation: true,
			studentDeclarationAccepted: true,
			supportRequired: true,
			termsAccepted: true,
		}),
	},
	{
		StepComponent: DocumentationStep,
		title: "Documentation",
		validator: TacotsOnboardingFrontendSchema.pick({
			additionalNotes: true,
			passportPhoto: true,
			programOfficerName: true,
			sponsorName: true,
			supportType: true,
			uploadRecommendationLetter: true,
			witnessName: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof TacotsOnboardingFrontendSchema>;

const useTacotsOnboardingStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			academicDifficulties: "",
			acceptanceConfirmed: undefined,
			additionalNotes: "",
			angerManagement: "",
			attendanceRegularity: 0,
			behavioralIssues: "",
			chronicIllness: "",
			currentClass: undefined,
			currentSchool: "",
			dateOfOnboarding: "",
			dentalProblem: "",
			developmentalConcerns: "",
			disabilityOrSpecialNeeds: "",
			familyChallenges: "",
			guardianSignature: undefined,
			hearingProblem: "",
			immunizationUpToDate: "",
			learningDifficulties: "",
			localGovernmentArea: "",
			lowSelfEsteem: "",
			mentalHealthNotes: "",
			mentalHealthRating: undefined,
			moodSwings: "",
			nutritionStatus: "",
			parentSignature: undefined,
			passportPhoto: undefined,
			physicalActivityLevel: "",
			physicalConcernAffectsSchool: "",
			physicalHealthNotes: "",
			physicalHealthRating: undefined,
			programOfficerName: "",
			recentHospitalization: "",
			recommendedStudentId: "",
			referralRecommended: "",
			schoolEnrollmentDate: "",
			schoolFeeRange: "",
			schoolFeesPaid: "",
			socialChallenges: "",
			sponsorName: "",
			state: "",
			studentCurrentSituation: "",
			studentDeclarationAccepted: undefined,
			supportRequired: "",
			supportType: "",
			termsAccepted: undefined,
			uploadRecommendationLetter: undefined,
			witnessName: "",
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "admin-tacots-beneficiary-onboarding-form-data",
});

function TacotsBeneficiaryOnboardingPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Beneficiary Onboarding Form" href="/admin/dashboard/tracker-forms" />
			<TacotsBeneficiaryOnboardingForm />
		</Main>
	);
}

export default TacotsBeneficiaryOnboardingPage;

function TacotsBeneficiaryOnboardingForm() {
	const [storeValues, storeActions] = useTacotsOnboardingStorageState();

	const form = useForm({
		resolver: zodResolver(
			stepItems[storeValues.currentStep]?.validator ?? TacotsOnboardingFrontendSchema
		),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/tacots/onboarding", {
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

function MentalHealthStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[0]["validator"]>>();
	const { data: students = [] } = useQuery(tacotsRecommendedLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));
	const form = { control };

	return (
		<>
			<SelectField
				control={form.control}
				name="recommendedStudentId"
				placeholder="Student Name"
				options={studentOptions}
				required={true}
			/>
			<DateField
				control={form.control}
				name="dateOfOnboarding"
				placeholder="Date of Onboarding"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Mental Health & Developmental Indicators" />

			<OptionQuestionField
				control={form.control}
				name="developmentalConcerns"
				question="Has the student ever been diagnosed with a developmental or mental health condition?"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="learningDifficulties"
				question="Any learning difficulties?"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="behavioralIssues"
				question="Any behavioural issues?"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="academicDifficulties"
				question="Difficulty concentrating in class"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="socialChallenges"
				question="Difficulty socializing or relating with peers"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="attendanceRegularity"
				question="Irregular attendance / lateness to class"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="disabilityOrSpecialNeeds"
				question="Diagnosed disabilities / special needs"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="familyChallenges"
				question="Major family challenges"
				options={YesNoOptions}
			/>
			<RatingQuestionField
				control={form.control}
				name="mentalHealthRating"
				question="Rate the young person's overall mental health condition"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
			/>
			<TextAreaField
				control={form.control}
				name="mentalHealthNotes"
				label="Additional Notes on Student's mental and emotional well being"
			/>
		</>
	);
}

function PhysicalHealthStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Physical Health Assessment" />

			<OptionQuestionField
				control={form.control}
				name="chronicIllness"
				question="Known chronic illness"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="physicalActivityLevel"
				question="Regular physical activities"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="immunizationUpToDate"
				question="Immunization status confirmed"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="recentHospitalization"
				question="Recent hospitalization or major health issue"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="nutritionStatus"
				question="Poor nutrition"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="dentalProblem"
				question="Dental problems"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="hearingProblem"
				question="Hearing problem"
				options={YesNoOptions}
			/>
			<OptionQuestionField
				control={form.control}
				name="physicalConcernAffectsSchool"
				question="Does the physical issue affect school participation?"
				options={YesNoOptions}
			/>
			<RatingQuestionField
				control={form.control}
				name="physicalHealthRating"
				question="Physical health rating"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
			/>
			<TextAreaField
				control={form.control}
				name="physicalHealthNotes"
				label="Provide any other relevant health information about the student"
			/>
		</>
	);
}

function SchoolConsentStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[2]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="School Enrolment Details" />

			<TextField
				control={form.control}
				name="currentSchool"
				placeholder="Student Current School"
				required={true}
			/>
			<TextField control={form.control} name="state" placeholder="State" required={true} />
			<TextField
				control={form.control}
				name="localGovernmentArea"
				placeholder="Local Government Area"
				required={true}
			/>
			<SelectField
				control={form.control}
				name="currentClass"
				placeholder="Class Enrolled In"
				options={ClassOptions}
				required={true}
			/>
			<TextField control={form.control} name="schoolFeeRange" placeholder="School Fee Range" />
			<DateField
				control={form.control}
				name="schoolEnrollmentDate"
				placeholder="School Fees Assumption Date"
				required={true}
			/>
			<TextField
				control={form.control}
				name="schoolFeesPaid"
				placeholder="School Fees paid / being sponsored"
			/>

			<FormStepComponentSectionHeader title="Student Commitment" />

			<BooleanAgreementField
				control={form.control}
				name="studentDeclarationAccepted"
				label="The student agrees to attend school regularly and participate in mentoring."
			/>
			<BooleanAgreementField
				control={form.control}
				name="termsAccepted"
				label="Parent/guardian understands and accepts the TACOTS programme terms."
			/>
			<BooleanAgreementField
				control={form.control}
				name="acceptanceConfirmed"
				label="I confirm that the student's onboarding information is accurate."
			/>
			<TextAreaField
				control={form.control}
				name="studentCurrentSituation"
				label="Current situation of the student"
			/>
			<TextField control={form.control} name="supportRequired" placeholder="Support required" />
			<FileUploadField
				control={form.control}
				name="parentSignature"
				label="Upload a copy of parent's signature and name"
			/>
			<FileUploadField
				control={form.control}
				name="guardianSignature"
				label="Upload guardian signature"
			/>
		</>
	);
}

function DocumentationStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[3]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Documentation" />

			<FileUploadField
				control={form.control}
				name="passportPhoto"
				label="Upload Student Passport Photograph"
			/>
			<TextField
				control={form.control}
				name="programOfficerName"
				placeholder="Program Officer Name"
				required={true}
			/>
			<TextField control={form.control} name="supportType" placeholder="Type of Support" />
			<TextField control={form.control} name="witnessName" placeholder="Witness Name" />
			<TextField control={form.control} name="sponsorName" placeholder="Sponsor Name" />
			<FileUploadField
				control={form.control}
				name="uploadRecommendationLetter"
				label="Upload Recommendation Letter"
			/>
			<TextAreaField control={form.control} name="additionalNotes" label="Any Additional Information" />
		</>
	);
}

function BooleanAgreementField<TFieldValues extends FieldValues>(props: {
	control: Control<TFieldValues, unknown, TFieldValues>;
	label: string;
	name: Path<TFieldValues>;
}) {
	const { control, label, name } = props;

	return (
		<Form.Field
			control={control}
			name={name}
			className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
		>
			<Form.FieldBoundController
				render={({ field }) => (
					<Checkbox
						checked={field.value}
						onCheckedChange={field.onChange}
						classNames={{
							base: `mt-[2px] size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
							bg-transparent lg:mt-[3px] data-checked:bg-transparent`,
							icon: "size-3",
						}}
					/>
				)}
			/>
			<Form.Label>{label}</Form.Label>
		</Form.Field>
	);
}

"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	AgreementField,
	CheckboxQuestionField,
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
	ClassOptions,
	NigeriaStateOptions,
	TacotsAllergyOptions,
	TacotsBehavioralIndicatorOptions,
	TacotsChronicConditionOptions,
	TacotsDiagnosedConditionOptions,
	TacotsGeneralHealthStatusOptions,
	TacotsImmunizationStatusOptions,
	TacotsMentalHealthDiagnosisOptions,
	TacotsNeedsSpecialSupportOptions,
	TacotsOnboardingFrontendSchema,
	TacotsPhysicalLimitationOptions,
	TacotsSupportTypeOptions,
	YesNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import { tacotsRecommendedLookupQuery } from "@/lib/react-query/queryOptions";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const stepItems = defineFormStepItems([
	{
		StepComponent: MentalHealthStepOne,
		title: "Mental health",
		validator: TacotsOnboardingFrontendSchema.pick({
			behavioralIndicators: true,
			diagnosedConditions: true,
			emotionalStabilityRating: true,
			focusAbilityRating: true,
			hasMentalHealthDiagnosis: true,
			mentalHealthNotes: true,
			needsSpecialSupport: true,
			onboardingDate: true,
			peerInteractionRating: true,
			receivedCounseling: true,
			studentId: true,
		}),
	},
	{
		StepComponent: PhysicalHealthStepTwo,
		title: "Physical health",
		validator: TacotsOnboardingFrontendSchema.pick({
			additionalHealthNotes: true,
			allergies: true,
			chronicConditions: true,
			generalHealthStatus: true,
			hasChronicCondition: true,
			immunizationStatus: true,
			physicalActivityLevel: true,
			physicalLimitations: true,
			requiresMedication: true,
		}),
	},
	{
		StepComponent: SchoolConsentStepThree,
		title: "School and consent",
		validator: TacotsOnboardingFrontendSchema.pick({
			enrolledClass: true,
			enrolledSchoolLga: true,
			enrolledSchoolName: true,
			enrolledSchoolState: true,
			enrolledSchoolTown: true,
			parentGuardianCommitment: true,
			parentSignature: true,
			schoolFeesPerTerm: true,
			studentCommitment: true,
			termResumptionDate: true,
		}),
	},
	{
		StepComponent: DocumentationStepFour,
		title: "Documentation",
		validator: TacotsOnboardingFrontendSchema.pick({
			additionalInfo: true,
			admissionLetter: true,
			mentorName: true,
			programOfficerNotes: true,
			sponsorName: true,
			supportTypesApproved: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof TacotsOnboardingFrontendSchema>;

const useTacotsOnboardingStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			additionalHealthNotes: "",
			additionalInfo: "",
			admissionLetter: undefined,
			allergies: [],
			behavioralIndicators: [],
			chronicConditions: [],
			diagnosedConditions: [],
			emotionalStabilityRating: undefined,
			enrolledClass: undefined,
			enrolledSchoolLga: "",
			enrolledSchoolName: "",
			enrolledSchoolState: undefined,
			enrolledSchoolTown: "",
			focusAbilityRating: undefined,
			generalHealthStatus: undefined,
			hasChronicCondition: undefined,
			hasMentalHealthDiagnosis: undefined,
			immunizationStatus: undefined,
			mentalHealthNotes: "",
			mentorName: "",
			needsSpecialSupport: undefined,
			onboardingDate: "",
			parentGuardianCommitment: undefined,
			parentSignature: undefined,
			peerInteractionRating: undefined,
			physicalActivityLevel: undefined,
			physicalLimitations: undefined,
			programOfficerNotes: "",
			receivedCounseling: undefined,
			requiresMedication: undefined,
			schoolFeesPerTerm: undefined,
			sponsorName: "",
			studentCommitment: undefined,
			studentId: "",
			supportTypesApproved: [],
			termResumptionDate: "",
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "admin-tacots-beneficiary-onboarding-form-data",
});

function TacotsBeneficiaryOnboardingPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader
				title="TACOTS Beneficiary Onboarding Form"
				href="/admin/dashboard/tracker-forms"
			/>
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

function MentalHealthStepOne() {
	const { control } = useFormContext<z.input<(typeof stepItems)[0]["validator"]>>();
	const tacotsRecommendedLookupQueryResult = useQuery(tacotsRecommendedLookupQuery());
	const students = tacotsRecommendedLookupQueryResult.data ?? [];
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));

	return (
		<>
			<SelectField
				control={control}
				name="studentId"
				placeholder="Student Name"
				options={studentOptions}
				required={true}
			/>
			<DateField
				control={control}
				name="onboardingDate"
				placeholder="Date of Onboarding"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Mental Health & Developmental Indicators" />

			<OptionQuestionField
				control={control}
				name="hasMentalHealthDiagnosis"
				question="Has the student ever been diagnosed with a developmental or mental health condition?"
				options={TacotsMentalHealthDiagnosisOptions}
				required={true}
			/>
			<CheckboxQuestionField
				control={control}
				name="diagnosedConditions"
				question="If yes, what condition has been diagnosed?"
				options={TacotsDiagnosedConditionOptions}
			/>
			<CheckboxQuestionField
				control={control}
				name="behavioralIndicators"
				question="Does the student show any of the following behaviors in school or at home?"
				options={TacotsBehavioralIndicatorOptions}
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="focusAbilityRating"
				question="Ability to focus during school activities"
				leftLabel="Very poor"
				rightLabel="Excellent"
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="emotionalStabilityRating"
				question="Emotional stability"
				leftLabel="Very unstable"
				rightLabel="Very stable"
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="peerInteractionRating"
				question="Interaction with peers"
				leftLabel="Very poor"
				rightLabel="Excellent"
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="receivedCounseling"
				question="Has the student ever received counseling or psychological support?"
				options={TacotsMentalHealthDiagnosisOptions}
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="needsSpecialSupport"
				question="Does the student currently need special learning support?"
				options={TacotsNeedsSpecialSupportOptions}
				required={true}
			/>
			<TextAreaField
				control={control}
				name="mentalHealthNotes"
				label="Additional Notes on Student's Mental or Emotional Well-being"
			/>
		</>
	);
}

function PhysicalHealthStepTwo() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="Physical Health Assessment" />

			<OptionQuestionField
				control={control}
				name="generalHealthStatus"
				question="General health status"
				options={TacotsGeneralHealthStatusOptions}
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="immunizationStatus"
				question="Immunization status"
				options={TacotsImmunizationStatusOptions}
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="hasChronicCondition"
				question="Does the student have any chronic medical condition?"
				options={TacotsMentalHealthDiagnosisOptions}
				required={true}
			/>
			<CheckboxQuestionField
				control={control}
				name="chronicConditions"
				question="If yes, indicate the condition"
				options={TacotsChronicConditionOptions}
			/>
			<CheckboxQuestionField
				control={control}
				name="allergies"
				question="Does the student have any allergies?"
				options={TacotsAllergyOptions}
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="requiresMedication"
				question="Does the student require regular medication?"
				options={YesNoOptions}
				required={true}
			/>
			<RatingQuestionField
				control={control}
				name="physicalActivityLevel"
				question="Physical activity level"
				leftLabel="Low"
				rightLabel="High"
				required={true}
			/>
			<OptionQuestionField
				control={control}
				name="physicalLimitations"
				question="Any physical limitations that might affect school activities?"
				options={TacotsPhysicalLimitationOptions}
				required={true}
			/>
			<TextAreaField
				control={control}
				name="additionalHealthNotes"
				label="Provide any other relevant health information about the student"
			/>
		</>
	);
}

function SchoolConsentStepThree() {
	const { control } = useFormContext<z.input<(typeof stepItems)[2]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="School Enrollment Details" />

			<TextField
				control={control}
				name="enrolledSchoolName"
				placeholder="School Enrolled (name)"
				required={true}
			/>
			<SelectField
				control={control}
				name="enrolledSchoolState"
				placeholder="State"
				options={NigeriaStateOptions}
				required={true}
			/>
			<div className="grid gap-4 lg:grid-cols-2">
				<TextField
					control={control}
					name="enrolledSchoolLga"
					placeholder="Local Government Area"
					required={true}
				/>
				<TextField
					control={control}
					name="enrolledSchoolTown"
					placeholder="Town / city"
					required={true}
				/>
			</div>
			<SelectField
				control={control}
				name="enrolledClass"
				placeholder="Class Enrolled In"
				options={ClassOptions}
				required={true}
			/>
			<DateField
				control={control}
				name="termResumptionDate"
				placeholder="School Term Resumption Date"
				required={true}
			/>
			<TextField
				control={control}
				name="schoolFeesPerTerm"
				placeholder="School Fees per Term (budgeted)"
				inputMode="decimal"
			/>

			<FormStepComponentSectionHeader title="Student Commitment (for students 14 years and above)" />

			<AgreementField
				control={control}
				name="studentCommitment"
				description="I understand that participation in the TACOTS program and retaining the scholarship requires
				good conduct, regular school attendance, and participation in mentorship and community service
				activities."
				label="By checking this box, I commit to maintaining an average of 65% and above in my termly assessment, to participate in all formative activities organized by my school and the organization. I also commit to give back by offering a minimum of 30 hours of volunteer services each year."
			/>

			<FormStepComponentSectionHeader title="Parent/Guardian Commitment" />

			<AgreementField
				control={control}
				name="parentGuardianCommitment"
				description="Scholarship conditions include academic performance, personal formation, community service,
				media consent, program monitoring, and responsible handling of beneficiary information."
				label="I confirm that I have read and understood the scholarship conditions and agree to comply with them."
				required={true}
			/>
			<FileUploadField
				control={control}
				name="parentSignature"
				label="Upload a copy of parent's signature and name"
			/>
		</>
	);
}

function DocumentationStepFour() {
	const { control } = useFormContext<z.input<(typeof stepItems)[3]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="Documentation" />

			<FileUploadField
				control={control}
				name="admissionLetter"
				label="Upload School Admission Letter/Prospectus (if available)"
				allowedFileTypes={["application/pdf", "image/png", "image/jpg", "image/jpeg", "image/webp"]}
			/>
			<TextAreaField control={control} name="programOfficerNotes" label="Program Officer Notes" />
			<CheckboxQuestionField
				control={control}
				name="supportTypesApproved"
				question="Types of Support To Be Given"
				options={TacotsSupportTypeOptions}
			/>
			<TextField control={control} name="mentorName" placeholder="Mentors Name" />
			<TextField control={control} name="sponsorName" placeholder="Sponsors Name" />
			<TextAreaField control={control} name="additionalInfo" label="Any Additional Information" />
		</>
	);
}

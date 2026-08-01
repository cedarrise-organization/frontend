"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	AgreementField,
	CheckboxQuestionField,
	ComboboxField,
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
import { Main } from "@/app/(home)/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	ClassOptions,
	GenderOptions,
	getLgaOptions,
	HouseholdSizeOptions,
	NigeriaStateOptions,
	PrimaryLanguageOptions,
	SiblingsOptions,
	TacotsAgeOptions,
	TacotsAnnualHouseholdIncomeOptions,
	TacotsCatholicSacramentOptions,
	TacotsFamilyPositionOptions,
	TacotsGuardianRelationshipOptions,
	TacotsIncomeEarnerCountOptions,
	TacotsIncomeSourceOptions,
	TacotsLivesWithOptions,
	TacotsRecommendationFrontendSchema,
	TacotsRecommendationReligionOptions,
	TacotsResidenceTypeOptions,
	TacotsSpecialCircumstanceOptions,
	TacotsSupportTypeOptions,
	TacotsYearOptions,
	YesNoSometimesOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const TacotsRecommendationSchema = TacotsRecommendationFrontendSchema;

function RecommendationFormPage() {
	return (
		<Main showWatermark={true} className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Recommendation Form" href="/social-initiatives/tacots" />
			<TacotsRecommendationForm />
		</Main>
	);
}

export default RecommendationFormPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentPersonalInformationStepOne,
		title: "Student personal information",
		validator: TacotsRecommendationSchema.pick({
			age: true,
			catholicSacraments: true,
			diocese: true,
			dob: true,
			firstName: true,
			gender: true,
			homeAddress: true,
			lga: true,
			middleName: true,
			nationality: true,
			parishAttended: true,
			phoneNumber: true,
			primaryLanguage: true,
			religion: true,
			stateOfOrigin: true,
			surname: true,
		}),
	},
	{
		StepComponent: EducationalInformationStepTwo,
		title: "Educational information",
		validator: TacotsRecommendationSchema.pick({
			classPositionLastTerm: true,
			lastClass: true,
			lastResult: true,
			lastTermAverage: true,
			lastYearAttended: true,
			passportPhoto: true,
			schoolName: true,
			schoolState: true,
			schoolTown: true,
		}),
	},
	{
		StepComponent: FamilyBackgroundStepThree,
		title: "Family background",
		validator: TacotsRecommendationSchema.pick({
			annualHouseholdIncome: true,
			avgMonthlyIncome: true,
			familyPosition: true,
			fathersName: true,
			fathersOccupation: true,
			fathersPhone: true,
			guardianAddress: true,
			guardianName: true,
			guardianOccupation: true,
			guardianPhone: true,
			guardianRelationship: true,
			hasElectricity: true,
			householdSize: true,
			incomeSources: true,
			livesWith: true,
			mothersName: true,
			mothersOccupation: true,
			mothersPhone: true,
			numIncomeEarners: true,
			numSiblings: true,
			parentsAddress: true,
			residenceType: true,
			specialCircumstances: true,
		}),
	},
	{
		StepComponent: RecommenderDetailsStepFour,
		title: "Recommender details",
		validator: TacotsRecommendationSchema.pick({
			careerGoal: true,
			childBackgroundNotes: true,
			declarationConfirmed: true,
			disciplineRating: true,
			otherImportantInfo: true,
			recommenderAddress: true,
			recommenderFirstName: true,
			recommenderLastName: true,
			recommenderPhone: true,
			responsibilityRating: true,
			studentStatement: true,
			supportTypesNeeded: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof TacotsRecommendationSchema>;

const useTacotsRecommendationStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			age: undefined,
			annualHouseholdIncome: undefined,
			avgMonthlyIncome: "",
			careerGoal: "",
			catholicSacraments: [],
			childBackgroundNotes: "",
			classPositionLastTerm: "",
			declarationConfirmed: undefined,
			diocese: "",
			disciplineRating: 0,
			dob: "",
			familyPosition: undefined,
			fathersName: "",
			fathersOccupation: "",
			fathersPhone: "",
			firstName: "",
			gender: undefined,
			guardianAddress: "",
			guardianName: "",
			guardianOccupation: "",
			guardianPhone: "",
			guardianRelationship: undefined,
			hasElectricity: undefined,
			homeAddress: "",
			householdSize: undefined,
			incomeSources: [],
			lastClass: undefined,
			lastResult: undefined,
			lastTermAverage: "",
			lastYearAttended: undefined,
			lga: "",
			livesWith: undefined,
			middleName: "",
			mothersName: "",
			mothersOccupation: "",
			mothersPhone: "",
			nationality: "",
			numIncomeEarners: undefined,
			numSiblings: undefined,
			otherImportantInfo: "",
			parentsAddress: "",
			parishAttended: "",
			passportPhoto: undefined,
			phoneNumber: "",
			primaryLanguage: undefined,
			recommenderAddress: "",
			recommenderFirstName: "",
			recommenderLastName: "",
			recommenderPhone: "",
			religion: undefined,
			residenceType: undefined,
			responsibilityRating: 0,
			schoolName: "",
			schoolState: undefined,
			schoolTown: "",
			specialCircumstances: undefined,
			stateOfOrigin: undefined,
			studentStatement: "",
			supportTypesNeeded: [],
			surname: "",
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "tacots-recommendation-form-data",
});

function TacotsRecommendationForm() {
	const [storeValues, storeActions] = useTacotsRecommendationStorageState();

	const form = useForm({
		resolver: zodResolver(stepItems[storeValues.currentStep]?.validator ?? TacotsRecommendationSchema),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/tacots/recommendation", {
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

function StudentPersonalInformationStepOne() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[0]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Student Personal Information" />

			<TextField control={form.control} name="firstName" placeholder="First Name" required={true} />
			<TextField control={form.control} name="middleName" placeholder="Middle Name" />
			<TextField control={form.control} name="surname" placeholder="Surname" required={true} />

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit" }}
				name="age"
				placeholder="Age"
				options={TacotsAgeOptions}
				required={true}
			/>

			<DateField control={form.control} name="dob" placeholder="Date of Birth" required={true} />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={GenderOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				name="religion"
				placeholder="Religion/Denomination"
				options={TacotsRecommendationReligionOptions}
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="catholicSacraments"
				question="If Catholic - Sacraments Received"
				options={TacotsCatholicSacramentOptions}
			/>

			<TextField
				control={form.control}
				name="parishAttended"
				placeholder="Parish Attended (If Catholic)"
			/>
			<TextField control={form.control} name="diocese" placeholder="Diocese (If Catholic)" />

			<SelectField
				control={form.control}
				name="primaryLanguage"
				placeholder="Primary Language Spoken at Home"
				options={PrimaryLanguageOptions}
				required={true}
			/>

			<TextField
				control={form.control}
				name="phoneNumber"
				placeholder="Participant's Phone Number"
				type="tel"
			/>
			<TextField control={form.control} name="nationality" placeholder="Nationality" required={true} />

			<div className="flex gap-3">
				<ComboboxField
					control={form.control}
					name="stateOfOrigin"
					placeholder="State of Origin"
					options={NigeriaStateOptions}
					required={true}
				/>

				<Form.Watch control={form.control} name="stateOfOrigin">
					{(stateOfOrigin) => (
						<ComboboxField
							control={form.control}
							disabled={!stateOfOrigin}
							name="lga"
							placeholder="Local Government Area"
							options={getLgaOptions(stateOfOrigin)}
							required={true}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField
				control={form.control}
				name="homeAddress"
				placeholder="Home Address / Community"
				required={true}
			/>
		</>
	);
}

function EducationalInformationStepTwo() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Educational Information" />

			<TextField
				control={form.control}
				name="schoolName"
				placeholder="Name of Current School or Last School Attended"
				required={true}
			/>

			<div className="flex flex-col gap-3">
				<TextField control={form.control} name="schoolTown" placeholder="Town/ City" required={true} />
				<SelectField
					control={form.control}
					name="schoolState"
					placeholder="State"
					options={NigeriaStateOptions}
					required={true}
				/>
			</div>

			<SelectField
				control={form.control}
				name="lastYearAttended"
				placeholder="Last Year Student Attended School"
				options={TacotsYearOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[380px]" }}
				name="lastClass"
				placeholder="Last Class"
				options={ClassOptions}
				required={true}
			/>

			<TextField
				control={form.control}
				name="classPositionLastTerm"
				placeholder="Position in Class at the Last Term"
				min={1}
				step={1}
				type="number"
				required={true}
			/>

			<TextField
				control={form.control}
				name="lastTermAverage"
				placeholder="Student's Average in the Last Term's exam"
				min={0}
				max={100}
				step="any"
				type="number"
			/>

			<FileUploadField
				control={form.control}
				name="passportPhoto"
				label="Upload a Current Passport Photograph"
				required={true}
			/>

			<FileUploadField
				control={form.control}
				name="lastResult"
				label="Upload a Copy of Your Last Result"
				required={true}
			/>
		</>
	);
}

function FamilyBackgroundStepThree() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[2]["validator"]>>();
	const form = { control };

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Family Background" />

				<TextField
					control={form.control}
					name="fathersName"
					placeholder="Father's Name"
					required={true}
				/>
				<TextField
					control={form.control}
					name="fathersOccupation"
					placeholder="Father's Occupation"
					required={true}
				/>
				<TextField
					control={form.control}
					name="fathersPhone"
					placeholder="Father's Phone Number"
					type="tel"
					required={true}
				/>
				<TextField
					control={form.control}
					name="mothersName"
					placeholder="Mother's Name"
					required={true}
				/>
				<TextField
					control={form.control}
					name="mothersOccupation"
					placeholder="Mother's Occupation"
					required={true}
				/>
				<TextField
					control={form.control}
					name="mothersPhone"
					placeholder="Mother's Phone Number"
					type="tel"
					required={true}
				/>
				<TextField
					control={form.control}
					name="parentsAddress"
					placeholder="Parent's Address"
					required={true}
				/>
				<TextField
					control={form.control}
					name="guardianName"
					placeholder="Guardian Name ( If Applicable)"
				/>
				<TextField
					control={form.control}
					name="guardianPhone"
					placeholder="Guardian Phone Number"
					type="tel"
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[305px]" }}
					name="guardianRelationship"
					placeholder="Relationship to Student"
					options={TacotsGuardianRelationshipOptions}
				/>
				<TextField
					control={form.control}
					name="guardianOccupation"
					placeholder="Guardian Occupation"
				/>
				<TextField control={form.control} name="guardianAddress" placeholder="Guardian Address" />
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="householdSize"
					placeholder="Household Size"
					options={HouseholdSizeOptions}
					required={true}
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="numSiblings"
					placeholder="Number of Siblings"
					options={SiblingsOptions}
					required={true}
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="familyPosition"
					placeholder="Child's Position in the Family"
					options={TacotsFamilyPositionOptions}
					required={true}
				/>

				<OptionQuestionField
					control={form.control}
					name="specialCircumstances"
					question="Special Circumstances"
					options={TacotsSpecialCircumstanceOptions}
					required={true}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Family financials</h2>

				<OptionQuestionField
					control={form.control}
					name="annualHouseholdIncome"
					question="1. Annual Household Income"
					options={TacotsAnnualHouseholdIncomeOptions}
					required={true}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="incomeSources"
					question="2. Source of Household Income"
					options={TacotsIncomeSourceOptions}
					required={true}
				/>

				<OptionQuestionField
					control={form.control}
					name="numIncomeEarners"
					question="3. Number of Income Earners in the Household"
					options={TacotsIncomeEarnerCountOptions}
					required={true}
				/>

				<TextField
					control={form.control}
					name="avgMonthlyIncome"
					placeholder="Average Monthly Household Income"
					min={0}
					step={1}
					type="number"
				/>

				<OptionQuestionField
					control={form.control}
					name="livesWith"
					question="4. Who does the student currently live with?"
					options={TacotsLivesWithOptions}
					required={true}
				/>

				<OptionQuestionField
					control={form.control}
					name="residenceType"
					question="5. Type of Residence"
					options={TacotsResidenceTypeOptions}
					required={true}
				/>

				<OptionQuestionField
					control={form.control}
					name="hasElectricity"
					question="6. Does the household have access to electricity?"
					options={YesNoSometimesOptions}
					required={true}
				/>
			</section>
		</>
	);
}

function RecommenderDetailsStepFour() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[3]["validator"]>>();
	const form = { control };

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Recommender's Details" />

				<TextField
					control={form.control}
					name="recommenderFirstName"
					placeholder="First Name"
					required={true}
				/>
				<TextField
					control={form.control}
					name="recommenderLastName"
					placeholder="Last Name"
					required={true}
				/>
				<TextField
					control={form.control}
					name="recommenderPhone"
					placeholder="Phone Number"
					type="tel"
					required={true}
				/>
				<TextField
					control={form.control}
					name="recommenderAddress"
					placeholder="Home Address / Community"
					required={true}
				/>

				<TextAreaField
					control={form.control}
					name="childBackgroundNotes"
					label="Tells us a bit about this child's background, why he/she needs support"
					required={true}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="supportTypesNeeded"
					question="1. Types of Support Needed"
					options={TacotsSupportTypeOptions}
					required={true}
				/>

				<TextAreaField
					control={form.control}
					name="otherImportantInfo"
					label="Any Other Important Information About the Child or Their Current Circumstances"
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Character & Aspiration</h2>

				<RatingQuestionField
					control={form.control}
					name="disciplineRating"
					question="1. Level of Discipline"
					leftLabel="Poor"
					rightLabel="Excellent"
					required={true}
				/>

				<RatingQuestionField
					control={form.control}
					name="responsibilityRating"
					question="2. Sense of Responsibility"
					leftLabel="Poor"
					rightLabel="Excellent"
					required={true}
				/>

				<TextField
					control={form.control}
					name="careerGoal"
					placeholder="Career Goal / Interest"
					required={true}
				/>

				<TextAreaField control={form.control} name="studentStatement" label="Student's Statement" />
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<AgreementField
					control={form.control}
					name="declarationConfirmed"
					title="Declaration"
					label="I confirm that the information provided in this registration form is true and accurate."
				/>
			</section>
		</>
	);
}

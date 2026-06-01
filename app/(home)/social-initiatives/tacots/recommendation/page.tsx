"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
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
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, useFormRootContext } from "@/components/ui/form";
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

const TacotsRecommendationSchema = TacotsRecommendationFrontendSchema;

function RecommendationFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
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

type TacotsRecommendationFormStoreType = {
	currentStep: number;
	formStepData: z.infer<typeof TacotsRecommendationSchema>;
};

const useTacotsRecommendationStorageState = createUseStorageState<TacotsRecommendationFormStoreType>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			age: "",
			annualHouseholdIncome: "",
			avgMonthlyIncome: "",
			careerGoal: "",
			catholicSacraments: [],
			childBackgroundNotes: "",
			classPositionLastTerm: "",
			declarationConfirmed: false,
			diocese: "",
			disciplineRating: "",
			dob: "",
			familyPosition: "",
			fathersName: "",
			fathersOccupation: "",
			fathersPhone: "",
			firstName: "",
			gender: "",
			guardianAddress: "",
			guardianName: "",
			guardianOccupation: "",
			guardianPhone: "",
			guardianRelationship: "",
			hasElectricity: "",
			homeAddress: "",
			householdSize: "",
			incomeSources: [],
			lastClass: "",
			lastResult: null,
			lastTermAverage: "",
			lastYearAttended: "",
			lga: "",
			livesWith: "",
			middleName: "",
			mothersName: "",
			mothersOccupation: "",
			mothersPhone: "",
			nationality: "",
			numIncomeEarners: "",
			numSiblings: "",
			otherImportantInfo: "",
			parentsAddress: "",
			parishAttended: "",
			passportPhoto: null,
			phoneNumber: "",
			primaryLanguage: "",
			recommenderAddress: "",
			recommenderFirstName: "",
			recommenderLastName: "",
			recommenderPhone: "",
			religion: "",
			residenceType: "",
			responsibilityRating: "",
			schoolName: "",
			schoolState: "",
			schoolTown: "",
			specialCircumstances: "",
			stateOfOrigin: "",
			studentStatement: "",
			supportTypesNeeded: [],
			surname: "",
		} as unknown as TacotsRecommendationFormStoreType["formStepData"],
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
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[0]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Student Personal Information" />

			<TextField control={form.control} name="firstName" placeholder="First Name" />
			<TextField control={form.control} name="middleName" placeholder="Middle Name" />
			<TextField control={form.control} name="surname" placeholder="Surname" />

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit" }}
				name="age"
				placeholder="Age"
				options={TacotsAgeOptions}
			/>

			<DateField control={form.control} name="dob" placeholder="Date of Birth" />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={GenderOptions}
			/>

			<SelectField
				control={form.control}
				name="religion"
				placeholder="Religion/Denomination"
				options={TacotsRecommendationReligionOptions}
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
			/>

			<TextField
				control={form.control}
				name="phoneNumber"
				placeholder="Participant's Phone Number"
				type="tel"
			/>
			<TextField control={form.control} name="nationality" placeholder="Nationality" />

			<div className="flex gap-3">
				<ComboboxField
					control={form.control}
					name="stateOfOrigin"
					placeholder="State of Origin"
					options={NigeriaStateOptions}
				/>

				<Form.Watch control={form.control} name="stateOfOrigin">
					{(stateOfOrigin) => (
						<ComboboxField
							control={form.control}
							disabled={!stateOfOrigin}
							name="lga"
							placeholder="Local Government Area"
							options={getLgaOptions(stateOfOrigin)}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField control={form.control} name="homeAddress" placeholder="Home Address / Community" />
		</>
	);
}

function EducationalInformationStepTwo() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Educational Information" />

			<TextField
				control={form.control}
				name="schoolName"
				placeholder="Name of Current School or Last School Attended"
			/>

			<div className="flex flex-col gap-3">
				<TextField control={form.control} name="schoolTown" placeholder="Town/ City" />
				<SelectField
					control={form.control}
					name="schoolState"
					placeholder="State"
					options={NigeriaStateOptions}
				/>
			</div>

			<SelectField
				control={form.control}
				name="lastYearAttended"
				placeholder="Last Year Student Attended School"
				options={TacotsYearOptions}
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[380px]" }}
				name="lastClass"
				placeholder="Last Class"
				options={ClassOptions}
			/>

			<TextField
				control={form.control}
				name="classPositionLastTerm"
				placeholder="Position in Class at the Last Term"
				min={1}
				step={1}
				type="number"
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
			/>

			<FileUploadField
				control={form.control}
				name="lastResult"
				label="Upload a Picture of Last Result"
			/>
		</>
	);
}

function FamilyBackgroundStepThree() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[2]["validator"]>>();
	const form = { control };

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Family Background" />

				<TextField control={form.control} name="fathersName" placeholder="Father's Name" />
				<TextField control={form.control} name="fathersOccupation" placeholder="Father's Occupation" />
				<TextField
					control={form.control}
					name="fathersPhone"
					placeholder="Father's Phone Number"
					type="tel"
				/>
				<TextField control={form.control} name="mothersName" placeholder="Mother's Name" />
				<TextField control={form.control} name="mothersOccupation" placeholder="Mother's Occupation" />
				<TextField
					control={form.control}
					name="mothersPhone"
					placeholder="Mother's Phone Number"
					type="tel"
				/>
				<TextField control={form.control} name="parentsAddress" placeholder="Parent's Address" />
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
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="numSiblings"
					placeholder="Number of Siblings"
					options={SiblingsOptions}
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="familyPosition"
					placeholder="Child's Position in the Family"
					options={TacotsFamilyPositionOptions}
				/>

				<OptionQuestionField
					control={form.control}
					name="specialCircumstances"
					question="Special Circumstances"
					options={TacotsSpecialCircumstanceOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Family financials</h2>

				<OptionQuestionField
					control={form.control}
					name="annualHouseholdIncome"
					question="1. Annual Household Income"
					options={TacotsAnnualHouseholdIncomeOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="incomeSources"
					question="2. Source of Household Income"
					options={TacotsIncomeSourceOptions}
				/>

				<OptionQuestionField
					control={form.control}
					name="numIncomeEarners"
					question="3. Number of Income Earners in the Household"
					options={TacotsIncomeEarnerCountOptions}
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
				/>

				<OptionQuestionField
					control={form.control}
					name="residenceType"
					question="5. Type of Residence"
					options={TacotsResidenceTypeOptions}
				/>

				<OptionQuestionField
					control={form.control}
					name="hasElectricity"
					question="6. Does the household have access to electricity?"
					options={YesNoSometimesOptions}
				/>
			</section>
		</>
	);
}

function RecommenderDetailsStepFour() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[3]["validator"]>>();
	const form = { control };

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormStepComponentSectionHeader title="Recommender's Details" />

				<TextField control={form.control} name="recommenderFirstName" placeholder="First Name" />
				<TextField control={form.control} name="recommenderLastName" placeholder="Last Name" />
				<TextField
					control={form.control}
					name="recommenderPhone"
					placeholder="Phone Number"
					type="tel"
				/>
				<TextField
					control={form.control}
					name="recommenderAddress"
					placeholder="Home Address / Community"
				/>

				<TextAreaField
					control={form.control}
					name="childBackgroundNotes"
					label="Tells us a bit about this child's background, why he/she needs support"
				/>

				<CheckboxQuestionField
					control={form.control}
					name="supportTypesNeeded"
					question="1. Types of Support Needed"
					options={TacotsSupportTypeOptions}
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
				/>

				<RatingQuestionField
					control={form.control}
					name="responsibilityRating"
					question="2. Sense of Responsibility"
					leftLabel="Poor"
					rightLabel="Excellent"
				/>

				<TextField control={form.control} name="careerGoal" placeholder="Career Goal / Interest" />

				<TextAreaField control={form.control} name="studentStatement" label="Student's Statement" />
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Declaration</h2>

				<Form.Field
					control={form.control}
					name="declarationConfirmed"
					className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
				>
					<Form.FieldBoundController
						render={({ field }) => (
							<Checkbox
								id="declaration-confirmed"
								checked={field.value}
								onCheckedChange={field.onChange}
								classNames={{
									base: `mt-[2px] size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
									bg-transparent data-checked:bg-transparent lg:mt-[3px]`,
									icon: "size-3",
								}}
							/>
						)}
					/>

					<Form.Label htmlFor="declaration-confirmed">
						I confirm that the information provided in this registration form is true and accurate.
					</Form.Label>
				</Form.Field>
			</section>
		</>
	);
}

"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
	CheckboxQuestionField,
	ComboboxField,
	DateField,
	FileUploadField,
	OptionQuestionField,
	RatingQuestionField,
	SelectField,
	StepperList,
	TextAreaField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getNigeriaStatesAndLGA } from "@/lib/constants/nigeria";
import { cnJoin } from "@/lib/utils/cn";

const tacotsRecommendationFrontendSchema = z.object({
	age: z.string(),
	annualHouseholdIncome: z.string(),
	avgMonthlyIncome: z.string(),
	careerGoal: z.string(),
	catholicSacraments: z.array(z.string()),
	childBackgroundNotes: z.string(),
	classPositionLastTerm: z.string(),
	declarationConfirmed: z.boolean(),
	diocese: z.string(),
	disciplineRating: z.string(),
	dob: z.string(),
	familyPosition: z.string(),
	fathersName: z.string(),
	fathersOccupation: z.string(),
	fathersPhone: z.string(),
	firstName: z.string(),
	gender: z.string(),
	guardianAddress: z.string(),
	guardianName: z.string(),
	guardianOccupation: z.string(),
	guardianPhone: z.string(),
	guardianRelationship: z.string(),
	hasElectricity: z.string(),
	homeAddress: z.string(),
	householdSize: z.string(),
	incomeSources: z.array(z.string()),
	lastClass: z.string(),
	lastResult: z.custom<File>().nullable(),
	lastTermAverage: z.string(),
	lastYearAttended: z.string(),
	lga: z.string(),
	livesWith: z.string(),
	middleName: z.string(),
	mothersName: z.string(),
	mothersOccupation: z.string(),
	mothersPhone: z.string(),
	nationality: z.string(),
	numIncomeEarners: z.string(),
	numSiblings: z.string(),
	otherImportantInfo: z.string(),
	parentsAddress: z.string(),
	parishAttended: z.string(),
	passportPhoto: z.custom<File>().nullable(),
	phoneNumber: z.string(),
	primaryLanguage: z.string(),
	recommenderAddress: z.string(),
	recommenderFirstName: z.string(),
	recommenderLastName: z.string(),
	recommenderPhone: z.string(),
	religion: z.string(),
	residenceType: z.string(),
	responsibilityRating: z.string(),
	schoolName: z.string(),
	schoolState: z.string(),
	schoolTown: z.string(),
	specialCircumstances: z.array(z.string()),
	stateOfOrigin: z.string(),
	studentStatement: z.string(),
	supportTypesNeeded: z.array(z.string()),
	surname: z.string(),
});

function RecommendationFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<TacotsRecommendationForm />
		</Main>
	);
}

export default RecommendationFormPage;

function FormHeaderSection() {
	return (
		<header
			className="flex w-full items-center gap-5 rounded-[12px] bg-cedar-black p-3 text-cedar-white
				lg:rounded-[20px] lg:p-5"
		>
			<Button asChild={true} theme="secondary" size="icon" className="shrink-0">
				<NavLink href="/social-initiatives/tacots">
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">
				TACOTS Recommendation Form
			</h1>
		</header>
	);
}

const stepperItems = defineEnumDeep([
	{
		StepComponent: StudentPersonalInformationStep,
		title: "Student personal information",
	},
	{
		StepComponent: EducationalInformationStep,
		title: "Educational information",
	},
	{
		StepComponent: FamilyBackgroundStep,
		title: "Family background",
	},
	{
		StepComponent: RecommenderDetailsStep,
		title: "Recommender details",
	},
]);

function TacotsRecommendationForm() {
	const form = useForm({
		defaultValues: {
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
			specialCircumstances: [],
			stateOfOrigin: "",
			studentStatement: "",
			supportTypesNeeded: [],
			surname: "",
		},
		resolver: zodResolver(tacotsRecommendationFrontendSchema),
	});

	const onSubmit = form.handleSubmit(() => {});

	return (
		<Form.Root
			form={form}
			className="w-full lg:max-w-[590px]"
			onSubmit={(event) => void onSubmit(event)}
		>
			<Steps.Root
				count={stepperItems.length - 1}
				linear={true}
				className="flex flex-col gap-10 lg:gap-12"
			>
				<StepperList items={stepperItems} />

				<For
					each={stepperItems}
					renderItem={(step, index) => (
						<Steps.Content key={step.title} index={index}>
							<step.StepComponent form={form} />
						</Steps.Content>
					)}
				/>

				<Steps.Context>
					{(steps) => {
						return (
							<div
								className={cnJoin(
									"flex",
									!steps.hasPrevStep ? "justify-end" : "justify-between gap-3"
								)}
							>
								{steps.hasPrevStep && (
									<Steps.PrevTrigger asChild={true}>
										<Button type="button" className="h-12 px-[64px] text-[12px]">
											Back
										</Button>
									</Steps.PrevTrigger>
								)}
								{steps.hasNextStep && (
									<Steps.NextTrigger asChild={true}>
										<Button type="button" className="h-12 px-[64px] text-[12px]">
											Next
										</Button>
									</Steps.NextTrigger>
								)}
								{steps.isCompleted && (
									<Form.Submit asChild={true}>
										<Button type="button" className="h-12 px-[64px] text-[12px]">
											Submit
										</Button>
									</Form.Submit>
								)}
							</div>
						);
					}}
				</Steps.Context>
			</Steps.Root>
		</Form.Root>
	);
}

function FormSectionHeader(props: { title: string }) {
	const { title } = props;

	return (
		<header className="flex items-center justify-between gap-6">
			<h2 className="shrink-0 leading-[1.2] lg:text-[24px]">{title}</h2>
			<p className="text-[8px]/3 text-cedar-black/64 max-lg:max-w-[132px] lg:text-[12px]/4">
				*Please fill information correctly according to field tag
			</p>
		</header>
	);
}

type StepProps = {
	form: UseFormReturn<z.infer<typeof tacotsRecommendationFrontendSchema>>;
};

function StudentPersonalInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="Student Personal Information" />

			<TextField control={form.control} name="firstName" placeholder="First Name" />
			<TextField control={form.control} name="middleName" placeholder="Middle Name" />
			<TextField control={form.control} name="surname" placeholder="Surname" />

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit" }}
				name="age"
				placeholder="Age"
				options={ageOptions}
			/>

			<DateField control={form.control} name="dob" placeholder="Date of Birth" />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={["Male", "Female"]}
			/>

			<SelectField
				control={form.control}
				name="religion"
				placeholder="Religion/Denomination"
				options={religionOptions}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="catholicSacraments"
				question="If Catholic - Sacraments Received"
				options={["Baptism", "First Holy Communion", "Confirmation", "None yet"]}
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
				options={languageOptions}
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
					classNames={{ trigger: "w-full px-4 lg:px-9" }}
					placeholder="State of Origin"
					options={stateOptions}
					type="state of origin"
					onValueChange={() => form.setValue("lga", "")}
				/>

				<Form.Watch control={form.control} name="stateOfOrigin">
					{(stateOfOrigin) => (
						<ComboboxField
							control={form.control}
							classNames={{ trigger: "w-full px-4 lg:px-9" }}
							name="lga"
							placeholder="Local Government Area"
							options={getLgaOptions(stateOfOrigin)}
							type="local government area"
							disabled={!stateOfOrigin}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField control={form.control} name="homeAddress" placeholder="Home Address / Community" />
		</section>
	);
}

function EducationalInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="Educational Information" />

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
					options={stateOptions}
				/>
			</div>

			<SelectField
				control={form.control}
				name="lastYearAttended"
				placeholder="Last Year Student Attended School"
				options={yearOptions}
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[380px]" }}
				name="lastClass"
				placeholder="Last Class"
				options={classOptions}
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
		</section>
	);
}

function FamilyBackgroundStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Family Background" />

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
					options={relationshipOptions}
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
					options={householdSizeOptions}
				/>
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[380px]" }}
					name="numSiblings"
					placeholder="Number of Siblings"
					options={siblingsOptions}
				/>
				<TextField
					control={form.control}
					name="familyPosition"
					placeholder="Child's Position in the Family (eg: 1st, 2nd, 5th..)"
				/>

				<CheckboxQuestionField
					control={form.control}
					name="specialCircumstances"
					question="Special Circumstances"
					options={["Orphan", "Single Parent", "Low Family Income", "None", "Other: _____"]}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Family financials</h2>

				<OptionQuestionField
					control={form.control}
					name="annualHouseholdIncome"
					question="1. Annual Household Income"
					options={incomeOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="incomeSources"
					question="2. Source of Household Income"
					options={incomeSourceOptions}
				/>

				<OptionQuestionField
					control={form.control}
					name="numIncomeEarners"
					question="3. Number of Income Earners in the Household"
					options={["None", "1", "2", "3", "More than 3"]}
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
					options={[
						"Both parents",
						"Mother only",
						"Father only",
						"Grand parent",
						"Other Relative",
						"Guardian",
						"Alone",
					]}
				/>

				<OptionQuestionField
					control={form.control}
					name="residenceType"
					question="5. Type of Residence"
					options={[
						"Family House",
						"Rented Apartment",
						"Shared Accommodation",
						"Temporary Shelter",
						"Other",
					]}
				/>

				<OptionQuestionField
					control={form.control}
					name="hasElectricity"
					question="6. Does the household have access to electricity?"
					options={["Yes", "No", "Sometimes"]}
				/>
			</section>
		</div>
	);
}

function RecommenderDetailsStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Recommender's Details" />

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
					options={["Tuition (School Fees)", "School Resources", "Transportation", "Other:"]}
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

				<CheckboxQuestionField
					control={form.control}
					name="declarationConfirmed"
					options={[
						"I confirm that the information provided in this registration form is true and accurate.",
					]}
				/>
			</section>
		</div>
	);
}

const ageOptions = [...Array(16).keys()].map((age) => `${age + 1}`);
const currentYear = new Date().getFullYear();
const yearOptions = [...Array(26).keys()].map((year) => `${currentYear - year}`);

const religionOptions = ["Catholic", "Anglican", "Pentecostal", "Muslim", "Traditional", "Other"];
const languageOptions = ["Igbo", "English", "Hausa", "Yoruba", "Pidgin", "Other"];

const nigeriaStatesAndLGA = getNigeriaStatesAndLGA();

const stateOptions = nigeriaStatesAndLGA.map(({ state }) => state);

function getLgaOptions(state: string) {
	return nigeriaStatesAndLGA.find((item) => item.state === state)?.lgas ?? [];
}

const classOptions = [
	"Primary 1",
	"Primary 2",
	"Primary 3",
	"Primary 4",
	"Primary 5",
	"Primary 6",
	"JSS 1",
	"JSS 2",
	"JSS 3",
	"SS 1",
	"SS 2",
	"SS 3",
];

const relationshipOptions = ["Father", "Mother", "Guardian", "Relative", "Other"];
const householdSizeOptions = ["1 - 3", "4 - 6", "7 - 9", "10+"];
const siblingsOptions = ["None", "1", "2", "3", "4", "5+"];

const incomeOptions = [
	"No stable income",
	"Less than ₦100,000",
	"₦100,000 - ₦300,000",
	"₦300,001 - ₦600,000",
	"₦600,001 - ₦1,000,000",
	"Above ₦1,000,000",
];

const incomeSourceOptions = [
	"Farming",
	"Trading / Small Business",
	"Salary / Formal Employment",
	"Artisan / Skilled Labour",
	"Daily Wage Work",
	"Support from relative",
	"Government support",
	"No regular income",
	"Other: _________",
];


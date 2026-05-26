"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
	CheckboxQuestionField,
	DateField,
	FileUploadField,
	OptionQuestionField,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { getNigeriaStatesAndLGA } from "@/lib/constants/nigeria";
import { cnJoin } from "@/lib/utils/cn";

const healthConcernOptions = [
	"Learning difficulty",
	"Vision impairment",
	"Hearing impairment",
	"Attention difficulty",
	"Physical disability",
	"Other",
];

const learningConditionOptions = ["Yes", "No", "Not Sure"];

const programAgreementText = `By checking the box
I agree to:
the use of these images, recordings, and provided information by the organizers and
their authorized representatives for communication, educational, promotional,
reporting, and evaluation purposes, including on websites, social media, and print
materials.
I understand that all personal data will be handled confidentially and used responsibly.`;

const declarationText =
	"I confirm that the information provided in this registration form is true and accurate.";

const consentAgreementText =
	"I hereby grant consent for my child to participate in the program and all related activities. I understand that they may be photographed or recorded during the program.";

const ashRegisterFormSchema = z.object({
	age: z.string(),
	averageHouseholdIncomePerYear: z.string(),
	classLevel: z.string(),
	conditionAffectsLearning: z.string(),
	currentPassportPhotograph: z.custom<File>().nullable(),
	dateOfBirth: z.string(),
	declarationConfirmed: z.boolean(),
	fatherName: z.string(),
	fatherOccupation: z.string(),
	fatherPhoneNumber: z.string(),
	gender: z.string(),
	guardianName: z.string(),
	guardianOccupation: z.string(),
	guardianPhoneNumber: z.string(),
	guardianRelationship: z.string(),
	healthConcerns: z.array(z.boolean()),
	homeAddress: z.string(),
	lastResultPicture: z.custom<File>().nullable(),
	lastTermClassPosition: z.string(),
	mentorName: z.string(),
	motherName: z.string(),
	motherOccupation: z.string(),
	motherPhoneNumber: z.string(),
	parentSignatureAndName: z.custom<File>().nullable(),
	phoneNumber: z.string(),
	pretestScore: z.string(),
	previousAfterSchoolProgram: z.string(),
	primaryLanguage: z.string(),
	programAgreementAccepted: z.boolean(),
	reasonForJoining: z.string(),
	schoolLocalGovernmentArea: z.string(),
	schoolName: z.string(),
	schoolState: z.string(),
	schoolTown: z.string(),
	studentFirstName: z.string(),
	studentMiddleName: z.string(),
	studentSurname: z.string(),
});

function RegisterFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<AshRegisterForm />
		</Main>
	);
}

export default RegisterFormPage;

function FormHeaderSection() {
	return (
		<header
			className="flex w-full items-center gap-5 rounded-[12px] bg-cedar-black p-2 text-cedar-white
				lg:rounded-[20px] lg:p-5"
		>
			<Button asChild={true} theme="secondary" size="icon" className="shrink-0">
				<NavLink href="/social-initiatives/ash">
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">
				ASH Student Registration Form
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
		StepComponent: SchoolInformationStep,
		title: "School information",
	},
	{
		StepComponent: ParentGuardianInformationStep,
		title: "Parent / guardian information",
	},
	{
		StepComponent: WellbeingConsentStep,
		title: "Wellbeing and consent",
	},
]);

function AshRegisterForm() {
	const form = useForm({
		defaultValues: {
			age: "",
			averageHouseholdIncomePerYear: "",
			classLevel: "",
			conditionAffectsLearning: "",
			currentPassportPhotograph: null,
			dateOfBirth: "",
			declarationConfirmed: false,
			fatherName: "",
			fatherOccupation: "",
			fatherPhoneNumber: "",
			gender: "",
			guardianName: "",
			guardianOccupation: "",
			guardianPhoneNumber: "",
			guardianRelationship: "",
			healthConcerns: healthConcernOptions.map(() => false),
			homeAddress: "",
			lastResultPicture: null,
			lastTermClassPosition: "",
			mentorName: "",
			motherName: "",
			motherOccupation: "",
			motherPhoneNumber: "",
			parentSignatureAndName: null,
			phoneNumber: "",
			pretestScore: "",
			previousAfterSchoolProgram: "",
			primaryLanguage: "",
			programAgreementAccepted: false,
			reasonForJoining: "",
			schoolLocalGovernmentArea: "",
			schoolName: "",
			schoolState: "",
			schoolTown: "",
			studentFirstName: "",
			studentMiddleName: "",
			studentSurname: "",
		},
		resolver: zodResolver(ashRegisterFormSchema),
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

				<FormStepFooter />
			</Steps.Root>
		</Form.Root>
	);
}

function FormStepFooter() {
	return (
		<Steps.Context>
			{(steps) => (
				<div className={cnJoin("flex", !steps.hasPrevStep ? "justify-end" : "justify-between gap-3")}>
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
			)}
		</Steps.Context>
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
	form: UseFormReturn<z.infer<typeof ashRegisterFormSchema>>;
};

function StudentPersonalInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="Student Personal Information" />

			<TextField control={form.control} name="studentFirstName" placeholder="First Name" />
			<TextField control={form.control} name="studentMiddleName" placeholder="Middle Name" />
			<TextField control={form.control} name="studentSurname" placeholder="Surname" />

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit min-w-[116px]" }}
				name="age"
				placeholder="Age"
				options={ageOptions}
			/>

			<DateField control={form.control} name="dateOfBirth" placeholder="Date of Birth" />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={["Male", "Female"]}
			/>

			<SelectField
				control={form.control}
				name="primaryLanguage"
				placeholder="Primary Language Spoken at home"
				options={languageOptions}
			/>

			<TextField control={form.control} name="homeAddress" placeholder="Home Address" />
			<TextField control={form.control} name="phoneNumber" placeholder="Phone Number" type="tel" />
			<FileUploadField
				control={form.control}
				name="currentPassportPhotograph"
				label="Upload Student Passport Photograph"
			/>
		</section>
	);
}

function SchoolInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="School Information" />

			<TextField control={form.control} name="schoolName" placeholder="Name of Current School" />

			<SelectField
				control={form.control}
				name="schoolState"
				placeholder="State"
				options={stateOptions}
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<TextField control={form.control} name="schoolTown" placeholder="Town" />

				<Form.Watch control={form.control} name="schoolState">
					{(schoolState) => (
						<SelectField
							control={form.control}
							classNames={{ trigger: "w-full px-4 lg:px-9" }}
							name="schoolLocalGovernmentArea"
							placeholder="Local Government Area"
							options={getLocalGovernmentAreaOptions(schoolState)}
						/>
					)}
				</Form.Watch>
			</div>

			<SelectField
				control={form.control}
				name="classLevel"
				placeholder="Current Class"
				options={classOptions}
			/>

			<TextField
				control={form.control}
				name="lastTermClassPosition"
				placeholder="Position in Class (Last Term)"
				min={1}
				step={1}
				type="number"
			/>

			<FileUploadField
				control={form.control}
				name="lastResultPicture"
				label="Upload Last School Result"
			/>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Program Participation</h2>

				<OptionQuestionField
					control={form.control}
					name="previousAfterSchoolProgram"
					question="Has the student previously participated in an after-school program?"
					options={["Yes", "No"]}
				/>

				<TextAreaField
					control={form.control}
					name="reasonForJoining"
					label="Why does the student want to join the ASH program?"
				/>
			</section>
		</section>
	);
}

function ParentGuardianInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="Parent / Guardian Information" />

			<TextField control={form.control} name="fatherName" placeholder="Father's Name" />
			<TextField
				control={form.control}
				name="fatherPhoneNumber"
				placeholder="Father's Phone Number"
				type="tel"
			/>
			<TextField control={form.control} name="fatherOccupation" placeholder="Father's Occupation" />
			<TextField control={form.control} name="motherName" placeholder="Mother's Name" />
			<TextField
				control={form.control}
				name="motherPhoneNumber"
				placeholder="Mother's Phone Number"
				type="tel"
			/>
			<TextField control={form.control} name="motherOccupation" placeholder="Mother's Occupation" />
			<TextField
				control={form.control}
				name="guardianName"
				placeholder="Guardian Name ( If Applicable)"
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
				name="guardianPhoneNumber"
				placeholder="Guardian Phone Number"
				type="tel"
			/>
			<TextField control={form.control} name="guardianOccupation" placeholder="Guardian Occupation" />
			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[390px]" }}
				name="averageHouseholdIncomePerYear"
				placeholder="Average Household Income Per Year"
				options={householdIncomeOptions}
			/>
		</section>
	);
}

function WellbeingConsentStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Student Well-Being (Brief Health Indicator)</h2>

				<OptionQuestionField
					control={form.control}
					name="conditionAffectsLearning"
					question="Does the student have any condition that may affect learning?"
					options={learningConditionOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="healthConcerns"
					question="If yes, specify"
					options={healthConcernOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Consent & Program Agreement</h2>

				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">{consentAgreementText}</p>

				<Form.Field
					control={form.control}
					name="programAgreementAccepted"
					className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
				>
					<Form.FieldBoundController
						render={({ field }) => (
							<Checkbox
								id="program-agreement-accepted"
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

					<Form.Label htmlFor="program-agreement-accepted" className="whitespace-pre-line">
						{programAgreementText}
					</Form.Label>
				</Form.Field>
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

					<Form.Label htmlFor="declaration-confirmed">{declarationText}</Form.Label>
				</Form.Field>

				<FileUploadField
					control={form.control}
					name="parentSignatureAndName"
					label="Upload a copy of parents signature and name"
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Official Use</h2>

				<TextField control={form.control} name="mentorName" placeholder="Mentor's Name" />
				<TextField
					control={form.control}
					name="pretestScore"
					placeholder="Pretest score"
					min={0}
					step={1}
					type="number"
				/>
			</section>
		</section>
	);
}

const ageOptions = [...Array(11).keys()].map((index) => `${index + 8}`);

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
const languageOptions = ["Igbo", "English", "Hausa", "Yoruba", "Pidgin", "Other"];

const householdIncomeOptions = [
	"No stable income",
	"Less than ₦100,000",
	"₦100,000 - ₦300,000",
	"₦300,001 - ₦600,000",
	"₦600,001 - ₦1,000,000",
	"Above ₦1,000,000",
];

const nigeriaStatesAndLGA = getNigeriaStatesAndLGA();
const stateOptions = nigeriaStatesAndLGA.map(({ state }) => state);

function getLocalGovernmentAreaOptions(state: string) {
	return nigeriaStatesAndLGA.find((stateItem) => stateItem.state === state)?.lgas ?? [];
}

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
import { Form } from "@/components/ui/form";
import { getNigeriaStatesAndLGA } from "@/lib/constants/nigeria";
import { cnJoin } from "@/lib/utils/cn";

const volunteerRegisterFrontendSchema = z.object({
	additionalInfo: z.string(),
	age: z.string(),
	ashAcademicArea: z.array(z.boolean()),
	ashExtracurricular: z.array(z.boolean()),
	ashSaturdayAvailability: z.array(z.boolean()),
	availability: z.array(z.boolean()),
	city: z.string(),
	commitmentDuration: z.array(z.boolean()),
	dob: z.string(),
	emailAddress: z.string(),
	firstName: z.string(),
	gender: z.string(),
	highestEducation: z.string(),
	homeAddress: z.string(),
	mediaConsent: z.array(z.boolean()),
	middleName: z.string(),
	occupation: z.string(),
	phoneNumber: z.string(),
	reasonForVolunteering: z.string(),
	registrationDate: z.string(),
	safeguardingAgreement: z.array(z.boolean()),
	skillsToContribute: z.array(z.boolean()),
	state: z.string(),
	surname: z.string(),
	volunteerAreas: z.array(z.boolean()),
});

function VolunteerRegisterPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<VolunteerRegisterForm />
		</Main>
	);
}

export default VolunteerRegisterPage;

function FormHeaderSection() {
	return (
		<header
			className="flex w-full items-center gap-5 rounded-[12px] bg-cedar-black p-3 text-cedar-white
				lg:rounded-[20px] lg:p-5"
		>
			<Button asChild={true} theme="secondary" size="icon" className="shrink-0">
				<NavLink href="/get-involved/volunteer">
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">Volunteer Form</h1>
		</header>
	);
}

const stepperItems = defineEnumDeep([
	{
		StepComponent: VolunteerInformationStep,
		title: "Volunteer information",
	},
	{
		StepComponent: VolunteerInterestStep,
		title: "Volunteer interest",
	},
]);

function VolunteerRegisterForm() {
	const form = useForm({
		defaultValues: {
			additionalInfo: "",
			age: "",
			ashAcademicArea: ashAcademicAreaOptions.map(() => false),
			ashExtracurricular: ashExtracurricularOptions.map(() => false),
			ashSaturdayAvailability: ashAvailabilityOptions.map(() => false),
			availability: availabilityOptions.map(() => false),
			city: "",
			commitmentDuration: commitmentDurationOptions.map(() => false),
			dob: "",
			emailAddress: "",
			firstName: "",
			gender: "",
			highestEducation: "",
			homeAddress: "",
			mediaConsent: mediaConsentOptions.map(() => false),
			middleName: "",
			occupation: "",
			phoneNumber: "",
			reasonForVolunteering: "",
			registrationDate: "",
			safeguardingAgreement: yesNoOptions.map(() => false),
			skillsToContribute: skillOptions.map(() => false),
			state: "",
			surname: "",
			volunteerAreas: volunteerAreaOptions.map(() => false),
		},
		resolver: zodResolver(volunteerRegisterFrontendSchema),
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
	form: UseFormReturn<z.infer<typeof volunteerRegisterFrontendSchema>>;
};

function VolunteerInformationStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<FormSectionHeader title="Volunteer Information" />

			<TextField control={form.control} name="firstName" placeholder="First Name" />
			<TextField control={form.control} name="middleName" placeholder="Middle Name" />
			<TextField control={form.control} name="surname" placeholder="Surname" />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={["Male", "Female"]}
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit min-w-[100px]" }}
				name="age"
				placeholder="Age"
				options={ageOptions}
			/>

			<DateField control={form.control} name="dob" placeholder="Date of Birth" />
			<TextField control={form.control} name="phoneNumber" placeholder="Phone Number" type="tel" />
			<TextField control={form.control} name="emailAddress" placeholder="Email Address" type="email" />
			<TextField control={form.control} name="homeAddress" placeholder="Home address" />

			<div className="flex gap-3 lg:gap-5 [&>div]:max-w-none">
				<ComboboxField
					control={form.control}
					classNames={{ trigger: "w-full px-4 lg:px-9" }}
					name="state"
					placeholder="State"
					options={stateOptions}
					type="state"
					onValueChange={() => form.setValue("city", "")}
				/>

				<Form.Watch control={form.control} name="state">
					{(state) => (
						<ComboboxField
							control={form.control}
							classNames={{ trigger: "w-full px-4 lg:px-9" }}
							name="city"
							placeholder="City"
							options={getCityOptions(state)}
							type="city"
							disabled={!state}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField control={form.control} name="occupation" placeholder="Occupation / Profession" />
			<SelectField
				control={form.control}
				name="highestEducation"
				placeholder="Highest Level of Education"
				options={educationLevelOptions}
			/>
		</section>
	);
}

function VolunteerInterestStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Interest</h2>

				<TextAreaField
					control={form.control}
					name="reasonForVolunteering"
					label="Why would you like to volunteer with CedarRise?"
				/>

				<CheckboxQuestionField
					control={form.control}
					name="volunteerAreas"
					question="1. Areas you would like to volunteer in"
					options={volunteerAreaOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="skillsToContribute"
					question="2. Skills you can contribute"
					options={skillOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">General Availability</h2>

				<CheckboxQuestionField
					control={form.control}
					name="availability"
					question="1. When are you generally available to volunteer?"
					options={availabilityOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="commitmentDuration"
					question="2. How long can you commit to volunteering?"
					options={commitmentDurationOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<header className="flex flex-wrap items-end gap-x-8 gap-y-1">
					<h2 className="leading-[1.2] lg:text-[24px]">ASH Volunteer Section</h2>
					<p className="text-[8px]/3 text-cedar-black/64 lg:text-[12px]/4">
						(Complete this section only if you selected ASH above)
					</p>
				</header>

				<CheckboxQuestionField
					control={form.control}
					name="ashSaturdayAvailability"
					question="1. Availability for ASH Saturday Sessions"
					options={ashAvailabilityOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="ashAcademicArea"
					question="2. Academic area you would like to teach"
					options={ashAcademicAreaOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="ashExtracurricular"
					question="3. Extracurricular activities you would like to support"
					options={ashExtracurricularOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Commitment</h2>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">Policy Statement</p>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
					CedarRise Initiative for Human Development is committed to providing a safe, respectful, and
					protective environment for all children and vulnerable individuals engaged in its programs.
					We uphold a zero-tolerance approach to abuse, exploitation, neglect, and any form of harm.
				</p>

				<CheckboxQuestionField
					control={form.control}
					name="safeguardingAgreement"
					question="Do you agree to follow CedarRise volunteer guidelines and safeguarding policies?"
					options={yesNoOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Media Consent</h2>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
					I commit to volunteer actively in any programme I have signed up. I hereby grant the
					organizers and their authorized representatives permission to use information, photographs
					and videos that may be captured of me during the program.
				</p>

				<CheckboxQuestionField
					control={form.control}
					name="mediaConsent"
					question="By checking the box"
					options={mediaConsentOptions}
				/>
			</section>
		</section>
	);
}

const ageOptions = Array.from({ length: 83 }, (_, index) => `${index + 18}`);
const nigeriaStatesAndLGA = getNigeriaStatesAndLGA();
const stateOptions = nigeriaStatesAndLGA.map(({ state }) => state);

function getCityOptions(state: string) {
	return nigeriaStatesAndLGA.find((stateItem) => stateItem.state === state)?.lgas ?? [];
}

const educationLevelOptions = [
	"Secondary School",
	"OND / NCE",
	"Bachelor's Degree",
	"Postgraduate Degree",
	"Other",
];

const volunteerAreaOptions = [
	"ASH - Academic Support for Holistic Development",
	"TACOTS Scholarship Program",
	"Capacity Building Programs",
	"Cedar Outreaches (Community Programs)",
	"Administrative support for CedarRise",
];

const skillOptions = [
	"Teaching / tutoring",
	"Mentoring youth",
	"Public speaking",
	"Creative arts",
	"Digital / ICT skills",
	"Writing / communication",
	"Project coordination",
	"Community mobilization",
	"Administration support",
	"Graphics design",
	"Photography and Videography",
	"Social media management",
	"Data management",
	"Other",
];

const availabilityOptions = ["Weekdays", "Weekends", "Occasional events", "Flexible / when needed"];
const commitmentDurationOptions = ["3 months", "6 months", "1 year", "More than 1 year"];
const ashAvailabilityOptions = [
	"Every Saturday",
	"Two Saturdays a month",
	"One Saturday a month",
	"Occasionally when available",
];
const ashAcademicAreaOptions = [
	"Literacy (Reading & Writing)",
	"Numeracy (Mathematics)",
	"Both Literacy and Numeracy",
];
const ashExtracurricularOptions = [
	"Drama / theatre",
	"Music / singing",
	"Dance",
	"Public speaking / debate",
	"Creative writing",
	"Sports / games",
	"Digital skills / ICT",
	"Arts and crafts",
];
const yesNoOptions = ["Yes", "No"];
const mediaConsentOptions = [
	"Usage: These materials may be used for promotional, educational, reporting and evaluation purposes on websites, social media platforms, and in digital or printed publications.",
];


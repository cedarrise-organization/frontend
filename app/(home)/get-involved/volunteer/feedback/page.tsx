"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
	CheckboxQuestionField,
	DateField,
	RatingQuestionField,
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
import { cnJoin } from "@/lib/utils/cn";

const volunteerFeedbackFrontendSchema = z.object({
	activitiesInvolvedIn: z.array(z.boolean()),
	additionalComments: z.string(),
	challengesExperienced: z.string(),
	continueVolunteering: z.array(z.boolean()),
	enjoyedMost: z.string(),
	firstName: z.string(),
	improvementSuggestions: z.string(),
	organizationRating: z.string(),
	overallExperienceRating: z.string(),
	programMadeImpact: z.array(z.boolean()),
	programVolunteered: z.array(z.boolean()),
	roleClarityRating: z.string(),
	skillsDeveloped: z.array(z.boolean()),
	skillsGained: z.array(z.boolean()),
	submissionDate: z.string(),
	surname: z.string(),
	teamSupportRating: z.string(),
	volunteerDuration: z.array(z.boolean()),
	waysProgramHelped: z.array(z.boolean()),
	wouldRecommend: z.array(z.boolean()),
});

function VolunteerFeedbackPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<VolunteerFeedbackForm />
		</Main>
	);
}

export default VolunteerFeedbackPage;

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

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">Volunteer Feedback Form</h1>
		</header>
	);
}

const stepperItems = defineEnumDeep([
	{
		StepComponent: VolunteerExperienceStep,
		title: "Volunteer experience",
	},
	{
		StepComponent: VolunteerImpactStep,
		title: "Volunteer information",
	},
	{
		StepComponent: SuggestionsImprovementStep,
		title: "Suggestions and improvement",
	},
]);

function VolunteerFeedbackForm() {
	const form = useForm({
		defaultValues: {
			activitiesInvolvedIn: activityOptions.map(() => false),
			additionalComments: "",
			challengesExperienced: "",
			continueVolunteering: yesMaybeNoOptions.map(() => false),
			enjoyedMost: "",
			firstName: "",
			improvementSuggestions: "",
			organizationRating: "",
			overallExperienceRating: "",
			programMadeImpact: programImpactOptions.map(() => false),
			programVolunteered: programVolunteeredWithOptions.map(() => false),
			roleClarityRating: "",
			skillsDeveloped: skillDevelopmentOptions.map(() => false),
			skillsGained: skillsGainedOptions.map(() => false),
			submissionDate: "",
			surname: "",
			teamSupportRating: "",
			volunteerDuration: volunteerDurationOptions.map(() => false),
			waysProgramHelped: beneficiaryHelpOptions.map(() => false),
			wouldRecommend: yesMaybeNoOptions.map(() => false),
		},
		resolver: zodResolver(volunteerFeedbackFrontendSchema),
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
	form: UseFormReturn<z.infer<typeof volunteerFeedbackFrontendSchema>>;
};

function VolunteerExperienceStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Volunteer Information" />

				<TextField control={form.control} name="firstName" placeholder="First Name" />
				<TextField control={form.control} name="surname" placeholder="Surname" />

				<CheckboxQuestionField
					control={form.control}
					name="programVolunteered"
					question="1. Program you volunteered with"
					options={programVolunteeredWithOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="volunteerDuration"
					question="3. How long have you volunteered with CedarRise?"
					options={volunteerDurationOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Experience</h2>

				<RatingQuestionField
					control={form.control}
					name="overallExperienceRating"
					question="1. My volunteering experience with CedarRise has been positive."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={form.control}
					name="roleClarityRating"
					question="2. I clearly understood my role as a volunteer"
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={form.control}
					name="teamSupportRating"
					question="3. I felt supported by the CedarRise team."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={form.control}
					name="organizationRating"
					question="4. The volunteer activities were well organized."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>
			</section>
		</section>
	);
}

function VolunteerImpactStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Volunteer Information" />

				<CheckboxQuestionField
					control={form.control}
					name="programMadeImpact"
					question="1. Do you believe the program you supported made a positive impact?"
					options={programImpactOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="waysProgramHelped"
					question="2. In what ways do you think the program helped beneficiaries?"
					options={beneficiaryHelpOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Engagement</h2>

				<CheckboxQuestionField
					control={form.control}
					name="activitiesInvolvedIn"
					question="1. What activities were you mainly involved in?"
					options={activityOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="skillsDeveloped"
					question="2. Did volunteering with CedarRise help you develop new skills?"
					options={skillDevelopmentOptions}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="skillsGained"
					question="3. If yes, what skills did you gain?"
					options={skillsGainedOptions}
				/>
			</section>
		</section>
	);
}

function SuggestionsImprovementStep(props: StepProps) {
	const { form } = props;

	return (
		<section className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Suggestions and Improvement" />

				<TextAreaField
					control={form.control}
					name="enjoyedMost"
					label="What did you enjoy most about volunteering with CedarRise?"
				/>
				<TextAreaField
					control={form.control}
					name="challengesExperienced"
					label="What challenges did you experience while volunteering?"
				/>
				<TextAreaField
					control={form.control}
					name="improvementSuggestions"
					label="What improvements would you suggest for the volunteer program?"
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Future Engagement</h2>

				<CheckboxQuestionField
					control={form.control}
					name="continueVolunteering"
					question="1. Would you like to continue volunteering with CedarRise?"
					options={yesMaybeNoOptions}
				/>
				<CheckboxQuestionField
					control={form.control}
					name="wouldRecommend"
					question="2. Would you recommend volunteering with CedarRise to others?"
					options={yesMaybeNoOptions}
				/>
				<TextAreaField
					control={form.control}
					name="additionalComments"
					label="Any additional comments or feedback"
				/>
				<DateField control={form.control} name="submissionDate" placeholder="Date" />
			</section>
		</section>
	);
}

const programVolunteeredWithOptions = [
	"ASH - Academic Support for Holistic Development",
	"TACOTS Scholarship Program",
	"Capacity Building Programs",
	"Cedar Outreaches",
];

const volunteerDurationOptions = [
	"Less than 3 months",
	"3 - 6 months",
	"6 months - 1 year",
	"More than 1 year",
];

const programImpactOptions = ["Yes - very strong impact", "Yes - some impact", "Not sure", "No"];
const beneficiaryHelpOptions = [
	"Improved academic support",
	"Increased student confidence",
	"Provided mentorship",
	"Provided skills development",
	"Supported underserved communities",
];
const activityOptions = [
	"Teaching / tutoring",
	"Mentoring students",
	"Extracurricular activities",
	"Community outreach activities",
	"Event support",
	"Program coordination",
	"Training / facilitation",
	"Other",
];
const skillDevelopmentOptions = ["Yes", "Somewhat", "No"];
const skillsGainedOptions = [
	"Teaching skills",
	"Communication skills",
	"Leadership skills",
	"Mentorship skills",
	"Teamwork",
	"Community engagement",
	"Program facilitation",
];
const yesMaybeNoOptions = ["Yes", "Maybe", "No"];

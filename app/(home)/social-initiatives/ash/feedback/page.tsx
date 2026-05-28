"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
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
import { cnJoin } from "@/lib/utils/cn";

const ashFeedbackFrontendSchema = z.object({
	academicImprovementNoticed: z.string(),
	additionalComments: z.string(),
	attendanceFrequency: z.string(),
	childBenefited: z.string(),
	confidenceBehaviorChange: z.string(),
	confidenceRating: z.string(),
	currentClass: z.string(),
	enjoyedParts: z.string(),
	learningImprovementRating: z.string(),
	mostValuableAspects: z.string(),
	parentGuardianName: z.string(),
	parentGuardianRelationship: z.string(),
	parentImprovementSuggestions: z.string(),
	parentPhone: z.string(),
	parentSatisfactionRating: z.string(),
	programImpactOnChild: z.string(),
	schoolName: z.string(),
	studentEnjoyedMost: z.string(),
	studentFirstName: z.string(),
	studentImprovementSuggestions: z.string(),
	studentSurname: z.string(),
	volunteerSupportRating: z.string(),
});

function FeedbackFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<AshFeedbackForm />
		</Main>
	);
}

export default FeedbackFormPage;

function FormHeaderSection() {
	return (
		<header
			className="flex w-full items-center gap-5 rounded-[12px] bg-cedar-black p-3 text-cedar-white
				lg:rounded-[20px] lg:p-5"
		>
			<Button asChild={true} theme="secondary" size="icon" className="shrink-0">
				<NavLink href="/social-initiatives/ash">
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">ASH Program Feedback Form</h1>
		</header>
	);
}

const stepperItems = defineEnumDeep([
	{
		StepComponent: StudentFeedbackStep,
		title: "Student feedback",
	},
	{
		StepComponent: ParentGuardianFeedbackStep,
		title: "Parent / guardian feedback",
	},
]);

function AshFeedbackForm() {
	const form = useForm({
		defaultValues: {
			academicImprovementNoticed: "",
			additionalComments: "",
			attendanceFrequency: "",
			childBenefited: "",
			confidenceBehaviorChange: "",
			confidenceRating: "",
			currentClass: "",
			enjoyedParts: "",
			learningImprovementRating: "",
			mostValuableAspects: "",
			parentGuardianName: "",
			parentGuardianRelationship: "",
			parentImprovementSuggestions: "",
			parentPhone: "",
			parentSatisfactionRating: "",
			programImpactOnChild: "",
			schoolName: "",
			studentEnjoyedMost: "",
			studentFirstName: "",
			studentImprovementSuggestions: "",
			studentSurname: "",
			volunteerSupportRating: "",
		},
		resolver: zodResolver(ashFeedbackFrontendSchema),
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
	form: UseFormReturn<z.infer<typeof ashFeedbackFrontendSchema>>;
};

function StudentFeedbackStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Student Information" />

				<TextField control={form.control} name="studentFirstName" placeholder="Student First Name" />
				<TextField control={form.control} name="studentSurname" placeholder="Student Surname" />
				<TextField control={form.control} name="schoolName" placeholder="Current School" />
				<SelectField
					control={form.control}
					classNames={{ trigger: "max-w-[305px]" }}
					name="currentClass"
					placeholder="Current Class"
					options={classOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Student Feedback</h2>

				<OptionQuestionField
					control={form.control}
					name="attendanceFrequency"
					question="1. How much do you enjoy attending ASH?"
					options={["Very much", "Somewhat", "Not sure", "Not much"]}
				/>

				<OptionQuestionField
					control={form.control}
					name="enjoyedParts"
					question="2. What part of ASH has helped you the most?"
					options={[
						"Homework support",
						"Reading",
						"Mathematics",
						"Mentorship",
						"Creative activities",
					]}
				/>

				<OptionQuestionField
					control={form.control}
					name="learningImprovementRating"
					question="3. Which subject area has improved the most?"
					options={["English", "Mathematics", "Science", "Social Studies", "Other"]}
				/>

				<RatingQuestionField
					control={form.control}
					name="confidenceRating"
					question="4. ASH has improved my confidence in school work."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={form.control}
					name="volunteerSupportRating"
					question="5. Tutors and mentors explain things clearly."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<TextAreaField
					control={form.control}
					name="studentEnjoyedMost"
					label="What challenges are you still facing in school?"
				/>

				<TextAreaField
					control={form.control}
					name="studentImprovementSuggestions"
					label="What can make ASH better for students?"
				/>
			</section>
		</div>
	);
}

function ParentGuardianFeedbackStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Parent / Guardian Information" />

				<TextField
					control={form.control}
					name="parentGuardianName"
					placeholder="Parent / Guardian Name"
				/>
				<OptionQuestionField
					control={form.control}
					name="parentGuardianRelationship"
					question="Relationship to Student"
					options={["Father", "Mother", "Guardian", "Relative"]}
				/>
				<TextField control={form.control} name="parentPhone" placeholder="Phone Number" type="tel" />
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Parent / Guardian Feedback</h2>

				<OptionQuestionField
					control={form.control}
					name="academicImprovementNoticed"
					question="1. Have you noticed improvement in your child's school performance?"
					options={[
						"Yes - significant improvement",
						"Some improvement",
						"No noticeable change",
						"Not sure",
					]}
				/>

				<OptionQuestionField
					control={form.control}
					name="confidenceBehaviorChange"
					question="2. Have you noticed positive changes in your child's study habits?"
					options={["Yes - very positive", "Some improvement", "No change", "Not sure"]}
				/>

				<OptionQuestionField
					control={form.control}
					name="mostValuableAspects"
					question="3. Does the student practice ASH assignments or lessons at home?"
					options={["Regularly", "Sometimes", "Rarely", "Not sure"]}
				/>

				<OptionQuestionField
					control={form.control}
					name="childBenefited"
					question="4. How would you describe the student's attendance experience?"
					options={["Very consistent", "Mostly consistent", "Needs support", "Not sure"]}
				/>

				<RatingQuestionField
					control={form.control}
					name="parentSatisfactionRating"
					question="5. How satisfied are you with the ASH program?"
					leftLabel="Very dissatisfied"
					rightLabel="Very satisfied"
				/>

				<TextAreaField
					control={form.control}
					name="programImpactOnChild"
					label="What impact has ASH had on your child or family?"
				/>

				<TextAreaField
					control={form.control}
					name="parentImprovementSuggestions"
					label="What improvements would you recommend?"
				/>

				<TextAreaField
					control={form.control}
					name="additionalComments"
					label="Any additional comments or feedback"
				/>
			</section>
		</div>
	);
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

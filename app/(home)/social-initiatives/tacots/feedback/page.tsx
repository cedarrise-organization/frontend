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

const tacotsFeedbackFrontendSchema = z.object({
	academicImprovementNoticed: z.string(),
	additionalComments: z.string(),
	attitudeChangeNoticed: z.string(),
	currentChallenges: z.string(),
	currentClass: z.string(),
	currentSchool: z.string(),
	likedMost: z.string(),
	mentorshipImpactRating: z.string(),
	mostHelpfulSupport: z.string(),
	parentGuardianName: z.string(),
	parentGuardianRelationship: z.string(),
	parentImprovementSuggestions: z.string(),
	parentPhone: z.string(),
	parentSatisfactionRating: z.string(),
	programImpactOnFamily: z.string(),
	scholarshipHelpedStay: z.string(),
	scholarshipReducedBurden: z.string(),
	studentFirstName: z.string(),
	studentImprovementSuggestions: z.string(),
	studentSurname: z.string(),
	studyMotivationRating: z.string(),
});

function FeedbackFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormHeaderSection />
			<TacotsFeedbackForm />
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
				<NavLink href="/social-initiatives/tacots">
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">TACOTS Feedback Form</h1>
		</header>
	);
}

const stepperItems = defineEnumDeep([
	{
		StepComponent: StudentFeedbackStep,
		title: "Student feedback",
	},
	{
		StepComponent: ParentFeedbackStep,
		title: "Parent feedback",
	},
]);

function TacotsFeedbackForm() {
	const form = useForm({
		defaultValues: {
			academicImprovementNoticed: "",
			additionalComments: "",
			attitudeChangeNoticed: "",
			currentChallenges: "",
			currentClass: "",
			currentSchool: "",
			likedMost: "",
			mentorshipImpactRating: "",
			mostHelpfulSupport: "",
			parentGuardianName: "",
			parentGuardianRelationship: "",
			parentImprovementSuggestions: "",
			parentPhone: "",
			parentSatisfactionRating: "",
			programImpactOnFamily: "",
			scholarshipHelpedStay: "",
			scholarshipReducedBurden: "",
			studentFirstName: "",
			studentImprovementSuggestions: "",
			studentSurname: "",
			studyMotivationRating: "",
		},
		resolver: zodResolver(tacotsFeedbackFrontendSchema),
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
	form: UseFormReturn<z.infer<typeof tacotsFeedbackFrontendSchema>>;
};

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

function StudentFeedbackStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Student Information" />

				<TextField control={form.control} name="studentFirstName" placeholder="Student First name" />

				<TextField control={form.control} name="studentSurname" placeholder="Student Surname" />

				<TextField control={form.control} name="currentSchool" placeholder="Current School" />

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
					name="scholarshipHelpedStay"
					question="1. Has the TACOTS scholarship helped you stay in school?"
					options={["Yes - very much", "Yes - somewhat", "Not sure", "No"]}
				/>

				<OptionQuestionField
					control={form.control}
					name="mostHelpfulSupport"
					question="2. What support from TACOTS has helped you the most?"
					options={[
						"Tuition support",
						"Books and learning materials",
						"School supplies",
						"Mentorship",
						"Encouragement and guidance",
					]}
				/>

				<RatingQuestionField
					control={form.control}
					name="studyMotivationRating"
					question="3. Because of TACOTS, my motivation to study has improved."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<RatingQuestionField
					control={form.control}
					name="mentorshipImpactRating"
					question="4. TACOTS mentorship and guidance have helped me personally."
					leftLabel="Strongly disagree"
					rightLabel="Strongly agree"
				/>

				<OptionQuestionField
					control={form.control}
					name="currentChallenges"
					question="5. What challenges are you currently facing in school?"
					options={[
						"Difficulty understanding subjects",
						"Financial challenges",
						"Lack of learning materials",
						"Transportation to school",
						"Family responsibilities",
						"Other",
					]}
				/>

				<TextAreaField
					control={form.control}
					name="likedMost"
					label="What do you like most about the TACOTS program?"
				/>

				<TextAreaField
					control={form.control}
					name="studentImprovementSuggestions"
					label="What suggestions do you have to improve the program?"
				/>
			</section>
		</div>
	);
}

function ParentFeedbackStep(props: StepProps) {
	const { form } = props;

	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4 lg:gap-5">
				<FormSectionHeader title="Student Information" />

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
					name="scholarshipReducedBurden"
					question="1. Has the TACOTS scholarship helped reduce the financial burden?"
					options={["Yes - significantly", "Yes - somewhat", "Not really", "Not sure"]}
				/>

				<OptionQuestionField
					control={form.control}
					name="academicImprovementNoticed"
					question="2. Have you noticed improvement in your child's academic performance?"
					options={[
						"Yes - significant improvement",
						"Yes - some improvement",
						"No noticeable change",
						"Not sure",
					]}
				/>

				<OptionQuestionField
					control={form.control}
					name="attitudeChangeNoticed"
					question="3. Have you observed positive changes in your child's attitude toward school?"
					options={["Yes - very positive change", "Some improvement", "No change", "Not sure"]}
				/>

				<RatingQuestionField
					control={form.control}
					name="parentSatisfactionRating"
					question="4. How satisfied are you with the TACOTS scholarship program?"
					leftLabel="Very dissatisfied"
					rightLabel="Very satisfied"
				/>

				<TextAreaField
					control={form.control}
					name="programImpactOnFamily"
					label="What impact has the TACOTS program had on your child or family?"
				/>

				<TextAreaField
					control={form.control}
					name="parentImprovementSuggestions"
					label="What improvements would you recommend for the program?"
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

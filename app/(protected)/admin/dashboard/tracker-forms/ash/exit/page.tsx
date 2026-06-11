"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
	CheckboxQuestionField,
	DateField,
	OptionQuestionField,
	RatingQuestionField,
	SelectField,
	TextAreaField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import {
	FormPageHeader,
	FormStepComponentSectionHeader,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(protected)/admin/dashboard/-components/Main";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AshAreasOfImprovementOptions,
	AshExitDurationOptions,
	AshExitReasonOptions,
	AshMentorshipReceivedOptions,
	AshPostExitStatusOptions,
	backendApiSchemaRoutes,
	ClassOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import { ashStudentsLookupQuery } from "@/lib/react-query/queryOptions";

function AshExitPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="ASH Exit Form" href="/admin/dashboard" />
			<AshExitForm />
		</Main>
	);
}

export default AshExitPage;

const AshExitSchema = backendApiSchemaRoutes["@post/forms/ash/exit"].body;

function AshExitForm() {
	const { data: students = [] } = useQuery(ashStudentsLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));

	const form = useForm({
		defaultValues: {
			academicImpactRating: undefined,
			ageAtExit: undefined,
			areasOfImprovement: [],
			classAtExit: undefined,
			courseOfStudy: "",
			durationInProgram: undefined,
			enjoyedMost: "",
			exitDate: "",
			exitReason: undefined,
			facilitatorName: "",
			improvementSuggestions: "",
			institutionName: "",
			mentorshipImpactRating: undefined,
			mentorshipReceived: undefined,
			postAshStatus: undefined,
			programImpact: "",
			schoolName: "",
			studentId: "",
			vocationalSkill: "",
		},
		resolver: zodResolver(AshExitSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/ash/exit", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: () => form.reset(),
		});
	});

	return (
		<Form.Root
			form={form}
			onSubmit={(event) => void onSubmit(event)}
			className="min-h-screen w-full gap-10 lg:max-w-[590px] lg:gap-12"
		>
			<FormStepComponentSectionHeader title="Student Information" />

			<SelectField
				control={form.control}
				name="studentId"
				placeholder="Student Full Name"
				options={studentOptions}
				required={true}
			/>

			<TextField
				control={form.control}
				name="ageAtExit"
				placeholder="Age at Exit"
				min={6}
				max={18}
				step={1}
				type="number"
				required={true}
			/>

			<TextField control={form.control} name="schoolName" placeholder="School Name" required={true} />

			<SelectField
				control={form.control}
				name="classAtExit"
				placeholder="Class at the time of exit"
				options={ClassOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				name="durationInProgram"
				placeholder="Length of time in the ASH program"
				options={AshExitDurationOptions}
				required={true}
			/>

			<OptionQuestionField
				control={form.control}
				name="exitReason"
				question="Reason for exiting the ASH program"
				options={AshExitReasonOptions}
				required={true}
			/>

			<RatingQuestionField
				control={form.control}
				name="academicImpactRating"
				question="Rate the impact of the program on the child's academic performance"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="areasOfImprovement"
				question="Areas where the student improved"
				options={AshAreasOfImprovementOptions}
			/>

			<OptionQuestionField
				control={form.control}
				name="mentorshipReceived"
				question="Did the student receive mentorship during the program?"
				options={AshMentorshipReceivedOptions}
				required={true}
			/>

			<RatingQuestionField
				control={form.control}
				name="mentorshipImpactRating"
				question="Rate the impact of mentoring on the student"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
			/>

			<OptionQuestionField
				control={form.control}
				name="postAshStatus"
				question="What is the student currently doing after leaving ASH?"
				options={AshPostExitStatusOptions}
				required={true}
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<TextField control={form.control} name="institutionName" placeholder="Name of Institution" />
				<TextField control={form.control} name="courseOfStudy" placeholder="Course of Study" />
			</div>

			<TextField
				control={form.control}
				name="vocationalSkill"
				placeholder="If learning a trade, specify the skill"
			/>
			<TextAreaField
				control={form.control}
				name="enjoyedMost"
				label="What did the student enjoy most about the program?"
			/>
			<TextAreaField
				control={form.control}
				name="programImpact"
				label="How did the ASH program help the student?"
			/>
			<TextAreaField
				control={form.control}
				name="improvementSuggestions"
				label="What improvements did the student suggest for the ASH program?"
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<DateField control={form.control} name="exitDate" placeholder="Exit Date" required={true} />
				<TextField
					control={form.control}
					name="facilitatorName"
					placeholder="Facilitator's Name"
					required={true}
				/>
			</div>

			<Form.Submit asChild={true}>
				{(formState) => (
					<Button
						className="self-end text-[12px]"
						isLoading={formState.isSubmitting}
						isDisabled={formState.isSubmitting}
					>
						Submit
					</Button>
				)}
			</Form.Submit>
		</Form.Root>
	);
}

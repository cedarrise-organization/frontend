"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
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
	backendApiSchemaRoutes,
	TacotsExitCompletedSecondaryElsewhereOptions,
	TacotsExitCurrentStatusOptions,
	TacotsExitReasonOptions,
	TacotsHighestEducationAttainedOptions,
	TacotsVocationalSkillOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import { tacotsOnboardedLookupQuery } from "@/lib/react-query/queryOptions";

const TacotsExitSchema = backendApiSchemaRoutes["@post/forms/tacots/exit"].body;

function TacotsExitCompletionPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="TACOTS Exit / Completion Form" href="/admin/dashboard/tracker-forms" />
			<TacotsExitCompletionForm />
		</Main>
	);
}

export default TacotsExitCompletionPage;

function TacotsExitCompletionForm() {
	const { data: students = [] } = useQuery(tacotsOnboardedLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));

	const form = useForm({
		defaultValues: {
			additionalSituationInfo: "",
			completedBy: "",
			completedSecondaryElsewhere: undefined,
			currentStatus: undefined,
			employmentType: "",
			exitReason: undefined,
			higherInstitutionCity: "",
			higherInstitutionName: "",
			higherInstitutionState: "",
			highestEducationAttained: undefined,
			newSchoolName: "",
			programImpactDescription: "",
			programImpactRating: undefined,
			schoolAttendedDuringProgram: "",
			studentId: "",
			submissionDate: "",
			vocationalSkill: undefined,
			yearOfExit: undefined,
		},
		resolver: zodResolver(TacotsExitSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/tacots/exit", {
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
			<FormStepComponentSectionHeader title="Student Identification" />

			<SelectField
				control={form.control}
				name="studentId"
				placeholder="Student Full Name"
				options={studentOptions}
				required={true}
			/>
			<TextField
				control={form.control}
				name="schoolAttendedDuringProgram"
				placeholder="School Attended During Program"
				required={true}
			/>
			<TextField
				control={form.control}
				name="yearOfExit"
				placeholder="Year of Exit from TACOTS Program"
				type="number"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Exit Status" />

			<OptionQuestionField
				control={form.control}
				name="exitReason"
				question="Reason for Exit"
				options={TacotsExitReasonOptions}
				required={true}
			/>
			<OptionQuestionField
				control={form.control}
				name="highestEducationAttained"
				question="Highest level of education attained before exit"
				options={TacotsHighestEducationAttainedOptions}
				required={true}
			/>

			<FormStepComponentSectionHeader title="Post-Secondary Outcome" />

			<OptionQuestionField
				control={form.control}
				name="currentStatus"
				question="Current Status of the Student"
				options={TacotsExitCurrentStatusOptions}
				required={true}
			/>
			<TextField
				control={form.control}
				name="higherInstitutionName"
				placeholder="If admitted into higher institution, specify institution"
			/>
			<TextField
				control={form.control}
				name="higherInstitutionState"
				placeholder="If admitted, specify state"
			/>
			<TextField
				control={form.control}
				name="higherInstitutionCity"
				placeholder="If admitted, specify city"
			/>
			<TextField
				control={form.control}
				name="employmentType"
				placeholder="If employed, state type of work done"
			/>
			<SelectField
				control={form.control}
				name="vocationalSkill"
				placeholder="If learning a trade, specify the skill"
				options={TacotsVocationalSkillOptions}
			/>
			<TextField
				control={form.control}
				name="newSchoolName"
				placeholder="If transferred, specify school"
			/>

			<OptionQuestionField
				control={form.control}
				name="completedSecondaryElsewhere"
				question="Has the student also completed secondary education elsewhere?"
				options={TacotsExitCompletedSecondaryElsewhereOptions}
			/>

			<TextAreaField
				control={form.control}
				name="additionalSituationInfo"
				label="Provide details on the student's current situation"
			/>

			<FormStepComponentSectionHeader title="Program Reflection" />

			<TextAreaField
				control={form.control}
				name="programImpactDescription"
				label="How has the TACOTS program helped the student?"
			/>
			<RatingQuestionField
				control={form.control}
				name="programImpactRating"
				question="Rate the impact of the programme on the student"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
			/>

			<FormStepComponentSectionHeader title="Verification" />

			<TextField
				control={form.control}
				name="completedBy"
				placeholder="Person Completing the Form"
				required={true}
			/>
			<DateField
				control={form.control}
				name="submissionDate"
				placeholder="Date of Submission"
				required={true}
			/>

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

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	CheckboxQuestionField,
	DateField,
	TextAreaField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import { FormPageHeader, FormStepComponentSectionHeader } from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(protected)/admin/dashboard/-components/Main";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { AshSessionConductedOptions, backendApiSchemaRoutes } from "@/lib/api/callBackendApi/apiSchema";
import { ashStudentsLookupQuery } from "@/lib/react-query/queryOptions";

const AshAttendanceSchema = backendApiSchemaRoutes["@post/forms/ash/attendance"].body;

type AshAttendanceFormData = z.infer<typeof AshAttendanceSchema>;

function AshWeeklyActivityAttendancePage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="ASH Weekly activity & Attendance Form" href="/admin/dashboard" />
			<AshWeeklyActivityAttendanceForm />
		</Main>
	);
}

export default AshWeeklyActivityAttendancePage;

function AshWeeklyActivityAttendanceForm() {
	const { data: students = [] } = useQuery(ashStudentsLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));

	const form = useForm<AshAttendanceFormData>({
		defaultValues: {
			programReview: "",
			sessionDate: "",
			sessionDetails: "",
			sessionsConducted: [],
			studentsInAttendance: [],
			studentsMentored: [],
			volunteersInAttendance: "",
		},
		resolver: zodResolver(AshAttendanceSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/ash/attendance", {
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
			<FormStepComponentSectionHeader title="Weekly Session" />

			<DateField control={form.control} name="sessionDate" placeholder="Date of Session" required={true} />

			<CheckboxQuestionField
				control={form.control}
				name="studentsInAttendance"
				question="Students in Attendance"
				options={studentOptions}
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="studentsMentored"
				question="Students Mentored"
				options={studentOptions}
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="sessionsConducted"
				question="Sessions Held"
				options={AshSessionConductedOptions}
			/>

			<TextAreaField control={form.control} name="sessionDetails" label="Specify Session" />

			<TextField
				control={form.control}
				name="volunteersInAttendance"
				placeholder="Volunteers in Attendance"
				required={true}
			/>

			<TextAreaField control={form.control} name="programReview" label="Program Review" />

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

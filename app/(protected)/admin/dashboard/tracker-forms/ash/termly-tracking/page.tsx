"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	FileUploadField,
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
	type GetFormStepStoreType,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(protected)/admin/dashboard/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AcademicSessionOptions,
	AshTermlyTrackingFrontendSchema,
	AshTermOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import { ashStudentsLookupQuery } from "@/lib/react-query/queryOptions";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentAcademicProgressStep,
		title: "Student academic progress",
		validator: AshTermlyTrackingFrontendSchema.pick({
			academicSession: true,
			file: true,
			midtestAverage: true,
			midtestLiteracyScore: true,
			midtestNumeracyScore: true,
			posttestAverage: true,
			posttestLiteracyScore: true,
			posttestNumeracyScore: true,
			pretestAverage: true,
			pretestLiteracyScore: true,
			pretestNumeracyScore: true,
			schoolAverage: true,
			schoolLiteracyScore: true,
			schoolName: true,
			schoolNumeracyScore: true,
			schoolPosition: true,
			studentId: true,
			term: true,
		}),
	},
	{
		StepComponent: PersonalDevelopmentStep,
		title: "Personal development",
		validator: AshTermlyTrackingFrontendSchema.pick({
			challengesObserved: true,
			disciplineRating: true,
			leadershipRating: true,
			mentorName: true,
			nextTermRecommendations: true,
			notableAchievements: true,
			responsibilityRating: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof AshTermlyTrackingFrontendSchema>;

const useAshTermlyTrackingStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			academicSession: undefined,
			challengesObserved: "",
			disciplineRating: 0,
			file: undefined,
			leadershipRating: 0,
			mentorName: "",
			midtestAverage: "",
			midtestLiteracyScore: "",
			midtestNumeracyScore: "",
			nextTermRecommendations: "",
			notableAchievements: "",
			posttestAverage: "",
			posttestLiteracyScore: "",
			posttestNumeracyScore: "",
			pretestAverage: "",
			pretestLiteracyScore: "",
			pretestNumeracyScore: "",
			responsibilityRating: 0,
			schoolAverage: "",
			schoolLiteracyScore: "",
			schoolName: "",
			schoolNumeracyScore: "",
			schoolPosition: "",
			studentId: "",
			term: undefined,
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "admin-ash-termly-tracking-form-data",
});

function AshTermlyTrackingPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="ASH Termly Tracking Form" href="/admin/dashboard/tracker-forms" />
			<AshTermlyTrackingForm />
		</Main>
	);
}

export default AshTermlyTrackingPage;

function AshTermlyTrackingForm() {
	const [storeValues, storeActions] = useAshTermlyTrackingStorageState();

	const form = useForm({
		resolver: zodResolver(
			stepItems[storeValues.currentStep]?.validator ?? AshTermlyTrackingFrontendSchema
		),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/ash/tracking", {
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

function StudentAcademicProgressStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[0]["validator"]>>();
	const { data: students = [] } = useQuery(ashStudentsLookupQuery());
	const studentOptions = students.map((student) => ({ label: student.name, value: student.id }));
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Student Information" />

			<SelectField
				control={form.control}
				name="studentId"
				placeholder="Student Full Name"
				options={studentOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				name="academicSession"
				placeholder="Academic Session"
				options={AcademicSessionOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				name="term"
				placeholder="Term"
				options={AshTermOptions}
				required={true}
			/>

			<TextField control={form.control} name="schoolName" placeholder="School" required={true} />

			<FormStepComponentSectionHeader title="Academic Progress" note="School Result" />

			<TextField control={form.control} name="schoolNumeracyScore" placeholder="Numeracy Score" />
			<TextField control={form.control} name="schoolLiteracyScore" placeholder="Literacy Score" />
			<TextField control={form.control} name="schoolAverage" placeholder="Student Average" />
			<TextField control={form.control} name="schoolPosition" placeholder="Student Position" />

			<FormStepComponentSectionHeader title="ASH Pre-test" note="ASH Result" />

			<TextField control={form.control} name="pretestNumeracyScore" placeholder="Numeracy Score" />
			<TextField control={form.control} name="pretestLiteracyScore" placeholder="Literacy Score" />
			<TextField control={form.control} name="pretestAverage" placeholder="Average score" />

			<FormStepComponentSectionHeader title="ASH Mid-test" note="ASH Result" />

			<TextField control={form.control} name="midtestNumeracyScore" placeholder="Numeracy Score" />
			<TextField control={form.control} name="midtestLiteracyScore" placeholder="Literacy Score" />
			<TextField control={form.control} name="midtestAverage" placeholder="Average score" />

			<FormStepComponentSectionHeader title="ASH Post-test" note="ASH Result" />

			<TextField control={form.control} name="posttestNumeracyScore" placeholder="Numeracy Score" />
			<TextField control={form.control} name="posttestLiteracyScore" placeholder="Literacy Score" />
			<TextField control={form.control} name="posttestAverage" placeholder="Average score" />

			<FileUploadField control={form.control} name="file" label="Upload School result for the term" />
		</>
	);
}

function PersonalDevelopmentStep() {
	const { control } = useFormContext<z.input<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Personal Development" />

			<RatingQuestionField
				control={form.control}
				name="disciplineRating"
				question="Level of Discipline"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
				required={true}
			/>

			<RatingQuestionField
				control={form.control}
				name="responsibilityRating"
				question="Sense of responsibility"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
				required={true}
			/>

			<RatingQuestionField
				control={form.control}
				name="leadershipRating"
				question="Leadership and Responsibility"
				leftLabel="1"
				rightLabel="10"
				maxRating={10}
				required={true}
			/>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="text-[14px]/[1.2] lg:text-[18px]">Mentor&apos;s Comments</h2>

				<TextAreaField
					control={form.control}
					name="notableAchievements"
					label="Notable Achievements"
				/>
				<TextAreaField control={form.control} name="challengesObserved" label="Challenges Observed" />
				<TextAreaField
					control={form.control}
					name="nextTermRecommendations"
					label="Recommendations for Next Term"
				/>
				<TextField
					control={form.control}
					name="mentorName"
					placeholder="Mentor's Name"
					required={true}
				/>
			</section>
		</>
	);
}

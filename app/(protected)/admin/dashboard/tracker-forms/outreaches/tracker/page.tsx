"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toFormData } from "@zayne-labs/callapi/utils";
import { useForm } from "react-hook-form";
import {
	CheckboxQuestionField,
	ComboboxField,
	DateField,
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
	getLgaOptions,
	NigeriaStateOptions,
	OutreachTrackerFrontendSchema,
	OutreachTypeOptions,
} from "@/lib/api/callBackendApi/apiSchema";

function OutreachTrackerPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="Cedar Outreach Tracker Form" href="/admin/dashboard" />
			<OutreachTrackerForm />
		</Main>
	);
}

export default OutreachTrackerPage;

function OutreachTrackerForm() {
	const form = useForm({
		defaultValues: {
			activityDescription: "",
			challengesEncountered: "",
			city: "",
			community: "",
			completedBy: "",
			impactStories: "",
			lga: "",
			location: undefined,
			numberOfBeneficiariesReached: undefined,
			numberOfVolunteers: undefined,
			outreachEndDate: "",
			outreachStartDate: "",
			outreachTypes: [],
			recommendations: "",
			submissionDate: "",
		},
		resolver: zodResolver(OutreachTrackerFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/outreaches", {
			body: toFormData(data),
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
			<FormStepComponentSectionHeader title="Outreach Details" note="Outreach Period" />

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<DateField
					control={form.control}
					name="outreachStartDate"
					placeholder="From"
					required={true}
				/>
				<DateField control={form.control} name="outreachEndDate" placeholder="To" required={true} />
			</div>

			<ComboboxField
				control={form.control}
				name="location"
				placeholder="Location of Outreach"
				options={NigeriaStateOptions}
				required={true}
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<TextField control={form.control} name="city" placeholder="City" required={true} />

				<Form.Watch control={form.control} name="location">
					{(location) => (
						<ComboboxField
							control={form.control}
							name="lga"
							placeholder="Local Government Area"
							options={getLgaOptions(location)}
							required={true}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField control={form.control} name="community" placeholder="Community" required={true} />
			<TextField
				control={form.control}
				name="numberOfVolunteers"
				placeholder="Number of Volunteers"
				min={0}
				step={1}
				type="number"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numberOfBeneficiariesReached"
				placeholder="Number of Beneficiaries Reached"
				min={0}
				step={1}
				type="number"
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="outreachTypes"
				question="Type of Outreach"
				options={OutreachTypeOptions}
				required={true}
			/>

			<TextAreaField
				control={form.control}
				name="activityDescription"
				label="Description of the Project / Outreach Activity"
				required={true}
			/>

			<FormStepComponentSectionHeader title="Impact & Feedback" />

			<TextAreaField
				control={form.control}
				name="impactStories"
				label="Major Impact Stories or Feedback"
			/>
			<TextAreaField
				control={form.control}
				name="challengesEncountered"
				label="Challenges Encountered"
			/>
			<TextAreaField
				control={form.control}
				name="recommendations"
				label="Recommendations / Suggestions for Improvement"
			/>

			<FormStepComponentSectionHeader title="Documentation" />

			<TextField
				control={form.control}
				name="completedBy"
				placeholder="Name of Person Completing Form"
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

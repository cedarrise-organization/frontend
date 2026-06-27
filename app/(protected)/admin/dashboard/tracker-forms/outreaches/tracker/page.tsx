"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
	backendApiSchemaRoutes,
	getLgaOptions,
	NigeriaStateOptions,
	OutreachTypeOptions,
} from "@/lib/api/callBackendApi/apiSchema";

const OutreachTrackerSchema = backendApiSchemaRoutes["@post/forms/outreaches"].body;

function OutreachTrackerPage() {
	return (
		<Main bg="transparent" className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="Cedar Outreach Tracker Form" href="/admin/dashboard/tracker-forms" />
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
			impactStories: "",
			numBeneficiaries: undefined,
			numVolunteers: undefined,
			outreachCity: "",
			outreachCommunity: "",
			outreachEndDate: "",
			outreachLga: "",
			outreachStartDate: "",
			outreachState: undefined,
			outreachType: [],
			recommendations: "",
			submissionDate: "",
			submittedBy: "",
		},
		resolver: zodResolver(OutreachTrackerSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/outreaches", {
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
			<FormStepComponentSectionHeader title="Outreach Details" note="Outreach Period" />

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<DateField
					control={form.control}
					classNames={{
						base: "w-full",
					}}
					name="outreachStartDate"
					placeholder="From"
					required={true}
				/>

				<DateField
					control={form.control}
					name="outreachEndDate"
					placeholder="To"
					required={true}
					classNames={{
						base: "w-full",
					}}
				/>
			</div>

			<ComboboxField
				control={form.control}
				name="outreachState"
				placeholder="Location of Outreach"
				options={NigeriaStateOptions}
				required={true}
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<TextField control={form.control} name="outreachCity" placeholder="City" required={true} />

				<Form.Watch control={form.control} name="outreachState">
					{(outreachState) => (
						<ComboboxField
							control={form.control}
							name="outreachLga"
							placeholder="Local Government Area"
							options={getLgaOptions(outreachState)}
							required={true}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField
				control={form.control}
				name="outreachCommunity"
				placeholder="Community"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numVolunteers"
				placeholder="Number of Volunteers"
				min={0}
				step={1}
				type="number"
				required={true}
			/>
			<TextField
				control={form.control}
				name="numBeneficiaries"
				placeholder="Number of Beneficiaries Reached"
				min={0}
				step={1}
				type="number"
				required={true}
			/>

			<CheckboxQuestionField
				control={form.control}
				name="outreachType"
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
				name="submittedBy"
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

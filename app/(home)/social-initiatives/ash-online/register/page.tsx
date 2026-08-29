"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toFormData } from "@zayne-labs/callapi/utils";
import { useForm } from "react-hook-form";
import {
	AgreementField,
	CheckboxQuestionField,
	DateField,
	FileUploadField,
	SelectField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import {
	FormPageHeader,
	FormStepComponentSectionHeader,
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AshOnlineAgeOptions,
	AshOnlineClassOptions,
	AshOnlineRegisterFrontendSchema,
	AshOnlineSubjectOptions,
	AshOnlineTutoringDayOptions,
} from "@/lib/api/callBackendApi/apiSchema";

function AshOnlineRegistrationPage() {
	const form = useForm({
		defaultValues: {
			childEmail: "",
			childFirstName: "",
			childSurname: "",
			dob: "",
			parentalConsent: undefined,
			parentEmail: "",
			parentName: "",
			parentPhone: "",
			prevTermClassAverage: "",
			prevTermClassPosition: "",
			schoolLocation: "",
			schoolName: "",
			subjectsOfInterest: [],
			timeAvailability: "",
			tutoringDays: [],
		},
		resolver: zodResolver(AshOnlineRegisterFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/forms/ash-online/registration", {
			body: toFormData(data),
			meta: { toast: { success: true } },
			onSuccess: () => form.reset(),
		});
	});

	return (
		<Main withWatermark={true} className="items-center gap-10 lg:gap-16">
			<FormPageHeader title="ASH Online Student Registration Form" withHistory={false} href="/" />

			<Form.Root
				form={form}
				onSubmit={(event) => void onSubmit(event)}
				className="w-full max-w-[780px] gap-8 rounded-[24px] bg-cedar-white p-5 lg:rounded-[32px]
					lg:p-10"
			>
				<FormStepComponentSectionHeader title="Student Information" />

				<div className="grid gap-5 lg:grid-cols-2">
					<TextField
						control={form.control}
						name="childFirstName"
						label="Child's First Name"
						placeholder="First name"
						required={true}
					/>
					<TextField
						control={form.control}
						name="childSurname"
						label="Child's Surname"
						placeholder="Surname"
						required={true}
					/>
					<DateField
						control={form.control}
						name="dob"
						label="Date of Birth"
						placeholder="Date of birth"
						required={true}
					/>
					<SelectField
						control={form.control}
						name="age"
						label="Age"
						placeholder="Select age"
						options={AshOnlineAgeOptions}
						required={true}
					/>
					<SelectField
						control={form.control}
						name="childClass"
						label="Class"
						placeholder="Select class"
						options={AshOnlineClassOptions}
						required={true}
					/>
					<TextField
						control={form.control}
						name="childEmail"
						label="Child's Email Address"
						placeholder="Email the child can access"
						type="email"
						required={true}
					/>
					<TextField
						control={form.control}
						name="schoolName"
						label="School Name"
						placeholder="School name"
						required={true}
					/>
					<TextField
						control={form.control}
						name="schoolLocation"
						label="School Location"
						placeholder="City - State - Country"
						required={true}
					/>
				</div>
				<CheckboxQuestionField
					control={form.control}
					name="tutoringDays"
					question="Days Available for Tutoring"
					options={AshOnlineTutoringDayOptions}
					required={true}
				/>
				<TextField
					control={form.control}
					name="timeAvailability"
					label="Time Availability"
					placeholder="e.g. 09:00am - 11:00am WAT"
					required={true}
				/>
				<CheckboxQuestionField
					control={form.control}
					name="subjectsOfInterest"
					question="Subject(s) of Interest"
					options={AshOnlineSubjectOptions}
					required={true}
				/>

				<FormStepComponentSectionHeader title="Parent and Academic Information" />

				<div className="grid gap-5 lg:grid-cols-2">
					<TextField
						control={form.control}
						name="parentName"
						label="Parent's Full Name"
						placeholder="Full name"
						required={true}
					/>
					<TextField
						control={form.control}
						name="parentPhone"
						label="Parent's Phone Number"
						placeholder="Phone number"
						type="tel"
						required={true}
					/>
					<TextField
						control={form.control}
						name="parentEmail"
						label="Parent's Email Address"
						placeholder="Email address"
						type="email"
						required={true}
					/>
					<TextField
						control={form.control}
						name="prevTermClassAverage"
						label="Previous Term's Class Average"
						placeholder="e.g. 78%"
						required={true}
					/>
					<TextField
						control={form.control}
						name="prevTermClassPosition"
						label="Previous Term's Class Position"
						placeholder="e.g. 3rd out of 45"
						required={true}
					/>
				</div>

				<div className="grid gap-5 lg:grid-cols-2">
					<FileUploadField
						control={form.control}
						name="currentCurriculum"
						label="Upload Current Curriculum"
					/>
					<FileUploadField
						control={form.control}
						name="academicReport"
						label="Upload Last Academic Report"
					/>
				</div>

				<AgreementField
					control={form.control}
					name="parentalConsent"
					title="Parental Consent"
					label="I consent to my child participating in CedarRise's virtual After School Hours programme and understand that my child may be seen or heard during live sessions."
				/>

				<Form.Submit asChild={true}>
					{(state) => (
						<Button
							isLoading={state.isSubmitting}
							isDisabled={state.isSubmitting}
							className="ml-auto"
						>
							Submit Registration
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</Main>
	);
}

export default AshOnlineRegistrationPage;

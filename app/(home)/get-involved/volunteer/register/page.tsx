"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	AgreementField,
	CheckboxQuestionField,
	ComboboxField,
	DateField,
	OptionQuestionField,
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
import { Main } from "@/app/(home)/-components/Main";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	backendApiSchemaRoutes,
	GenderOptions,
	getLgaOptions,
	NigeriaStateOptions,
	VolunteerAgeOptions,
	VolunteerAreaOptions,
	VolunteerAshAcademicAreaOptions,
	VolunteerAshExtracurricularOptions,
	VolunteerAshSaturdayAvailabilityOptions,
	VolunteerAvailabilityOptions,
	VolunteerCommitmentDurationOptions,
	VolunteerHighestEducationOptions,
	VolunteerSkillOptions,
	YesNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const VolunteerRegisterSchema = backendApiSchemaRoutes["@post/volunteer/register"].body;

function VolunteerRegisterPage() {
	return (
		<Main showWatermark={true} className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="Volunteer Form" href="/get-involved/volunteer" />
			<VolunteerRegisterForm />
		</Main>
	);
}

export default VolunteerRegisterPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: VolunteerInformationStepOne,
		title: "Volunteer information",
		validator: VolunteerRegisterSchema.pick({
			age: true,
			city: true,
			dob: true,
			emailAddress: true,
			firstName: true,
			gender: true,
			highestEducation: true,
			homeAddress: true,
			middleName: true,
			occupation: true,
			phoneNumber: true,
			state: true,
			surname: true,
		}),
	},
	{
		StepComponent: VolunteerInterestStepTwo,
		title: "Volunteer interest",
		validator: VolunteerRegisterSchema.pick({
			additionalInfo: true,
			ashAcademicArea: true,
			ashExtracurricular: true,
			ashSaturdayAvailability: true,
			availability: true,
			commitmentDuration: true,
			mediaConsent: true,
			reasonForVolunteering: true,
			safeguardingAgreement: true,
			skillsToContribute: true,
			volunteerAreas: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof VolunteerRegisterSchema>;

const useVolunteerRegisterStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			additionalInfo: "",
			age: undefined,
			ashAcademicArea: undefined,
			ashExtracurricular: [],
			ashSaturdayAvailability: undefined,
			availability: [],
			city: "",
			commitmentDuration: undefined,
			dob: "",
			emailAddress: "",
			firstName: "",
			gender: undefined,
			highestEducation: undefined,
			homeAddress: "",
			mediaConsent: undefined,
			middleName: "",
			occupation: "",
			phoneNumber: "",
			reasonForVolunteering: "",
			safeguardingAgreement: undefined,
			skillsToContribute: [],
			state: undefined,
			surname: "",
			volunteerAreas: [],
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "volunteer-register-form-data",
});

function VolunteerRegisterForm() {
	const [storeValues, storeActions] = useVolunteerRegisterStorageState();

	const form = useForm({
		resolver: zodResolver(stepItems[storeValues.currentStep]?.validator ?? VolunteerRegisterSchema),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/volunteer/register", {
			body: {
				...storeValues.formStepData,
				...data,
			},
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

function VolunteerInformationStepOne() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[0]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="Volunteer Information" />

			<TextField control={control} name="firstName" placeholder="First Name" required={true} />
			<TextField control={control} name="middleName" placeholder="Middle Name" />
			<TextField control={control} name="surname" placeholder="Surname" required={true} />

			<OptionQuestionField
				control={control}
				name="gender"
				question="Gender"
				options={GenderOptions}
				required={true}
			/>

			<SelectField
				control={control}
				classNames={{ trigger: "w-fit min-w-[100px]" }}
				name="age"
				placeholder="Age"
				options={VolunteerAgeOptions}
				required={true}
			/>

			<DateField control={control} name="dob" placeholder="Date of Birth" required={true} />
			<TextField
				control={control}
				name="phoneNumber"
				placeholder="Phone Number"
				type="tel"
				required={true}
			/>
			<TextField
				control={control}
				name="emailAddress"
				placeholder="Email Address"
				type="email"
				required={true}
			/>
			<TextField control={control} name="homeAddress" placeholder="Home address" required={true} />

			<div className="flex gap-3 lg:gap-5 [&>div]:max-w-none">
				<ComboboxField
					control={control}
					name="state"
					placeholder="State"
					options={NigeriaStateOptions}
					required={true}
				/>

				<Form.Watch control={control} name="state">
					{(state) => (
						<ComboboxField
							control={control}
							disabled={!state}
							name="city"
							placeholder="City"
							options={getLgaOptions(state)}
							required={true}
						/>
					)}
				</Form.Watch>
			</div>

			<TextField control={control} name="occupation" placeholder="Occupation / Profession" />
			<SelectField
				control={control}
				name="highestEducation"
				placeholder="Highest Level of Education"
				options={VolunteerHighestEducationOptions}
			/>
		</>
	);
}

function VolunteerInterestStepTwo() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Interest</h2>

				<TextAreaField
					control={control}
					name="reasonForVolunteering"
					label="Why would you like to volunteer with CedarRise?"
					required={true}
				/>

				<CheckboxQuestionField
					control={control}
					name="volunteerAreas"
					question="1. Areas you would like to volunteer in"
					options={VolunteerAreaOptions}
					required={true}
				/>

				<CheckboxQuestionField
					control={control}
					name="skillsToContribute"
					question="2. Skills you can contribute"
					options={VolunteerSkillOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">General Availability</h2>

				<CheckboxQuestionField
					control={control}
					name="availability"
					question="1. When are you generally available to volunteer?"
					options={VolunteerAvailabilityOptions}
					required={true}
				/>

				<OptionQuestionField
					control={control}
					name="commitmentDuration"
					question="2. How long can you commit to volunteering?"
					options={VolunteerCommitmentDurationOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<header className="flex flex-wrap items-end gap-x-8 gap-y-1">
					<h2 className="leading-[1.2] lg:text-[24px]">ASH Volunteer Section</h2>
					<p className="text-[8px]/3 text-cedar-black/64 lg:text-[12px]/4">
						(Complete this section only if you selected ASH above)
					</p>
				</header>

				<OptionQuestionField
					control={control}
					name="ashSaturdayAvailability"
					question="1. Availability for ASH Saturday Sessions"
					options={VolunteerAshSaturdayAvailabilityOptions}
				/>

				<OptionQuestionField
					control={control}
					name="ashAcademicArea"
					question="2. Academic area you would like to teach"
					options={VolunteerAshAcademicAreaOptions}
				/>

				<CheckboxQuestionField
					control={control}
					name="ashExtracurricular"
					question="3. Extracurricular activities you would like to support"
					options={VolunteerAshExtracurricularOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Commitment</h2>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">Policy Statement</p>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
					CedarRise Initiative for Human Development is committed to providing a safe, respectful, and
					protective environment for all children and vulnerable individuals engaged in its programs.
					We uphold a zero-tolerance approach to abuse, exploitation, neglect, and any form of harm.
				</p>

				<OptionQuestionField
					control={control}
					name="safeguardingAgreement"
					question="Do you agree to follow CedarRise volunteer guidelines and safeguarding policies?"
					options={YesNoOptions}
					required={true}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<AgreementField
					control={control}
					description="I commit to volunteer actively in any programme I have signed up. I hereby grant the
					organizers and their authorized representatives permission to use information, photographs
					and videos that may be captured of me during the program."
					name="mediaConsent"
					label="Usage: These materials may be used for promotional, educational, reporting and evaluation purposes on websites, social media platforms, and in digital or printed publications."
				/>
			</section>
		</>
	);
}

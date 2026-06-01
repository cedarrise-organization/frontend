"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
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
} from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, useFormRootContext } from "@/components/ui/form";
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

const VolunteerRegisterSchema = backendApiSchemaRoutes["@post/volunteer/register"].body;

function VolunteerRegisterPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="Volunteer Form" href="/get-involved/volunteer" />
			<VolunteerRegisterForm />
		</Main>
	);
}

export default VolunteerRegisterPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: VolunteerInformationStep,
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
		StepComponent: VolunteerInterestStep,
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
			registrationDate: true,
			safeguardingAgreement: true,
			skillsToContribute: true,
			volunteerAreas: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type VolunteerRegisterFormStoreType = {
	currentStep: number;
	formStepData: z.infer<typeof VolunteerRegisterSchema>;
};

const useVolunteerRegisterStorageState = createUseStorageState<VolunteerRegisterFormStoreType>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			additionalInfo: "",
			age: "",
			ashAcademicArea: "",
			ashExtracurricular: [],
			ashInterest: "",
			ashSaturdayAvailability: "",
			availability: [],
			city: "",
			commitmentDuration: "",
			dob: "",
			emailAddress: "",
			firstName: "",
			gender: "",
			highestEducation: "",
			homeAddress: "",
			mediaConsent: false,
			middleName: "",
			occupation: "",
			phoneNumber: "",
			reasonForVolunteering: "",
			registrationDate: "",
			safeguardingAgreement: "",
			skillsToContribute: [],
			state: "",
			surname: "",
			volunteerAreas: [],
		} as unknown as VolunteerRegisterFormStoreType["formStepData"],
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

function VolunteerInformationStep() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[0]["validator"]>>();

	return (
		<>
			<FormStepComponentSectionHeader title="Volunteer Information" />

			<TextField control={control} name="firstName" placeholder="First Name" />
			<TextField control={control} name="middleName" placeholder="Middle Name" />
			<TextField control={control} name="surname" placeholder="Surname" />

			<OptionQuestionField control={control} name="gender" question="Gender" options={GenderOptions} />

			<SelectField
				control={control}
				classNames={{ trigger: "w-fit min-w-[100px]" }}
				name="age"
				placeholder="Age"
				options={VolunteerAgeOptions}
			/>

			<DateField control={control} name="dob" placeholder="Date of Birth" />
			<TextField control={control} name="phoneNumber" placeholder="Phone Number" type="tel" />
			<TextField control={control} name="emailAddress" placeholder="Email Address" type="email" />
			<TextField control={control} name="homeAddress" placeholder="Home address" />

			<div className="flex gap-3 lg:gap-5 [&>div]:max-w-none">
				<ComboboxField
					control={control}
					name="state"
					placeholder="State"
					options={NigeriaStateOptions}
				/>

				<Form.Watch control={control} name="state">
					{(state) => (
						<ComboboxField
							control={control}
							disabled={!state}
							name="city"
							placeholder="City"
							options={getLgaOptions(state)}
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

function VolunteerInterestStep() {
	const { control } = useFormRootContext<z.infer<(typeof stepItems)[1]["validator"]>>();

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Volunteer Interest</h2>

				<TextAreaField
					control={control}
					name="reasonForVolunteering"
					label="Why would you like to volunteer with CedarRise?"
				/>

				<CheckboxQuestionField
					control={control}
					name="volunteerAreas"
					question="1. Areas you would like to volunteer in"
					options={VolunteerAreaOptions}
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
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Media Consent</h2>
				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
					I commit to volunteer actively in any programme I have signed up. I hereby grant the
					organizers and their authorized representatives permission to use information, photographs
					and videos that may be captured of me during the program.
				</p>

				<Form.Field
					control={control}
					name="mediaConsent"
					className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
				>
					<Form.FieldBoundController
						render={({ field }) => (
							<Checkbox
								id="media-consent"
								checked={field.value}
								onCheckedChange={field.onChange}
								classNames={{
									base: `mt-[2px] size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
									bg-transparent data-checked:bg-transparent lg:mt-[3px]`,
									icon: "size-3",
								}}
							/>
						)}
					/>

					<Form.Label htmlFor="media-consent">
						Usage: These materials may be used for promotional, educational, reporting and evaluation
						purposes on websites, social media platforms, and in digital or printed publications.
					</Form.Label>
				</Form.Field>
			</section>
		</>
	);
}

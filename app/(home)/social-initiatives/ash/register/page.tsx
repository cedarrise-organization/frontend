"use client";

import { Steps } from "@ark-ui/react/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { toFormData } from "@zayne-labs/callapi/utils";
import { createUseStorageState } from "@zayne-labs/toolkit-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	CheckboxQuestionField,
	ComboboxField,
	DateField,
	FileUploadField,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form, useFormContext } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AshAgeOptions,
	AshGuardianRelationshipOptions,
	AshHouseholdIncomeRangeOptions,
	AshLearningConditionOptions,
	AshProgramTypeOptions,
	AshRegisterFrontendSchema,
	ClassOptions,
	GenderOptions,
	getLgaOptions,
	LearningConditionStatusOptions,
	NigeriaStateOptions,
	PrimaryLanguageOptions,
	YesNoOptions,
} from "@/lib/api/callBackendApi/apiSchema";
import type { WithUndefined } from "@/lib/utils/type-helpers";

const AshRegisterSchema = AshRegisterFrontendSchema;

function RegisterFormPage() {
	return (
		<Main className="items-center gap-10 lg:gap-[64px]">
			<FormPageHeader title="ASH Student Registration Form" href="/social-initiatives/ash" />
			<AshRegisterForm />
		</Main>
	);
}

export default RegisterFormPage;

const stepItems = defineFormStepItems([
	{
		StepComponent: StudentPersonalInformationStepOne,
		title: "Student personal information",
		validator: AshRegisterSchema.pick({
			age: true,
			dob: true,
			firstName: true,
			gender: true,
			homeAddress: true,
			middleName: true,
			passportPhoto: true,
			primaryLanguage: true,
			programType: true,
			studentPhone: true,
			surname: true,
		}),
	},
	{
		StepComponent: SchoolInformationStepTwo,
		title: "School information",
		validator: AshRegisterSchema.pick({
			classPositionLastTerm: true,
			currentClass: true,
			lastResult: true,
			prevAfterschoolProgram: true,
			reasonForJoining: true,
			schoolLga: true,
			schoolName: true,
			schoolState: true,
			schoolTown: true,
		}),
	},
	{
		StepComponent: ParentGuardianInformationStepThree,
		title: "Parent / guardian information",
		validator: AshRegisterSchema.pick({
			fathersName: true,
			fathersOccupation: true,
			fathersPhone: true,
			guardianName: true,
			guardianOccupation: true,
			guardianPhone: true,
			guardianRelationship: true,
			householdIncomeRange: true,
			mothersName: true,
			mothersOccupation: true,
			mothersPhone: true,
		}),
	},
	{
		StepComponent: WellbeingConsentStepFour,
		title: "Wellbeing and consent",
		validator: AshRegisterSchema.pick({
			assignedMentor: true,
			declarationConfirmed: true,
			hasLearningCondition: true,
			learningConditions: true,
			parentConsent: true,
			parentSignature: true,
			pretestScore: true,
		}),
	},
]);

const stepItemsCount = stepItems.length - 1;

type FormStepDataType = z.infer<typeof AshRegisterSchema>;

const useAshRegisterStorageState = createUseStorageState<GetFormStepStoreType<FormStepDataType>>({
	defaultValue: {
		currentStep: 0,
		formStepData: {
			age: undefined,
			assignedMentor: "",
			classPositionLastTerm: "",
			currentClass: undefined,
			declarationConfirmed: undefined,
			dob: "",
			fathersName: "",
			fathersOccupation: "",
			fathersPhone: "",
			firstName: "",
			gender: undefined,
			guardianName: "",
			guardianOccupation: "",
			guardianPhone: "",
			guardianRelationship: undefined,
			hasLearningCondition: undefined,
			homeAddress: "",
			householdIncomeRange: undefined,
			lastResult: undefined,
			learningConditions: [],
			middleName: "",
			mothersName: "",
			mothersOccupation: "",
			mothersPhone: "",
			parentConsent: undefined,
			parentSignature: undefined,
			passportPhoto: undefined,
			pretestScore: "",
			prevAfterschoolProgram: undefined,
			primaryLanguage: undefined,
			programType: undefined,
			reasonForJoining: "",
			schoolLga: "",
			schoolName: "",
			schoolState: undefined,
			schoolTown: "",
			studentPhone: "",
			surname: "",
		} satisfies WithUndefined<FormStepDataType> as unknown as FormStepDataType,
	},
	key: "ash-register-form-data",
});

function AshRegisterForm() {
	const [storeValues, storeActions] = useAshRegisterStorageState();

	const form = useForm({
		resolver: zodResolver(stepItems[storeValues.currentStep]?.validator ?? AshRegisterSchema),
		values: storeValues.formStepData as never,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		storeActions.setState((state) => ({ formStepData: { ...state.formStepData, ...data } }));

		if (storeValues.currentStep !== stepItemsCount) return;

		await callBackendApiForQuery("@post/forms/ash/registration", {
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

function StudentPersonalInformationStepOne() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[0]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Student Personal Information" />

			<TextField control={form.control} name="firstName" placeholder="First Name" required={true} />
			<TextField control={form.control} name="middleName" placeholder="Middle Name" />
			<TextField control={form.control} name="surname" placeholder="Surname" required={true} />

			<OptionQuestionField
				control={form.control}
				name="programType"
				question="Program Type"
				options={AshProgramTypeOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "w-fit min-w-[116px]" }}
				name="age"
				placeholder="Age"
				options={AshAgeOptions}
				required={true}
			/>

			<DateField control={form.control} name="dob" placeholder="Date of Birth" required={true} />

			<OptionQuestionField
				control={form.control}
				name="gender"
				question="Gender"
				options={GenderOptions}
				required={true}
			/>

			<SelectField
				control={form.control}
				name="primaryLanguage"
				placeholder="Primary Language Spoken at home"
				options={PrimaryLanguageOptions}
				required={true}
			/>

			<TextField control={form.control} name="homeAddress" placeholder="Home Address" required={true} />
			<TextField control={form.control} name="studentPhone" placeholder="Phone Number" type="tel" />
			<FileUploadField
				control={form.control}
				name="passportPhoto"
				label="Upload Student Passport Photograph"
				required={true}
			/>
		</>
	);
}

function SchoolInformationStepTwo() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[1]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="School Information" />

			<TextField
				control={form.control}
				name="schoolName"
				placeholder="Name of Current School"
				required={true}
			/>

			<ComboboxField
				control={form.control}
				name="schoolState"
				placeholder="State"
				options={NigeriaStateOptions}
				required={true}
			/>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<TextField control={form.control} name="schoolTown" placeholder="Town" required={true} />

				<Form.Watch control={form.control} name="schoolState">
					{(schoolState) => (
						<ComboboxField
							control={form.control}
							name="schoolLga"
							placeholder="Local Government Area"
							options={getLgaOptions(schoolState)}
							required={true}
						/>
					)}
				</Form.Watch>
			</div>

			<SelectField
				control={form.control}
				name="currentClass"
				placeholder="Current Class"
				options={ClassOptions}
				required={true}
			/>

			<TextField
				control={form.control}
				name="classPositionLastTerm"
				placeholder="Position in Class (Last Term)"
				min={1}
				step={1}
				type="number"
				required={true}
			/>

			<FileUploadField
				control={form.control}
				name="lastResult"
				label="Upload Last School Result"
				required={true}
			/>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Program Participation</h2>

				<OptionQuestionField
					control={form.control}
					name="prevAfterschoolProgram"
					question="Has the student previously participated in an after-school program?"
					options={YesNoOptions}
					required={true}
				/>

				<TextAreaField
					control={form.control}
					name="reasonForJoining"
					label="Why does the student want to join the ASH program?"
					required={true}
				/>
			</section>
		</>
	);
}

function ParentGuardianInformationStepThree() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[2]["validator"]>>();
	const form = { control };

	return (
		<>
			<FormStepComponentSectionHeader title="Parent / Guardian Information" />

			<TextField
				control={form.control}
				name="fathersName"
				placeholder="Father's Name"
				required={true}
			/>

			<TextField
				control={form.control}
				name="fathersPhone"
				placeholder="Father's Phone Number"
				type="tel"
			/>

			<TextField
				control={form.control}
				name="fathersOccupation"
				placeholder="Father's Occupation"
				required={true}
			/>

			<TextField
				control={form.control}
				name="mothersName"
				placeholder="Mother's Name"
				required={true}
			/>

			<TextField
				control={form.control}
				name="mothersPhone"
				placeholder="Mother's Phone Number"
				type="tel"
				required={true}
			/>

			<TextField control={form.control} name="mothersOccupation" placeholder="Mother's Occupation" />

			<TextField
				control={form.control}
				name="guardianName"
				placeholder="Guardian Name ( If Applicable)"
			/>

			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[305px]" }}
				name="guardianRelationship"
				placeholder="Relationship to Student"
				options={AshGuardianRelationshipOptions}
			/>

			<TextField
				control={form.control}
				name="guardianPhone"
				placeholder="Guardian Phone Number"
				type="tel"
			/>

			<TextField control={form.control} name="guardianOccupation" placeholder="Guardian Occupation" />

			<SelectField
				control={form.control}
				classNames={{ trigger: "max-w-[390px]" }}
				name="householdIncomeRange"
				placeholder="Average Household Income Per Year"
				options={AshHouseholdIncomeRangeOptions}
			/>
		</>
	);
}

function WellbeingConsentStepFour() {
	const { control } = useFormContext<z.infer<(typeof stepItems)[3]["validator"]>>();
	const form = { control };

	return (
		<>
			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Student Well-Being (Brief Health Indicator)</h2>

				<OptionQuestionField
					control={form.control}
					name="hasLearningCondition"
					question="Does the student have any condition that may affect learning?"
					options={LearningConditionStatusOptions}
					required={true}
				/>

				<CheckboxQuestionField
					control={form.control}
					name="learningConditions"
					question="If yes, specify"
					options={AshLearningConditionOptions}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Consent & Program Agreement</h2>

				<p className="text-[12px] text-cedar-black/64 lg:text-[14px]">
					I hereby grant consent for my child to participate in the program and all related
					activities. I understand that they may be photographed or recorded during the program.
				</p>

				<Form.Field
					control={form.control}
					name="parentConsent"
					className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
				>
					<Form.FieldBoundController
						render={({ field }) => (
							<Checkbox
								id="program-agreement-accepted"
								checked={field.value}
								onCheckedChange={field.onChange}
								classNames={{
									base: `mt-[2px] size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
									bg-transparent lg:mt-[3px] data-checked:bg-transparent`,
									icon: "size-3",
								}}
							/>
						)}
					/>

					<Form.Label htmlFor="program-agreement-accepted">
						<p>By checking the box</p>
						<p>I agree to:</p>
						<p>
							the use of these images, recordings, and provided information by the organizers and
							their authorized representatives for communication, educational, promotional,
							reporting, and evaluation purposes, including on websites, social media, and print
							materials.
						</p>
						<p>
							I understand that all personal data will be handled confidentially and used
							responsibly
						</p>
					</Form.Label>
				</Form.Field>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Declaration</h2>

				<Form.Field
					control={form.control}
					name="declarationConfirmed"
					className="w-full flex-row items-start gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
				>
					<Form.FieldBoundController
						render={({ field }) => (
							<Checkbox
								id="declaration-confirmed"
								checked={field.value}
								onCheckedChange={field.onChange}
								classNames={{
									base: `mt-[2px] size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
									bg-transparent lg:mt-[3px] data-checked:bg-transparent`,
									icon: "size-3",
								}}
							/>
						)}
					/>

					<Form.Label htmlFor="declaration-confirmed">
						I confirm that the information provided in this registration form is true and accurate.
					</Form.Label>
				</Form.Field>

				<FileUploadField
					control={form.control}
					name="parentSignature"
					label="Upload a copy of parents signature and name"
					required={true}
				/>
			</section>

			<section className="flex flex-col gap-4 lg:gap-5">
				<h2 className="leading-[1.2] lg:text-[24px]">Official Use</h2>

				<TextField control={form.control} name="assignedMentor" placeholder="Mentor's Name" />
				<TextField
					control={form.control}
					name="pretestScore"
					placeholder="Pretest score"
					min={0}
					step={1}
					type="number"
				/>
			</section>
		</>
	);
}

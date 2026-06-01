"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { DistributivePick } from "@zayne-labs/toolkit-type-helpers";
import type { FieldValues } from "react-hook-form";
import { RadioGroupAnimated } from "@/components/animated/ui";
import * as DropZoneInput from "@/components/common/DropZoneInput";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Select } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import * as Combobox from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Form } from "@/components/ui/form";
import { cnMerge } from "@/lib/utils/cn";

type SharedFieldProps<
	TFieldValues extends FieldValues,
	TTransformedValues = TFieldValues,
> = DistributivePick<
	InferProps<typeof Form.Field<unknown, TFieldValues, TTransformedValues>>,
	"control" | "name"
> & {
	required?: boolean;
};

function FormRequiredIndicator(props: { required: boolean | undefined }) {
	const { required } = props;

	return (
		required && (
			<Form.Description className="ml-1 text-[13px] leading-0 text-red-600">*</Form.Description>
		)
	);
}

function FormErrorMessageShared(props: Pick<InferProps<typeof Form.ErrorMessage>, "errorField">) {
	const { errorField } = props;

	return <Form.ErrorMessage errorField={errorField} classNames={{ container: "-mt-2" }} />;
}

export function OptionQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		options: readonly string[];
		question: string;
	}
) {
	const { control, name, options, question, required } = props;

	return (
		<Form.Field
			control={control}
			name={name}
			className="gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
		>
			<FormRequiredIndicator required={required} />

			<p>{question}</p>

			<Form.FieldBoundController
				render={({ field, fieldContext }) => (
					<RadioGroupAnimated.Root
						value={field.value}
						onValueChange={field.onChange}
						className="flex flex-col gap-3"
					>
						<For
							each={options}
							renderItem={(option) => (
								<div key={option} className="flex w-fit items-center gap-3">
									<RadioGroupAnimated.Item
										id={`${fieldContext.formItemId}-${option}`}
										value={option}
										className="grid size-4 place-content-center rounded-full border-[1.5px]
											border-cedar-black/40"
									>
										<RadioGroupAnimated.Indicator className="size-2 rounded-full bg-cedar-red" />
									</RadioGroupAnimated.Item>

									<Form.Label htmlFor={`${fieldContext.formItemId}-${option}`}>
										{option}
									</Form.Label>
								</div>
							)}
						/>
					</RadioGroupAnimated.Root>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

const ratingValues = ["1", "2", "3", "4", "5"];

export function RatingQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		leftLabel: string;
		question: string;
		rightLabel: string;
	}
) {
	const { control, leftLabel, name, question, required, rightLabel } = props;

	return (
		<Form.Field control={control} name={name} className="text-[12px] text-cedar-black/64 lg:text-[14px]">
			<FormRequiredIndicator required={required} />

			<p>{question}</p>

			<Form.FieldBoundController
				render={({ field }) => (
					<Form.InputGroup className="mt-3 items-start justify-start gap-4">
						<Form.InputLeftItem className="mt-0.5 shrink-0">{leftLabel}</Form.InputLeftItem>

						<RadioGroupAnimated.Root
							value={field.value}
							onValueChange={field.onChange}
							className="flex gap-5"
						>
							<For
								each={ratingValues}
								renderItem={(rating) => {
									const id = `rating-${name}-${rating}`;

									return (
										<div key={rating} className="flex flex-col items-center">
											<RadioGroupAnimated.Item
												id={id}
												value={rating}
												className="grid size-4 place-content-center rounded-full border
													border-cedar-black/64"
											>
												<RadioGroupAnimated.Indicator
													className="size-2 rounded-full bg-cedar-red"
												/>
											</RadioGroupAnimated.Item>

											<Form.Label htmlFor={id}>{rating}</Form.Label>
										</div>
									);
								}}
							/>
						</RadioGroupAnimated.Root>

						<Form.InputRightItem className="mt-0.5 shrink-0">{rightLabel}</Form.InputRightItem>
					</Form.InputGroup>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function CheckboxQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		options: readonly string[];
		question: string;
	}
) {
	const { control, name, options, question, required } = props;

	return (
		<div className="flex flex-col gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]">
			<FormRequiredIndicator required={required} />

			<p>{question}</p>

			<ForWithWrapper
				className="flex flex-col gap-3"
				each={options}
				renderItem={(option, index) => (
					<Form.FieldWithController
						key={index}
						control={control}
						name={name}
						render={({ field, fieldContext, fieldProps }) => {
							const selectedItems = (field.value as string[] | undefined) ?? [];

							return (
								<li {...fieldProps} className="flex w-fit gap-3">
									<Checkbox
										id={fieldContext.formItemId}
										name={name}
										value={option}
										checked={selectedItems.includes(option)}
										onCheckedChange={(isChecked) => {
											isChecked ?
												field.onChange([...selectedItems, option])
											:	field.onChange(selectedItems.filter((item) => item !== option));
										}}
										classNames={{
											base: `mt-0.5 size-4 rounded-[4px] border-[1.5px] border-cedar-black/40
											bg-transparent data-checked:bg-transparent lg:mt-[3px]`,
											icon: "size-3",
										}}
									/>

									<Form.Label htmlFor={fieldContext.formItemId}>{option}</Form.Label>
								</li>
							);
						}}
					/>
				)}
			/>

			<FormErrorMessageShared errorField={name} />
		</div>
	);
}

export function TextField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: Pick<
		InferProps<typeof Form.InputPrimitive>,
		"inputMode" | "max" | "min" | "placeholder" | "step" | "type"
	>
		& SharedFieldProps<TFieldValues, TTransformedValues>
) {
	const { control, inputMode, max, min, name, placeholder, required, step, type = "text" } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<Form.Input
				inputMode={inputMode}
				max={max}
				min={min}
				step={step}
				type={type}
				placeholder={placeholder}
				className="h-[54px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[12px] text-cedar-black
					placeholder:text-cedar-black/40 lg:h-[64px] lg:text-[14px]"
			/>
			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function TextAreaField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		label: string;
	}
) {
	const { control, label, name, required } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<Form.Label className="text-[12px] text-cedar-black/64 lg:text-[14px]">{label}</Form.Label>

			<Form.TextArea
				className="min-h-[132px] rounded-[12px] bg-[hsl(0,0%,94%)] px-6 py-4 text-[12px]
					text-cedar-black placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
			/>
			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function SelectField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		classNames?: { trigger?: string };
		options: readonly string[];
		placeholder: string;
	}
) {
	const { classNames, control, name, options, placeholder, required } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<Form.FieldBoundController
				render={({ field }) => (
					<Select.Root value={field.value} onValueChange={field.onChange}>
						<Select.Trigger
							className={cnMerge(
								`h-[54px] justify-start gap-3 rounded-[12px] border-0 bg-[hsl(0,0%,94%)] px-9
								text-[12px] text-cedar-black shadow-none data-placeholder:text-cedar-black/40
								lg:h-[64px] lg:text-[14px]`,
								classNames?.trigger
							)}
						>
							<Select.Value placeholder={placeholder} />
						</Select.Trigger>

						<Select.Content className="border-0">
							<Select.Group>
								<For
									each={options}
									renderItem={(option) => (
										<Select.Item key={option} value={option}>
											{option}
										</Select.Item>
									)}
								/>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function ComboboxField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		disabled?: boolean;
		onValueChange?: (value: string) => void;
		options: readonly string[];
		placeholder: string;
	}
) {
	const { control, disabled, name, onValueChange, options, placeholder, required } = props;

	const data = options.map((option) => ({ label: option, value: option }));
	const type = placeholder.toLowerCase();

	return (
		<Form.Field control={control} name={name} className="w-full max-w-[285px] min-w-0">
			<FormRequiredIndicator required={required} />

			<Form.FieldBoundController
				render={({ field }) => {
					return (
						<Combobox.Root
							data={data}
							type={type}
							value={field.value}
							onValueChange={(value) => {
								field.onChange(value);
								onValueChange?.(value);
							}}
						>
							<Combobox.Trigger
								placeholder={placeholder}
								disabled={disabled}
								classNames={{
									base: `h-[54px] w-full shrink justify-start gap-3 rounded-[12px] border-0
									bg-[hsl(0,0%,94%)] px-4 text-[12px] text-cedar-black/70 shadow-none
									disabled:pointer-events-none disabled:opacity-60
									data-placeholder:text-cedar-black/40 lg:h-[64px] lg:px-9 lg:text-[14px]`,
									icon: "size-4 shrink-0 text-cedar-black/40",
								}}
							/>

							<Combobox.Content>
								<Combobox.Input />

								<Combobox.List>
									<Combobox.Empty />

									<Combobox.Group>
										<For
											each={data}
											renderItem={(item) => (
												<Combobox.Item key={item.value} value={item.value}>
													{item.label}
												</Combobox.Item>
											)}
										/>
									</Combobox.Group>
								</Combobox.List>
							</Combobox.Content>
						</Combobox.Root>
					);
				}}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function DateField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		placeholder: string;
	}
) {
	const { control, name, placeholder, required } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<Form.FieldBoundController
				render={({ field }) => (
					<DateTimePicker
						dateString={field.value}
						onDateStringChange={field.onChange}
						placeholder={placeholder}
						dateFormats={{
							onChangeDate: "yyyy-MM-dd",
							visibleDate: "PPP",
						}}
						className="h-[54px] justify-between rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[12px]
							font-normal text-cedar-black/70 placeholder:text-cedar-black/40 lg:h-[64px] lg:px-9
							lg:text-[14px]"
					/>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function FileUploadField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		label: string;
	}
) {
	const { control, label, name, required } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<div className="flex items-center justify-between gap-4">
				<Form.Label className="text-[12px] text-cedar-black/80 lg:text-[14px]">{label}</Form.Label>

				<Form.FieldBoundController
					render={({ field }) => (
						<DropZoneInput.Root
							allowedFileTypes={["image/*"]}
							maxFileCount={1}
							multiple={false}
							onChange={field.onChange}
						>
							<DropZoneInput.Area
								classNames={{
									container: `h-[96px] w-[135px] cursor-pointer rounded-[12px] bg-[hsl(0,0%,94%)]
									text-cedar-black/64 transition-colors data-drag-over:bg-cedar-red/10
									lg:w-[142px]`,
								}}
								extraProps={{
									input: {
										accept: "image/*",
									},
								}}
							>
								<IconBox icon="solar:gallery-outline" className="size-6" />
							</DropZoneInput.Area>
						</DropZoneInput.Root>
					)}
				/>
			</div>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

"use client";

import { tw } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isString, type DistributiveOmit, type DistributivePick } from "@zayne-labs/toolkit-type-helpers";
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
			<Form.Description
				className="mt-2 -mb-1 ml-0.5 text-[14px] tracking-tight text-red-500 lg:text-[13px]"
			>
				*
			</Form.Description>
		)
	);
}

export function FormErrorMessageShared(
	props: DistributiveOmit<InferProps<typeof Form.ErrorMessage>, "className" | "classNames">
) {
	return <Form.ErrorMessage scrollToErrorOffset={150} {...props} classNames={{ container: "-mt-2" }} />;
}

export function OptionQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		options: readonly SharedOption[];
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
							renderItem={(option) => {
								const optionData = getSharedOptionData(option);

								return (
									<div key={optionData.value} className="flex w-fit items-center gap-3">
										<RadioGroupAnimated.Item
											id={`${fieldContext.formItemId}-${optionData.value}`}
											value={optionData.value}
											className="grid size-4 place-content-center rounded-full border-[1.5px]
												border-cedar-black/40"
										>
											<RadioGroupAnimated.Indicator className="size-2 rounded-full bg-cedar-red" />
										</RadioGroupAnimated.Item>

										<Form.Label htmlFor={`${fieldContext.formItemId}-${optionData.value}`}>
											{optionData.label}
										</Form.Label>
									</div>
								);
							}}
						/>
					</RadioGroupAnimated.Root>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function RatingQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		leftLabel: string;
		maxRating?: number;
		question: string;
		rightLabel: string;
	}
) {
	const { control, leftLabel, maxRating = 5, name, question, required, rightLabel } = props;

	const ratingValues = [...Array(maxRating).keys()].map((index) => String(index + 1));

	return (
		<Form.Field control={control} name={name} className="text-[12px] text-cedar-black/64 lg:text-[14px]">
			<FormRequiredIndicator required={required} />

			<p>{question}</p>

			<Form.FieldBoundController
				render={({ field, fieldContext }) => (
					<Form.InputGroup className="mt-3 items-start justify-start gap-4">
						<Form.InputGroupAddon className="mt-0.5 shrink-0">{leftLabel}</Form.InputGroupAddon>

						<RadioGroupAnimated.Root
							value={field.value}
							onValueChange={field.onChange}
							className="flex gap-5"
						>
							<For
								each={ratingValues}
								renderItem={(rating) => (
									<div key={rating} className="flex flex-col items-center">
										<RadioGroupAnimated.Item
											id={`${fieldContext.formItemId}-${rating}`}
											value={rating}
											className="grid size-4 place-content-center rounded-full border
												border-cedar-black/64"
										>
											<RadioGroupAnimated.Indicator className="size-2 rounded-full bg-cedar-red" />
										</RadioGroupAnimated.Item>

										<Form.Label htmlFor={`${fieldContext.formItemId}-${rating}`}>
											{rating}
										</Form.Label>
									</div>
								)}
							/>
						</RadioGroupAnimated.Root>

						<Form.InputGroupAddon className="mt-0.5 shrink-0">{rightLabel}</Form.InputGroupAddon>
					</Form.InputGroup>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

type SharedOption = string | { label: string; value: string };

const getSharedOptionData = (option: SharedOption) => {
	return isString(option) ? { label: option, value: option } : option;
};

export function CheckboxQuestionField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		options: readonly SharedOption[];
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
							const optionData = getSharedOptionData(option);

							return (
								<li {...fieldProps} className="flex w-fit gap-3">
									<Checkbox
										id={fieldContext.formItemId}
										name={name}
										value={optionData.value}
										checked={selectedItems.includes(optionData.value)}
										onCheckedChange={(isChecked) => {
											isChecked ?
												field.onChange([...selectedItems, optionData.value])
											:	field.onChange(
													selectedItems.filter((item) => item !== optionData.value)
												);
										}}
										classNames={{
											base: `mt-0.5 size-4 border-[1.5px] border-cedar-black/40 bg-transparent
											lg:mt-[3px] data-checked:border-cedar-black/40 data-checked:bg-transparent
											data-checked:text-cedar-black/64`,
											icon: "size-3",
										}}
									/>

									<Form.Label>{optionData.label}</Form.Label>
								</li>
							);
						}}
					/>
				)}
			/>

			<FormErrorMessageShared name={name} />
		</div>
	);
}

export function AgreementField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		description?: string;
		label: string;
		title?: string;
	}
) {
	const { control, description, label, name, required, title } = props;

	return (
		<>
			{title && <h2 className="leading-[1.2] lg:text-[24px]">{title}</h2>}
			{description && <p className="text-[12px] text-cedar-black/64 lg:text-[14px]">{description}</p>}

			<Form.Field
				control={control}
				name={name}
				className="w-full text-[12px] text-cedar-black/64 lg:text-[14px]"
			>
				<FormRequiredIndicator required={required} />

				<div className="flex items-start gap-3">
					<Form.FieldBoundController
						render={({ field, fieldContext }) => (
							<Checkbox
								id={fieldContext.formItemId}
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
					<Form.Label>{label}</Form.Label>
				</div>

				<FormErrorMessageShared />
			</Form.Field>
		</>
	);
}

function FormLabelShared(props: { className?: string; label: string | undefined }) {
	const { className, label } = props;

	return (
		label && (
			<Form.Label className={cnMerge("text-[12px] text-cedar-black/64 lg:text-[14px]", className)}>
				{label}
			</Form.Label>
		)
	);
}

export function TextField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: Pick<
		InferProps<typeof Form.InputPrimitive>,
		"inputMode" | "max" | "min" | "placeholder" | "step" | "type"
	>
		& SharedFieldProps<TFieldValues, TTransformedValues> & {
			classNames?: {
				base?: string;
				input?: string;
				inputGroup?: string;
				label?: string;
			};
			label?: string;
		}
) {
	const {
		classNames,
		control,
		inputMode,
		label,
		max,
		min,
		name,
		placeholder,
		required,
		step,
		type = "text",
	} = props;

	const inputClassName = tw`h-[54px] rounded-[12px] bg-cedar-grey px-6 text-[12px] text-cedar-black
	placeholder:text-cedar-black/40 lg:h-[64px] lg:px-9 lg:text-[14px]`;

	return (
		<Form.Field control={control} name={name} className={classNames?.base}>
			<FormRequiredIndicator required={required} />

			<FormLabelShared label={label} className={classNames?.label} />

			<Form.Input
				inputMode={inputMode}
				max={max}
				min={min}
				step={step}
				type={type}
				placeholder={placeholder}
				classNames={{
					input: cnMerge(
						type === "password" ? "placeholder:text-cedar-black/40" : inputClassName,
						classNames?.input
					),
					inputGroup: cnMerge(type === "password" && inputClassName, classNames?.inputGroup),
				}}
			/>
			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function TextAreaField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: Pick<InferProps<typeof Form.TextArea>, "placeholder">
		& SharedFieldProps<TFieldValues, TTransformedValues> & {
			classNames?: {
				base?: string;
				label?: string;
				textArea?: string;
			};
			label: string;
		}
) {
	const { classNames, control, label, name, placeholder, required } = props;

	return (
		<Form.Field control={control} name={name} className={classNames?.base}>
			<FormRequiredIndicator required={required} />

			<FormLabelShared label={label} className={classNames?.label} />

			<Form.TextArea
				placeholder={placeholder}
				className={cnMerge(
					`min-h-[132px] rounded-[12px] bg-cedar-grey px-6 py-4 text-[12px] text-cedar-black
					placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]`,
					classNames?.textArea
				)}
			/>
			<FormErrorMessageShared />
		</Form.Field>
	);
}

export function SelectField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: SharedFieldProps<TFieldValues, TTransformedValues> & {
		classNames?: { base?: string; item?: string; trigger?: string };
		label?: string;
		options: readonly SharedOption[];
		placeholder: string;
	}
) {
	const { classNames, control, label, name, options, placeholder, required } = props;

	return (
		<Form.Field control={control} name={name} className={classNames?.base}>
			<FormRequiredIndicator required={required} />

			<FormLabelShared label={label} />

			<Form.FieldBoundController
				render={({ field }) => (
					<Select.Root value={field.value} onValueChange={field.onChange}>
						<Select.Trigger
							className={cnMerge(
								`h-[54px] justify-start gap-3 rounded-[12px] border-0 bg-cedar-grey px-9
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
									renderItem={(option) => {
										const optionData = getSharedOptionData(option);

										return (
											<Select.Item
												key={optionData.value}
												value={optionData.value}
												className={classNames?.item}
											>
												{optionData.label}
											</Select.Item>
										);
									}}
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
									bg-cedar-grey px-4 text-[12px] text-cedar-black/70 shadow-none
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
		classNames?: {
			base?: string;
			dateTimePicker?: string;
			label?: string;
		};
		label?: string;
		placeholder: string;
	}
) {
	const { classNames, control, label, name, placeholder, required } = props;

	return (
		<Form.Field control={control} name={name} className={classNames?.base}>
			<FormRequiredIndicator required={required} />

			<FormLabelShared label={label} className={classNames?.label} />

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
						className={cnMerge(
							`h-[54px] justify-between rounded-[12px] bg-cedar-grey px-9 text-[12px] font-normal
							text-cedar-black/70 placeholder:text-cedar-black/40 lg:h-[64px] lg:px-9
							lg:text-[14px]`,
							classNames?.dateTimePicker
						)}
					/>
				)}
			/>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

const defaultAllowedFileTypes = [".png", ".jpg", ".jpeg", ".webp"];

export function FileUploadField<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: Pick<InferProps<typeof DropZoneInput.Root>, "allowedFileTypes">
		& SharedFieldProps<TFieldValues, TTransformedValues> & {
			label: string;
		}
) {
	const { allowedFileTypes = defaultAllowedFileTypes, control, label, name, required } = props;

	return (
		<Form.Field control={control} name={name}>
			<FormRequiredIndicator required={required} />

			<div className="flex items-center justify-between gap-4">
				<FormLabelShared label={label} />

				<Form.FieldBoundController
					render={({ field }) => (
						<DropZoneInput.Root
							allowedFileTypes={allowedFileTypes}
							maxFileCount={1}
							multiple={false}
							onChange={field.onChange}
						>
							<DropZoneInput.Area
								classNames={{
									container: `h-[96px] w-[135px] cursor-pointer rounded-[12px] bg-cedar-grey
									text-cedar-black/64 transition-colors data-drag-over:bg-cedar-red/10
									lg:w-[142px]`,
								}}
							>
								<IconBox icon="solar:gallery-outline" className="size-6" />
							</DropZoneInput.Area>

							<DropZoneInput.ImagePreview classNames={{ listContainer: "max-w-[300px]" }} />
						</DropZoneInput.Root>
					)}
				/>
			</div>

			<FormErrorMessageShared />
		</Form.Field>
	);
}

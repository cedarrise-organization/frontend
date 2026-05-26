"use client";

import { Steps } from "@ark-ui/react/steps";
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
import { cnJoin, cnMerge } from "@/lib/utils/cn";

export function StepperList(props: { items: ReadonlyArray<{ title: string }> }) {
	const { items } = props;

	return (
		<Steps.List className="flex justify-center px-[60px]">
			<For
				each={items}
				renderItem={(item, index) => (
					<Steps.Item
						key={item.title}
						index={index}
						className={cnJoin("flex items-center", index !== 0 && "w-full")}
					>
						{index !== 0 && (
							<Steps.Separator className="h-0.5 w-full bg-cedar-red/40 data-current:bg-cedar-red" />
						)}

						<Steps.Trigger
							className="grid size-4 place-content-center rounded-full outline-none lg:size-6"
						>
							<Steps.Indicator
								className="size-4 rounded-full border-2 border-cedar-red bg-cedar-white
									data-complete:bg-cedar-red/40 data-current:bg-cedar-red lg:size-6"
							/>
						</Steps.Trigger>
					</Steps.Item>
				)}
			/>
		</Steps.List>
	);
}

export function OptionQuestionField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>> & {
		options: string[];
		question: string;
	}
) {
	const { control, name, options, question } = props;

	return (
		<Form.Field
			control={control}
			name={name}
			className="gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]"
		>
			<p>{question}</p>

			<Form.FieldBoundController
				render={({ field }) => (
					<RadioGroupAnimated.Root
						value={field.value}
						onValueChange={field.onChange}
						className="flex flex-col gap-3"
					>
						<For
							each={options}
							renderItem={(option) => {
								const id = `radio-${name}-${option}`;
								return (
									<div key={option} className="flex w-fit items-center gap-3">
										<RadioGroupAnimated.Item
											id={id}
											value={option}
											className="grid size-4 place-content-center rounded-full border-[1.5px]
												border-cedar-black/40"
										>
											<RadioGroupAnimated.Indicator className="size-2 rounded-full bg-cedar-red" />
										</RadioGroupAnimated.Item>

										<Form.Label htmlFor={id}>{option}</Form.Label>
									</div>
								);
							}}
						/>
					</RadioGroupAnimated.Root>
				)}
			/>
		</Form.Field>
	);
}

const ratingValues = ["1", "2", "3", "4", "5"];

export function RatingQuestionField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>> & {
		leftLabel: string;
		question: string;
		rightLabel: string;
	}
) {
	const { control, leftLabel, name, question, rightLabel } = props;

	return (
		<Form.Field
			control={control}
			name={name}
			className="gap-5 text-[12px] text-cedar-black/64 lg:text-[14px]"
		>
			<p>{question}</p>

			<Form.FieldBoundController
				render={({ field }) => (
					<Form.InputGroup className="items-start justify-start gap-4">
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
		</Form.Field>
	);
}

export function CheckboxQuestionField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>> & {
		options: string[];
		question?: string;
	}
) {
	const { control, name, options, question } = props;

	return (
		<div className="flex flex-col gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]">
			{question && <p>{question}</p>}

			<ForWithWrapper
				as="article"
				className="flex flex-col gap-3"
				each={options}
				renderItem={(option, index) => {
					const id = `checkbox-${name}-${option}-${index}`;

					return (
						<Form.Field
							key={id}
							control={control}
							name={`${name}.${index}` as never}
							className="w-fit flex-row gap-3"
						>
							<Form.FieldBoundController
								render={({ field }) => (
									<Checkbox
										id={id}
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

							<Form.Label htmlFor={id}>{option}</Form.Label>
						</Form.Field>
					);
				}}
			/>
		</div>
	);
}

export function TextField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>>
		& Pick<
			InferProps<typeof Form.InputPrimitive>,
			"inputMode" | "max" | "min" | "placeholder" | "step" | "type"
		>
) {
	const { control, inputMode, max, min, name, placeholder, step, type = "text" } = props;

	return (
		<Form.Field control={control} name={name}>
			<Form.Input
				inputMode={inputMode}
				max={max}
				min={min}
				step={step}
				type={type}
				placeholder={placeholder}
				className="h-[54px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[12px]
					placeholder:text-cedar-black/40 lg:h-[64px] lg:text-[14px]"
			/>
		</Form.Field>
	);
}

export function TextAreaField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>> & {
		label: string;
	}
) {
	const { control, label, name } = props;

	return (
		<Form.Field control={control} name={name}>
			<Form.Label className="text-[12px] text-cedar-black/64 lg:text-[14px]">{label}</Form.Label>
			<Form.TextArea
				className="min-h-[132px] rounded-[12px] bg-[hsl(0,0%,94%)] px-6 py-4 text-[12px]
					placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
			/>
		</Form.Field>
	);
}

export function SelectField<TFieldValues extends FieldValues>(
	props: DistributivePick<InferProps<typeof Form.Field<unknown, TFieldValues>>, "control" | "name"> & {
		classNames?: { trigger?: string };
		options: string[];
		placeholder: string;
	}
) {
	const { classNames, control, name, options, placeholder } = props;

	return (
		<Form.Field control={control} name={name}>
			<Form.FieldBoundController
				render={({ field }) => (
					<Select.Root value={field.value} onValueChange={field.onChange}>
						<Select.Trigger
							className={cnMerge(
								`h-[54px] justify-start gap-3 rounded-[12px] border-0 bg-[hsl(0,0%,94%)] px-9
								text-[12px] text-cedar-black/70 shadow-none data-placeholder:text-cedar-black/40
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
		</Form.Field>
	);
}

export function ComboboxField<TFieldValues extends FieldValues>(
	props: DistributivePick<InferProps<typeof Form.Field<unknown, TFieldValues>>, "control" | "name"> & {
		classNames?: { trigger?: string };
		disabled?: boolean;
		onValueChange?: (value: string) => void;
		options: string[];
		placeholder: string;
		type: string;
	}
) {
	const { classNames, control, disabled, name, onValueChange, options, placeholder, type } = props;

	const data = options.map((option) => ({ label: option, value: option }));

	return (
		<Form.Field control={control} name={name} className="w-full max-w-[285px]">
			<Form.FieldBoundController
				render={({ field }) => {
					return (
						<Combobox.Root
							data={data}
							value={field.value}
							onValueChange={(value) => {
								field.onChange(value);
								onValueChange?.(value);
							}}
							type={type}
						>
							<Combobox.Trigger
								placeholder={placeholder}
								disabled={disabled}
								classNames={{
									base: cnMerge(
										`h-[54px] justify-start gap-3 rounded-[12px] border-0 bg-[hsl(0,0%,94%)] px-9
										text-[12px] text-cedar-black/70 shadow-none disabled:pointer-events-none
										disabled:opacity-60 data-placeholder:text-cedar-black/40 lg:h-[64px]
										lg:text-[14px]`,
										classNames?.trigger
									),
									icon: "size-4 shrink-0 text-cedar-black/40",
								}}
							/>

							<Combobox.Content>
								<Combobox.Input placeholder={`Search ${type}...`} />
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
		</Form.Field>
	);
}

export function DateField<TFieldValues extends FieldValues>(
	props: DistributivePick<InferProps<typeof Form.Field<unknown, TFieldValues>>, "control" | "name"> & {
		placeholder: string;
	}
) {
	const { control, name, placeholder } = props;

	return (
		<Form.FieldWithController
			control={control}
			name={name}
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
	);
}

export function FileUploadField<TFieldValues extends FieldValues>(
	props: DistributivePick<InferProps<typeof Form.Field<unknown, TFieldValues>>, "control" | "name"> & {
		label: string;
	}
) {
	const { control, label, name } = props;

	return (
		<Form.Field control={control} name={name} className="flex-row items-center justify-between gap-4">
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
								text-cedar-black/64 transition-colors data-drag-over:bg-cedar-red/10 lg:w-[142px]`,
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
		</Form.Field>
	);
}

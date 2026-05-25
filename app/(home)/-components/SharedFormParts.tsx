"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { DistributivePick } from "@zayne-labs/toolkit-type-helpers";
import type { FieldValues } from "react-hook-form";
import { RadioGroupAnimated } from "@/components/animated/ui";
import { For } from "@/components/common/for";
import { Select } from "@/components/ui";
import { Form } from "@/components/ui/form";
import { cnMerge } from "@/lib/utils/cn";

export function OptionQuestionField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>> & {
		options: string[];
		question: string;
	}
) {
	const { control, name, options, question } = props;

	return (
		<Form.Field control={control} name={name}>
			<Form.FieldBoundController
				render={({ field }) => (
					<div className="flex flex-col gap-3 text-[12px] text-cedar-black/64 lg:text-[14px]">
						<p>{question}</p>

						<RadioGroupAnimated.Root
							value={field.value}
							onValueChange={field.onChange}
							className="flex flex-col gap-3"
						>
							<For
								each={options}
								renderItem={(option) => (
									<Form.Label
										key={option}
										htmlFor={option}
										className="flex w-fit items-center gap-3"
									>
										<RadioGroupAnimated.Item
											id={option}
											value={option}
											className="grid size-4 place-content-center rounded-[3px] border-[1.5px]
												border-cedar-black/40"
										>
											<RadioGroupAnimated.Indicator
												className="size-2 rounded-[2px] bg-cedar-red"
											/>
										</RadioGroupAnimated.Item>

										<p>{option}</p>
									</Form.Label>
								)}
							/>
						</RadioGroupAnimated.Root>
					</div>
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
		<Form.Field control={control} name={name}>
			<Form.FieldBoundController
				render={({ field }) => (
					<div className="flex flex-col gap-5 text-[12px] text-cedar-black/64 lg:text-[14px]">
						<p>{question}</p>

						<Form.InputGroup className="items-start gap-2 lg:gap-4">
							<Form.InputLeftItem className="shrink-0">{leftLabel}</Form.InputLeftItem>

							<RadioGroupAnimated.Root
								value={field.value}
								onValueChange={field.onChange}
								className="flex gap-5"
							>
								<For
									each={ratingValues}
									renderItem={(rating) => (
										<Form.Label
											key={rating}
											htmlFor={rating}
											className="flex flex-col items-center"
										>
											<RadioGroupAnimated.Item
												id={rating}
												value={rating}
												className="grid size-4 place-content-center rounded-full border
													border-cedar-black/64"
											>
												<RadioGroupAnimated.Indicator
													className="size-2 rounded-full bg-cedar-red"
												/>
											</RadioGroupAnimated.Item>

											<p>{rating}</p>
										</Form.Label>
									)}
								/>
							</RadioGroupAnimated.Root>

							<Form.InputRightItem className="shrink-0">{rightLabel}</Form.InputRightItem>
						</Form.InputGroup>
					</div>
				)}
			/>
		</Form.Field>
	);
}

export function TextField<TFieldValues extends FieldValues>(
	props: InferProps<typeof Form.Field<unknown, TFieldValues>>
		& Pick<InferProps<typeof Form.InputPrimitive>, "inputMode" | "placeholder" | "type">
) {
	const { control, inputMode, name, placeholder, type = "text" } = props;

	return (
		<Form.Field control={control} name={name}>
			<Form.Input
				inputMode={inputMode}
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
			<Form.Label className="text-[12px]/[1.2] text-cedar-black/64 lg:text-[14px]">{label}</Form.Label>
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
								`h-[54px] justify-start rounded-[12px] border-0 bg-[hsl(0,0%,94%)] px-9 text-[12px]
								text-cedar-black/70 shadow-none data-placeholder:text-cedar-black/40 lg:h-[64px]
								lg:text-[14px]`,
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

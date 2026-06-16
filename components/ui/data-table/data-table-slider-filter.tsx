"use client";

import type { Column } from "@tanstack/react-table";
import { useCallback, useId, useMemo } from "react";
import { IconBox } from "@/components/common/IconBox";
import { Form } from "@/components/ui/form";
import { cnMerge } from "@/lib/utils/cn";
import { shadcnButtonVariants } from "../constants";
import * as Popover from "../popover";
import { Separator } from "../separator";

type Range = {
	max: number;
	min: number;
};

type RangeValue = [number, number];

function getIsValidRange(value: unknown): value is RangeValue {
	return (
		Array.isArray(value)
		&& value.length === 2
		&& typeof value[0] === "number"
		&& typeof value[1] === "number"
	);
}

function parseValuesAsNumbers(value: unknown): RangeValue | undefined {
	if (
		Array.isArray(value)
		&& value.length === 2
		&& value.every(
			(item) => (typeof item === "string" || typeof item === "number") && !Number.isNaN(item)
		)
	) {
		return [Number(value[0]), Number(value[1])];
	}

	return undefined;
}

type DataTableSliderFilterProps<TData> = {
	column: Column<TData>;
	title?: string;
};

export function DataTableSliderFilter<TData>({ column, title }: DataTableSliderFilterProps<TData>) {
	const id = useId();

	const columnFilterValue = parseValuesAsNumbers(column.getFilterValue());

	const defaultRange = column.columnDef.meta?.range;
	const unit = column.columnDef.meta?.unit;

	const { max, min, step } = useMemo<Range & { step: number }>(() => {
		let minValue = 0;
		let maxValue = 100;

		if (getIsValidRange(defaultRange)) {
			[minValue, maxValue] = defaultRange;
		} else {
			const values = column.getFacetedMinMaxValues();
			const [facetMinValue, facetMaxValue] = Array.isArray(values) ? values : [];

			if (typeof facetMinValue === "number" && typeof facetMaxValue === "number") {
				minValue = facetMinValue;
				maxValue = facetMaxValue;
			}
		}

		const rangeSize = maxValue - minValue;
		let stepValue = Math.ceil(rangeSize / 50);

		if (rangeSize <= 20) {
			stepValue = 1;
		} else if (rangeSize <= 100) {
			stepValue = Math.ceil(rangeSize / 20);
		}

		return { max: maxValue, min: minValue, step: stepValue };
	}, [column, defaultRange]);

	const range = useMemo((): RangeValue => {
		return columnFilterValue ?? [min, max];
	}, [columnFilterValue, min, max]);

	const formatValue = useCallback((value: number) => {
		return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
	}, []);

	const onFromInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const numValue = Number(event.target.value);
			if (!Number.isNaN(numValue) && numValue >= min && numValue <= range[1]) {
				column.setFilterValue([numValue, range[1]]);
			}
		},
		[column, min, range]
	);

	const onToInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const numValue = Number(event.target.value);
			if (!Number.isNaN(numValue) && numValue <= max && numValue >= range[0]) {
				column.setFilterValue([range[0], numValue]);
			}
		},
		[column, max, range]
	);

	const onSliderValueChange = useCallback(
		(value: RangeValue) => {
			column.setFilterValue(value);
		},
		[column]
	);

	const onReset = useCallback(
		(event: React.MouseEvent) => {
			if (event.target instanceof HTMLDivElement) {
				event.stopPropagation();
			}
			column.setFilterValue(undefined);
		},
		[column]
	);

	return (
		<Popover.Root>
			<Popover.Trigger asChild={true}>
				<button
					type="button"
					className={cnMerge(
						shadcnButtonVariants({ size: "sm", variant: "outline" }),
						"border-dashed font-normal"
					)}
				>
					{columnFilterValue ?
						<div
							role="button"
							aria-label={`Clear ${title} filter`}
							tabIndex={0}
							className="rounded-sm opacity-70 transition-opacity hover:opacity-100
								focus-visible:ring-1 focus-visible:ring-shadcn-ring focus-visible:outline-none"
							onClick={onReset}
						>
							<IconBox icon="lucide:x-circle" />
						</div>
					:	<IconBox icon="lucide:plus-circle" />}
					<span>{title}</span>
					{columnFilterValue ?
						<>
							<Separator
								orientation="vertical"
								className="mx-0.5 data-[orientation=vertical]:h-4"
							/>
							{formatValue(columnFilterValue[0])} - {formatValue(columnFilterValue[1])}
							{unit ? ` ${unit}` : ""}
						</>
					:	null}
				</button>
			</Popover.Trigger>
			<Popover.Content align="start" className="flex w-auto flex-col gap-4">
				<div className="flex flex-col gap-3">
					<p
						className="leading-none font-medium peer-disabled:cursor-not-allowed
							peer-disabled:opacity-70"
					>
						{title}
					</p>
					<div className="flex items-center gap-4">
						<Form.Field name="from" className="contents">
							<Form.Label className="sr-only">From</Form.Label>
							<div className="relative">
								<Form.InputPrimitive
									type="number"
									aria-valuemin={min}
									aria-valuemax={max}
									inputMode="numeric"
									pattern="[0-9]*"
									placeholder={min.toString()}
									min={min}
									max={max}
									value={range[0].toString()}
									onChange={onFromInputChange}
									className={cnMerge(
										`h-8 w-24 rounded-md border border-shadcn-input bg-transparent px-3 py-1
										text-sm shadow-xs transition-[color,box-shadow] outline-none
										focus-visible:border-shadcn-ring focus-visible:ring-[3px]
										focus-visible:ring-shadcn-ring/50 disabled:cursor-not-allowed
										disabled:opacity-50`,
										unit && "pr-8"
									)}
								/>
								{unit && (
									<span
										className="absolute inset-y-0 right-0 flex items-center rounded-r-md
											bg-shadcn-accent px-2 text-sm text-shadcn-muted-foreground"
									>
										{unit}
									</span>
								)}
							</div>
						</Form.Field>
						<Form.Field name="to" className="contents">
							<Form.Label className="sr-only">to</Form.Label>
							<div className="relative">
								<Form.InputPrimitive
									type="number"
									aria-valuemin={min}
									aria-valuemax={max}
									inputMode="numeric"
									pattern="[0-9]*"
									placeholder={max.toString()}
									min={min}
									max={max}
									value={range[1].toString()}
									onChange={onToInputChange}
									className={cnMerge(
										`h-8 w-24 rounded-md border border-shadcn-input bg-transparent px-3 py-1
										text-sm shadow-xs transition-[color,box-shadow] outline-none
										focus-visible:border-shadcn-ring focus-visible:ring-[3px]
										focus-visible:ring-shadcn-ring/50 disabled:cursor-not-allowed
										disabled:opacity-50`,
										unit && "pr-8"
									)}
								/>
								{unit && (
									<span
										className="absolute inset-y-0 right-0 flex items-center rounded-r-md
											bg-shadcn-accent px-2 text-sm text-shadcn-muted-foreground"
									>
										{unit}
									</span>
								)}
							</div>
						</Form.Field>
					</div>
					<Form.Label htmlFor={`${id}-slider-from`} className="sr-only">
						{title} slider
					</Form.Label>
					<div className="flex flex-col gap-2">
						<input
							id={`${id}-slider-from`}
							type="range"
							min={min}
							max={max}
							step={step}
							value={range[0]}
							onChange={(event) => onSliderValueChange([Number(event.target.value), range[1]])}
						/>
						<input
							type="range"
							min={min}
							max={max}
							step={step}
							value={range[1]}
							onChange={(event) => onSliderValueChange([range[0], Number(event.target.value)])}
						/>
					</div>
				</div>
				<button
					type="button"
					aria-label={`Clear ${title} filter`}
					className={cnMerge(shadcnButtonVariants({ size: "sm", variant: "outline" }))}
					onClick={onReset}
				>
					Clear
				</button>
			</Popover.Content>
		</Popover.Root>
	);
}

"use client";

import type { DateRange } from "@daypicker/react";
import type { Column } from "@tanstack/react-table";
import { isObject } from "@zayne-labs/toolkit-type-helpers";
import { useCallback, useMemo } from "react";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import { Calendar } from "../calender";
import { shadcnButtonVariants } from "../constants";
import * as Popover from "../popover";
import { Separator } from "../separator";
import { formatDate } from "./data-table-format";

type DateSelection = Date[] | DateRange;

function getIsDateRange(value: DateSelection): value is DateRange {
	return isObject(value) && !Array.isArray(value);
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
	if (!timestamp) return undefined;
	const numericTimestamp = typeof timestamp === "string" ? Number(timestamp) : timestamp;
	const date = new Date(numericTimestamp);
	return !Number.isNaN(date.getTime()) ? date : undefined;
}

function parseColumnFilterValue(value: unknown) {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.map((item) => {
			if (typeof item === "number" || typeof item === "string") {
				return item;
			}

			// eslint-disable-next-line unicorn/no-useless-undefined
			return undefined;
		});
	}

	if (typeof value === "string" || typeof value === "number") {
		return [value];
	}

	return [];
}

type DataTableDateFilterProps<TData> = {
	column: Column<TData>;
	multiple?: boolean;
	title?: string;
};

export function DataTableDateFilter<TData>({ column, multiple, title }: DataTableDateFilterProps<TData>) {
	const columnFilterValue = column.getFilterValue();

	const selectedDates = useMemo<DateSelection>(() => {
		if (!columnFilterValue) {
			return multiple ? { from: undefined, to: undefined } : [];
		}

		if (multiple) {
			const timestamps = parseColumnFilterValue(columnFilterValue);
			return {
				from: parseAsDate(timestamps[0]),
				to: parseAsDate(timestamps[1]),
			};
		}

		const timestamps = parseColumnFilterValue(columnFilterValue);
		const date = parseAsDate(timestamps[0]);
		return date ? [date] : [];
	}, [columnFilterValue, multiple]);

	const onSelect = useCallback(
		(date: Date | DateRange | undefined) => {
			if (!date) {
				column.setFilterValue(undefined);
				return;
			}

			if (multiple && !("getTime" in date)) {
				const from = date.from?.getTime();
				const to = date.to?.getTime();
				column.setFilterValue(from !== undefined || to !== undefined ? [from, to] : undefined);
			} else if (!multiple && "getTime" in date) {
				column.setFilterValue(date.getTime());
			}
		},
		[column, multiple]
	);

	const onReset = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			column.setFilterValue(undefined);
		},
		[column]
	);

	const hasValue = useMemo(() => {
		if (multiple) {
			if (!getIsDateRange(selectedDates)) return false;
			return selectedDates.from ?? selectedDates.to;
		}
		if (!Array.isArray(selectedDates)) return false;
		return selectedDates.length > 0;
	}, [multiple, selectedDates]);

	const formatDateRange = useCallback((range: DateRange) => {
		if (!range.from && !range.to) return "";
		if (range.from && range.to) {
			return `${formatDate(range.from)} - ${formatDate(range.to)}`;
		}
		return formatDate(range.from ?? range.to);
	}, []);

	const label = useMemo(() => {
		if (multiple) {
			if (!getIsDateRange(selectedDates)) return null;

			const hasSelectedDates = selectedDates.from ?? selectedDates.to;
			const dateText = hasSelectedDates ? formatDateRange(selectedDates) : "Select date range";

			return (
				<span className="flex items-center gap-2">
					<span>{title}</span>
					{hasSelectedDates && (
						<>
							<Separator
								orientation="vertical"
								className="mx-0.5 data-[orientation=vertical]:h-4"
							/>
							<span>{dateText}</span>
						</>
					)}
				</span>
			);
		}

		if (getIsDateRange(selectedDates)) return null;

		const hasSelectedDate = selectedDates.length > 0;
		const dateText = hasSelectedDate ? formatDate(selectedDates[0]) : "Select date";

		return (
			<span className="flex items-center gap-2">
				<span>{title}</span>
				{hasSelectedDate && (
					<>
						<Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
						<span>{dateText}</span>
					</>
				)}
			</span>
		);
	}, [selectedDates, multiple, formatDateRange, title]);

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
					{hasValue ?
						<div
							role="button"
							aria-label={`Clear ${title} filter`}
							tabIndex={0}
							onClick={onReset}
							className="rounded-sm opacity-70 transition-opacity hover:opacity-100
								focus-visible:ring-1 focus-visible:ring-shadcn-ring focus-visible:outline-none"
						>
							<IconBox icon="lucide:x-circle" />
						</div>
					:	<IconBox icon="lucide:calendar" />}
					{label}
				</button>
			</Popover.Trigger>
			<Popover.Content className="w-auto p-0" align="start">
				{multiple ?
					<Calendar
						autoFocus={true}
						captionLayout="dropdown"
						mode="range"
						selected={
							getIsDateRange(selectedDates) ? selectedDates : { from: undefined, to: undefined }
						}
						onSelect={onSelect}
					/>
				:	<Calendar
						captionLayout="dropdown"
						mode="single"
						selected={!getIsDateRange(selectedDates) ? selectedDates[0] : undefined}
						onSelect={onSelect}
					/>
				}
			</Popover.Content>
		</Popover.Root>
	);
}

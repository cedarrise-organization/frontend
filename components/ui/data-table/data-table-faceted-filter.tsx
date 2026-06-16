"use client";

import type { Column } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import { Badge } from "../badge";
import * as Combobox from "../combobox";
import { Separator } from "../separator";
import type { Option } from "./data-table-types";

type DataTableFacetedFilterProps<TData, TValue> = {
	column?: Column<TData, TValue>;
	multiple?: boolean;
	options: Option[];
	title?: string;
};

export function DataTableFacetedFilter<TData, TValue>({
	column,
	multiple,
	options,
	title,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const [open, setOpen] = useState(false);

	const columnFilterValue = column?.getFilterValue();
	const selectedValues = useMemo(() => {
		if (!Array.isArray(columnFilterValue)) {
			return new Set<string>();
		}

		const values = columnFilterValue.filter((value): value is string => typeof value === "string");
		return new Set(values);
	}, [columnFilterValue]);

	const onReset = useCallback(
		(event?: React.MouseEvent) => {
			event?.stopPropagation();
			column?.setFilterValue(undefined);
		},
		[column]
	);

	const onValueChange = useCallback(
		(value: string | string[]) => {
			if (!column) return;

			if (Array.isArray(value)) {
				column.setFilterValue(value.length > 0 ? value : undefined);
				return;
			}

			column.setFilterValue(value ? [value] : undefined);
		},
		[column]
	);

	const content = (
		<>
			<Combobox.Trigger className="border-dashed font-normal" size="sm">
				{({ selectedOptions }) => (
					<>
						{selectedValues.size > 0 ?
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
						{title}
						{selectedValues.size > 0 && (
							<>
								<Separator
									orientation="vertical"
									className="mx-0.5 data-[orientation=vertical]:h-4"
								/>
								<Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
									{selectedValues.size}
								</Badge>
								<div className="hidden items-center gap-1 lg:flex">
									{selectedValues.size > 2 ?
										<Badge variant="secondary" className="rounded-sm px-1 font-normal">
											{selectedValues.size} selected
										</Badge>
									:	selectedOptions.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
									}
								</div>
							</>
						)}
					</>
				)}
			</Combobox.Trigger>
			<Combobox.Content className="w-50 p-0" popoverOptions={{ align: "start" }}>
				<Combobox.Input placeholder={title} />
				<Combobox.List className="max-h-full">
					<Combobox.Empty>No results found.</Combobox.Empty>
					<Combobox.Group className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto">
						{options.map((option) => {
							const isSelected = selectedValues.has(option.value);

							return (
								<Combobox.Item key={option.value} value={option.value}>
									<div
										className={cnMerge(
											`flex size-4 items-center justify-center rounded-sm border
											border-shadcn-primary`,
											isSelected ? "bg-shadcn-primary" : "opacity-50 [&_svg]:invisible"
										)}
									>
										<IconBox icon="lucide:check" />
									</div>
									{option.icon && <option.icon />}
									<span className="truncate">{option.label}</span>
									{option.count !== undefined && (
										<span className="ml-auto font-mono text-xs">{option.count}</span>
									)}
								</Combobox.Item>
							);
						})}
					</Combobox.Group>
					{selectedValues.size > 0 && (
						<>
							<Combobox.Separator />
							<Combobox.Group>
								<Combobox.Item
									shouldSetValue={false}
									onSelect={() => onReset()}
									className="justify-center text-center"
								>
									Clear filters
								</Combobox.Item>
							</Combobox.Group>
						</>
					)}
				</Combobox.List>
			</Combobox.Content>
		</>
	);

	if (multiple) {
		return (
			<Combobox.Root
				data={options}
				mode="multiple"
				onOpenChange={setOpen}
				onValueChange={onValueChange}
				open={open}
				type={title ?? "filter"}
				value={[...selectedValues]}
			>
				{content}
			</Combobox.Root>
		);
	}

	return (
		<Combobox.Root
			data={options}
			onOpenChange={setOpen}
			onValueChange={onValueChange}
			open={open}
			type={title ?? "filter"}
			value={[...selectedValues][0] ?? ""}
		>
			{content}
		</Combobox.Root>
	);
}

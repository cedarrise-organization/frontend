"use client";

import type { Column } from "@tanstack/react-table";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import * as DropdownMenu from "../dropdown-menu";

type DataTableColumnHeaderProps<TData, TValue> = React.ComponentProps<typeof DropdownMenu.Trigger> & {
	column: Column<TData, TValue>;
	label: string;
};

export function DataTableColumnHeader<TData, TValue>({
	className,
	column,
	label,
	...props
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort() && !column.getCanHide()) {
		return <div className={cnMerge(className)}>{label}</div>;
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={cnMerge(
					`-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-shadcn-accent
					focus:ring-1 focus:ring-shadcn-ring focus:outline-none data-[state=open]:bg-shadcn-accent
					[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-shadcn-muted-foreground`,
					className
				)}
				{...props}
			>
				{label}
				{column.getCanSort()
					&& (column.getIsSorted() === "desc" ? <IconBox icon="lucide:chevron-down" />
						// eslint-disable-next-line unicorn/no-nested-ternary
					: column.getIsSorted() === "asc" ? <IconBox icon="lucide:chevron-up" />
					: <IconBox icon="lucide:chevrons-up-down" />)}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start" className="w-28">
				{column.getCanSort() && (
					<>
						<DropdownMenu.CheckboxItem
							className="relative pr-8 pl-2 [&_svg]:text-shadcn-muted-foreground
								[&>span:first-child]:right-2 [&>span:first-child]:left-auto"
							checked={column.getIsSorted() === "asc"}
							onClick={() => column.toggleSorting(false)}
						>
							<IconBox icon="lucide:chevron-up" />
							Asc
						</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem
							className="relative pr-8 pl-2 [&_svg]:text-shadcn-muted-foreground
								[&>span:first-child]:right-2 [&>span:first-child]:left-auto"
							checked={column.getIsSorted() === "desc"}
							onClick={() => column.toggleSorting(true)}
						>
							<IconBox icon="lucide:chevron-down" />
							Desc
						</DropdownMenu.CheckboxItem>
						{column.getIsSorted() && (
							<DropdownMenu.Item
								className="pl-2 [&_svg]:text-shadcn-muted-foreground"
								onClick={() => column.clearSorting()}
							>
								<IconBox icon="lucide:x" />
								Reset
							</DropdownMenu.Item>
						)}
					</>
				)}
				{column.getCanHide() && (
					<DropdownMenu.CheckboxItem
						className="relative pr-8 pl-2 [&_svg]:text-shadcn-muted-foreground
							[&>span:first-child]:right-2 [&>span:first-child]:left-auto"
						checked={!column.getIsVisible()}
						onClick={() => column.toggleVisibility(false)}
					>
						<IconBox icon="lucide:eye-off" />
						Hide
					</DropdownMenu.CheckboxItem>
				)}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

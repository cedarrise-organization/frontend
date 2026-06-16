"use client";

import type { Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import * as Command from "../command";
import { shadcnButtonVariants } from "../constants";
import * as Popover from "../popover";

type DataTableViewOptionsProps<TData> = React.ComponentProps<typeof Popover.Content> & {
	disabled?: boolean;
	table: Table<TData>;
};

export function DataTableViewOptions<TData>({
	disabled,
	table,
	...props
}: DataTableViewOptionsProps<TData>) {
	const columns = useMemo(
		() =>
			table.getAllColumns().filter((column) => column.accessorFn !== undefined && column.getCanHide()),
		[table]
	);

	return (
		<Popover.Root>
			<Popover.Trigger asChild={true}>
				<button
					type="button"
					aria-label="Toggle columns"
					role="combobox"
					className={cnMerge(
						shadcnButtonVariants({ size: "sm", variant: "outline" }),
						"ml-auto hidden h-8 font-normal lg:flex"
					)}
					disabled={disabled}
				>
					<IconBox icon="lucide:settings-2" className="text-shadcn-muted-foreground" />
					View
				</button>
			</Popover.Trigger>
			<Popover.Content className="w-44 p-0" {...props}>
				<Command.Root>
					<Command.Input placeholder="Search columns..." />
					<Command.List>
						<Command.Empty>No columns found.</Command.Empty>
						<Command.Group>
							{columns.map((column) => (
								<Command.Item
									key={column.id}
									onSelect={() => column.toggleVisibility(!column.getIsVisible())}
								>
									<span className="truncate">{column.columnDef.meta?.label ?? column.id}</span>
									<IconBox
										icon="lucide:check"
										className={cnMerge(
											"ml-auto size-4 shrink-0",
											column.getIsVisible() ? "opacity-100" : "opacity-0"
										)}
									/>
								</Command.Item>
							))}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	);
}

"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

function Checkbox(
	props: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
		classNames?: {
			base?: string;
			icon?: string;
			indicator?: string;
		};
	}
) {
	const { className, classNames, ...restOfProps } = props;

	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cnMerge(
				`peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border
				border-shadcn-input transition-colors outline-none group-has-disabled/field:opacity-50
				after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-shadcn-ring
				focus-visible:ring-3 focus-visible:ring-shadcn-ring/50 disabled:cursor-not-allowed
				disabled:opacity-50 aria-invalid:border-shadcn-destructive aria-invalid:ring-3
				aria-invalid:ring-shadcn-destructive/20 aria-invalid:aria-checked:border-shadcn-primary
				data-checked:border-shadcn-primary data-checked:bg-shadcn-primary
				data-checked:text-shadcn-primary-foreground dark:bg-shadcn-input/30
				dark:aria-invalid:border-shadcn-destructive/50 dark:aria-invalid:ring-shadcn-destructive/40
				dark:data-checked:bg-shadcn-primary`,
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className={cnMerge(
					"grid place-content-center text-current transition-none",
					classNames?.indicator
				)}
			>
				<IconBox icon="lucide:check" className={cnMerge("size-3.5", classNames?.icon)} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };

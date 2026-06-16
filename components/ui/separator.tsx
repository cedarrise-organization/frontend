"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

function Separator(props: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	const { className, decorative = true, orientation = "horizontal", ...restOfProps } = props;

	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cnMerge(
				`shrink-0 bg-shadcn-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px
				data-vertical:self-stretch`,
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Separator };

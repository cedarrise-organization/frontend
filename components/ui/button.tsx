"use client";

import type { InferProps, PolymorphicPropsStrict } from "@zayne-labs/toolkit-react/utils";
import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import Image from "next/image";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "@/components/common/slot";
import { cnJoin } from "@/lib/utils/cn";
import { spinnerIcon } from "../icons";

export type ButtonProps = InferProps<"button">
	& Prettify<
		VariantProps<typeof buttonVariants> & {
			asChild?: boolean;
			isLoading?: boolean;
			loadingStyle?: "replace-content" | "side-by-side";
			unstyled?: boolean;
		}
	>;

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = tv({
	base: "flex items-center justify-center gap-2 rounded-[12px] lg:rounded-[20px]",

	compoundVariants: [
		{
			className: "grid justify-items-center",
			isLoading: true,
			loadingStyle: "replace-content",
		},
		{
			className: "gap-1.5",
			isLoading: true,
			loadingStyle: "side-by-side",
		},
		{
			className: "",
			isDisabled: true,
			isLoading: false,
		},
		{
			className: "opacity-80",
			isDisabled: true,
			isLoading: true,
		},
		// {
		// 	className: "hover:rounded-[16px]",
		// 	size: "medium",
		// 	withInteractions: true,
		// },
		// {
		// 	className: "hover:bg-medinfo-primary-darker active:bg-medinfo-primary-lighter",
		// 	isDisabled: false,
		// 	theme: "primary",
		// 	withInteractions: true,
		// },
		// {
		// 	className: "hover:rounded-[50%] hover:shadow-none",
		// 	size: "icon",
		// 	withInteractions: true,
		// },
	],

	defaultVariants: {
		size: "medium",
		theme: "primary",
	},

	variants: {
		disabled: {
			true: "cursor-not-allowed opacity-60",
		},

		isDisabled: {
			true: "cursor-not-allowed",
		},

		isLoading: {
			true: "",
		},

		loadingStyle: {
			"replace-content": "",
			"side-by-side": "",
		},

		size: {
			icon: "size-10 text-base lg:size-[72px] lg:text-[24px]",

			medium: "h-[54px] w-fit px-9 text-[14px] font-medium lg:h-[72px] lg:px-[64px] lg:text-[20px]",
		},

		theme: {
			primary: "bg-cedar-yellow text-cedar-white",

			secondary: "bg-cedar-red text-cedar-white",
		},

		withInteractions: {
			true: `transition-[border-radius,box-shadow] duration-350 ease-[ease]
			hover:shadow-[0_4px_4px_0_hsl(0,0%,0%,0.12)]`,
		},
	},
});

function Button<TElement extends React.ElementType>(props: PolymorphicPropsStrict<TElement, ButtonProps>) {
	const {
		as: Element = "button",
		asChild,
		children,
		className,
		isDisabled = false,
		disabled = isDisabled,
		isLoading = false,
		loadingStyle = "replace-content",
		size,
		theme,
		type = "button",
		unstyled,
		withInteractions = true,
		...restOfProps
	} = props;

	const Component = asChild ? Slot.Root : Element;

	const BTN_CLASSES =
		!unstyled ?
			buttonVariants({
				className,
				disabled,
				isDisabled,
				isLoading,
				loadingStyle,
				size,
				theme,
				withInteractions,
			})
		:	className;

	const withIcon = (
		<>
			<Slot.Slottable>
				{loadingStyle === "replace-content" ?
					<div className="invisible [grid-area:1/1]">{children}</div>
				:	children}
			</Slot.Slottable>

			<span className={cnJoin(loadingStyle === "replace-content" && "[grid-area:1/1]")}>
				<Image src={spinnerIcon} alt="Spinner" width={20} height={20} className="size-5" />
			</span>
		</>
	);

	// == This technique helps prevents content shift when replacing children with spinner icon
	return (
		<Component type={type} className={BTN_CLASSES} disabled={disabled || isDisabled} {...restOfProps}>
			{isLoading ? withIcon : children}
		</Component>
	);
}

export { Button };

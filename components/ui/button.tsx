"use client";

import type { InferProps, PolymorphicPropsStrict } from "@zayne-labs/toolkit-react/utils";
import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "@/components/common/slot";
import { cnJoin } from "@/lib/utils/cn";
import { SpinnerIcon } from "../icons/SpinnerIcon";

export type ButtonProps = InferProps<"button">
	& Prettify<
		VariantProps<typeof buttonVariants> & {
			asChild?: boolean;
			unstyled?: "none" | true;
		}
	>;

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = tv({
	base: "flex items-center justify-center gap-2",

	compoundVariants: [
		{
			className: "relative",
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
		rounded: "regular",
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

		rounded: {
			none: "",
			regular: "rounded-[12px] lg:rounded-[20px]",
		},

		size: {
			icon: "size-10 text-base lg:size-[70px] lg:text-[24px]",

			medium: "h-12 w-fit px-9 text-[14px] font-medium lg:h-[70px] lg:px-[64px] lg:text-[20px]",

			none: "",
		},

		theme: {
			none: "",

			primary: "bg-cedar-yellow text-cedar-white",

			secondary: "bg-cedar-red text-cedar-white",

			"secondary-outline": "border border-cedar-red bg-cedar-white text-cedar-red",

			white: "bg-cedar-white text-cedar-black/64",
		},

		withInteractions: {
			true: `transition-[border-radius,box-shadow] duration-350 ease-[ease]
			hover:shadow-[0_4px_4px_0_hsl(0,0%,0%,0.12)]`,
		},
	},
});

function Button<TElement extends React.ElementType>(props: PolymorphicPropsStrict<TElement, ButtonProps>) {
	const defaultVariantValue = props.unstyled === "none" ? props.unstyled : undefined;

	const {
		as: Element = "button",
		asChild,
		children,
		className,
		isDisabled = false,
		disabled = isDisabled,
		isLoading = false,
		loadingStyle = "replace-content",
		rounded = defaultVariantValue,
		size = defaultVariantValue,
		theme = defaultVariantValue,
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
				rounded,
				size,
				theme,
				withInteractions,
			})
		:	className;

	const withIcon = (
		<>
			<Slot.Slottable>
				{loadingStyle === "replace-content" ?
					<div className="invisible contents">{children}</div>
				:	children}
			</Slot.Slottable>
			<span
				className={cnJoin(
					loadingStyle === "replace-content" && "absolute inset-0 inline-grid place-content-center"
				)}
			>
				<SpinnerIcon className="size-5" />
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

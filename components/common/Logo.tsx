import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import Image from "next/image";
import { logo, logoWhite } from "@/assets/images";
import { cnMerge } from "@/lib/utils/cn";
import { NavLink } from "./NavLink";

function Logo(
	props: Pick<Partial<InferProps<typeof Image>>, "className" | "src" | "width"> & {
		as?: "div" | typeof NavLink;
		children?: React.ReactNode;
		classNames?: { base?: string; image?: string };
		variant?: "regular" | "white";
	}
) {
	const {
		as: Element = NavLink,
		children,
		className,
		classNames,
		src,
		variant = "regular",
		...restOfProps
	} = props;

	const defaultChild = <h3 className="text-[24px] lg:text-[32px]">CedarRise</h3>;

	return (
		<Element href="/" className={cnMerge("flex items-center gap-3 lg:gap-4", classNames?.base)}>
			<Image
				src={src ?? (variant === "white" ? logoWhite : logo)}
				alt="Logo"
				priority={true}
				width={48}
				height={52}
				className={cnMerge("w-12 shrink-0 lg:w-[72px]", className, classNames?.image)}
				{...restOfProps}
			/>
			{children ?? defaultChild}
		</Element>
	);
}

export { Logo };

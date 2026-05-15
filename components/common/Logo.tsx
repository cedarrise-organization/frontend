import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import Image from "next/image";
import { logo } from "@/assets/images";
import { cnMerge } from "@/lib/utils/cn";
import { NavLink } from "./NavLink";

function Logo(
	props: Pick<Partial<InferProps<typeof Image>>, "className" | "src" | "width"> & {
		as?: "div" | typeof NavLink;
		children?: React.ReactNode;
		classNames?: { base?: string; image?: string };
	}
) {
	const { as: Element = NavLink, children, className, classNames, src, ...restOfProps } = props;

	const defaultChild = <h3 className="text-[24px] lg:text-[32px]">CedarRise</h3>;

	return (
		<Element href="/" className={cnMerge("flex items-center gap-3", classNames?.base)}>
			<Image
				src={src ?? logo}
				alt="Logo"
				priority={true}
				width={48}
				height={52}
				className={cnMerge("w-[48px] shrink-0 lg:w-[64px]", className, classNames?.image)}
				{...restOfProps}
			/>
			{children ?? defaultChild}
		</Element>
	);
}

export { Logo };

import { tw } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import Image from "next/image";
import { logo } from "@/assets/images";
import { cnJoin, cnMerge } from "@/lib/utils/cn";

function Main(
	props: Omit<InferProps<"main">, "children"> & {
		children: React.ReactNode | ((props: { constrainedClassName: string }) => React.ReactNode);
		layout?: "constrained" | "fill";
		showWatermark?: boolean;
	}
) {
	const { children, className, layout = "constrained", showWatermark = false, ...restOfProps } = props;

	const constrainedClassName = cnJoin(
		tw`flex w-full max-w-[412px] grow flex-col px-4 lg:max-w-[1400px] lg:px-[50px]`,
		className
	);

	const resolvedChildren = isFunction(children) ? children({ constrainedClassName }) : children;

	return (
		<main
			className={cnMerge(
				"relative flex grow flex-col items-center lg:pb-[80px]",
				layout === "fill" && "w-full",
				layout === "constrained" && constrainedClassName,
				className
			)}
			{...restOfProps}
		>
			{showWatermark && (
				<Image
					src={logo}
					alt=""
					width={280}
					height={304}
					aria-hidden="true"
					className="pointer-events-none fixed top-1/2 left-1/2 z-0 -translate-1/2 opacity-[0.04]
						select-none"
				/>
			)}

			{resolvedChildren}
		</main>
	);
}

export { Main };

import { tw } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { cnJoin, cnMerge } from "@/lib/utils/cn";

function Main(
	props: Omit<InferProps<"main">, "children"> & {
		children: React.ReactNode | ((props: { constrainedClassName: string }) => React.ReactNode);
		layout?: "constrained" | "fill";
	}
) {
	const { children, className, layout = "constrained", ...restOfProps } = props;

	const constrainedClassName = cnJoin(
		tw`flex w-full max-w-[412px] grow flex-col px-4 lg:max-w-[1400px] lg:px-[50px] lg:pt-8 lg:pb-[80px]`,
		className
	);

	const resolvedChildren = isFunction(children) ? children({ constrainedClassName }) : children;

	return (
		<main
			className={cnMerge(
				"flex grow flex-col items-center",
				layout === "fill" && "w-full",
				layout === "constrained" && constrainedClassName,
				className
			)}
			{...restOfProps}
		>
			{resolvedChildren}
		</main>
	);
}

export { Main };

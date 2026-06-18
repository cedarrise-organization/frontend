import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main"> & { bg?: "gray" | "transparent" }) {
	const { bg = "gray", className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge(
				"flex grow flex-col px-3 pt-4 pb-10 lg:px-11 lg:pt-5 lg:pb-[100px]",
				bg === "gray" ? "bg-cedar-grey" : "bg-transparent",
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Main };

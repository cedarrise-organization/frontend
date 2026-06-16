import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main">) {
	const { className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge(
				"flex grow flex-col bg-cedar-grey px-3 pt-4 pb-10 lg:px-11 lg:pt-5 lg:pb-[100px]",
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Main };

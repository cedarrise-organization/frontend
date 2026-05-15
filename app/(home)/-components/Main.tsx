import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main">) {
	const { className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge("flex grow flex-col px-5 pt-6 pb-9 lg:px-[120px] lg:pt-8", className)}
			{...restOfProps}
		/>
	);
}

export { Main };

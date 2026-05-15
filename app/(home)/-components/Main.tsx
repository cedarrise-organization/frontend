import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main">) {
	const { className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge(
				"flex w-full grow flex-col px-4 pt-6 pb-9 max-lg:max-w-[412px] lg:px-[120px] lg:pt-8",
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Main };

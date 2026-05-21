import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main">) {
	const { className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge(
				`flex w-full max-w-[412px] grow flex-col px-4 pt-6 pb-12 lg:max-w-[1440px] lg:px-[100px]
				lg:pt-8 lg:pb-[80px]`,
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Main };

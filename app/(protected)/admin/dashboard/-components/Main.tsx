import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import Image from "next/image";
import { logo } from "@/assets/images";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main"> & { bg?: "gray" | "transparent" }) {
	const { bg = "gray", children, className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge(
				"relative flex grow flex-col px-3 pt-4 pb-10 lg:px-11 lg:pt-5 lg:pb-[100px]",
				bg === "gray" ? "bg-cedar-grey" : "bg-transparent",
				className
			)}
			{...restOfProps}
		>
			{bg === "transparent" && (
				<Image
					src={logo}
					alt=""
					width={280}
					height={304}
					aria-hidden="true"
					className="pointer-events-none fixed top-1/2 left-1/2 z-0 -translate-1/2 opacity-[0.04] select-none"
				/>
			)}

			{children}
		</main>
	);
}

export { Main };

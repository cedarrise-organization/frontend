import Image from "next/image";
import { logo } from "@/assets/images";

function LoadingScreen(props: { text?: string }) {
	const { text = "Preparing your dashboard" } = props;

	return (
		<section
			role="status"
			aria-live="polite"
			className="flex min-h-svh w-full flex-col items-center justify-center bg-cedar-grey px-6
				text-center"
		>
			<div className="relative flex size-28 items-center justify-center lg:size-32">
				<span
					aria-hidden="true"
					className="absolute inset-0 animate-spin rounded-full border border-cedar-black/8
						border-t-cedar-red border-r-cedar-yellow motion-reduce:animate-none"
				/>
				<Image
					src={logo}
					alt=""
					priority={true}
					className="size-20 rounded-[8px] border border-cedar-black/8 bg-cedar-white object-contain
						p-4 shadow-[0_16px_40px_rgba(29,29,31,0.08)] lg:size-24 lg:p-5"
				/>
			</div>

			<h3 className="mt-7 text-[28px] font-semibold text-cedar-black lg:text-[34px]">CedarRise</h3>
			<p className="mt-2 text-[13px] text-cedar-black/56 lg:text-[14px]">{text}</p>

			<span
				aria-hidden="true"
				className="mt-7 flex h-1 w-36 overflow-hidden rounded-full bg-cedar-black/8"
			>
				<span className="h-full grow animate-pulse bg-cedar-red motion-reduce:animate-none" />
				<span
					className="h-full grow animate-pulse bg-cedar-yellow delay-150 motion-reduce:animate-none"
				/>
				<span className="h-full grow animate-pulse bg-cedar-black delay-300 motion-reduce:animate-none" />
			</span>
		</section>
	);
}

export { LoadingScreen };

import Image from "next/image";
import { logo } from "@/assets/images";
import { siteConfig } from "@/lib/config/site";

function LoadingScreen(props: { text?: string }) {
	const { text = "Preparing your dashboard" } = props;

	return (
		<section
			className="flex min-h-svh w-full flex-col items-center justify-center gap-7 bg-cedar-grey px-6
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
					alt="Logo"
					priority={true}
					className="size-20 rounded-[8px] border border-cedar-black/8 bg-cedar-white object-contain
						p-4 shadow-[0_16px_40px_rgba(29,29,31,0.08)] lg:size-24 lg:p-5"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="text-[28px] font-semibold text-cedar-black lg:text-[34px]">
					{siteConfig.name}
				</h3>
				<p className="text-[13px] text-cedar-black/56 lg:text-[14px]">{text}</p>
			</div>

			<span className="flex h-1 w-[144px] overflow-hidden rounded-full bg-cedar-black/8">
				<span className="w-full animate-pulse bg-cedar-red motion-reduce:animate-none" />
				<span className="w-full animate-pulse bg-cedar-yellow delay-150 motion-reduce:animate-none" />
				<span className="w-full animate-pulse bg-cedar-black delay-300 motion-reduce:animate-none" />
			</span>
		</section>
	);
}

export { LoadingScreen };

import Image from "next/image";
import { logo } from "@/assets/images";

function LoadingScreen(props: { text?: string }) {
	const { text = "Preparing your dashboard" } = props;

	return (
		<section
			role="status"
			aria-live="polite"
			className="flex min-h-svh w-full flex-col items-center justify-center bg-cedar-white px-6"
		>
			<div className="relative flex size-24 items-center justify-center lg:size-28">
				<span className="absolute inset-0 animate-ping rounded-full border border-cedar-yellow/24" />
				<span className="absolute inset-3 animate-pulse rounded-full bg-cedar-yellow/8" />
				<Image src={logo} alt="" priority={true} className="relative w-14 lg:w-16" />
			</div>

			<p className="mt-4 text-[24px]/[1.1] text-cedar-black lg:text-[30px]">CedarRise</p>
			<p className="mt-2 text-[11px] text-cedar-black/48 lg:text-[13px]">{text}</p>

			<div className="mt-6 flex items-center gap-2">
				<span className="size-2 animate-bounce rounded-full bg-cedar-red [animation-delay:-300ms]" />
				<span className="size-2 animate-bounce rounded-full bg-cedar-yellow [animation-delay:-150ms]" />
				<span className="size-2 animate-bounce rounded-full bg-cedar-black" />
			</div>
		</section>
	);
}

export { LoadingScreen };

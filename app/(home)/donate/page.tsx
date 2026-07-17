import Image from "next/image";
import { heroImg } from "@/assets/images/donate";
import { Main } from "../-components/Main";
import { DonateForm } from "./-components/DonateForm";

function DonatePage() {
	return (
		<Main layout="fill" className="gap-[64px] lg:gap-[88px]">
			<DonateHeroSection />
			<DonateFormSection />
		</Main>
	);
}

export default DonatePage;

function DonateHeroSection() {
	return (
		<section
			className="relative isolate flex h-[425px] w-full items-center justify-center px-6 text-center
				text-cedar-white lg:h-[510px] lg:px-[50px]"
		>
			<header className="flex max-w-[300px] flex-col items-center gap-4 lg:max-w-[425px]">
				<h1 className="text-[40px]/none lg:text-[64px]">Donate</h1>

				<p className="text-[12px]/5 lg:text-base/7">
					Give the gift of opportunity. Your financial support fuels everything we do. Every amount
					counts.
				</p>
			</header>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={heroImg}
					alt="CedarRise outreach group"
					priority={true}
					className="size-full object-cover"
				/>

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-yellow/0.4)_0%,theme(--color-cedar-yellow/0.4)_100%]"
				/>
			</div>
		</section>
	);
}

function DonateFormSection() {
	return (
		<section className="flex w-full justify-center px-4 lg:px-[50px]">
			<article className="flex w-full max-w-[592px] flex-col gap-6">
				<header className="flex items-center justify-between gap-12 lg:px-9">
					<h2 className="shrink-0 leading-[1.2] lg:text-[24px]">Donate Form</h2>
					<p className="text-[10px]/4 text-cedar-black/64">
						*Please fill information correctly according to field tag
					</p>
				</header>

				<DonateForm />
			</article>
		</section>
	);
}

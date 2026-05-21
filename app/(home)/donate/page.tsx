import Image from "next/image";
import { heroImg } from "@/assets/images/donate";
import { ForWithWrapper } from "@/components/common/for";
import { Main } from "../-components/Main";
import { DonateForm } from "./-components/DonateForm";

function DonatePage() {
	return (
		<Main className="gap-8 lg:gap-[64px]">
			<DonateIntroSection />
			<DonateFormSection />
		</Main>
	);
}

export default DonatePage;

const supportAreas = [
	"Sponsor a TACOTS or ASH beneficiary.",
	"Fund a bootcamp, teacher refresher course or youth initiatives.",
	"Donate toward outreach events and materials.",
];

function DonateIntroSection() {
	return (
		<section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
			<header className="flex w-full flex-col gap-4 lg:max-w-[286px]">
				<h1 className="text-[40px]/none text-cedar-red lg:text-[64px]">Donate</h1>

				<p className="text-[12px]/4 text-pretty lg:text-base/7">
					Give the gift of opportunity. Your financial support fuels everything we do. Every amount
					counts
				</p>
			</header>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red p-9 text-cedar-white
					lg:min-h-[306px] lg:justify-center lg:gap-6 lg:rounded-[32px] lg:p-12"
			>
				<h2 className="text-[24px]/none lg:text-[40px]">Support Areas:</h2>

				<ForWithWrapper
					className="flex flex-col gap-3 lg:gap-5"
					each={supportAreas}
					renderItem={(supportArea) => (
						<li key={supportArea} className="flex items-start gap-3 lg:gap-5">
							<span
								className="mt-1.5 size-3 shrink-0 rounded-full bg-cedar-yellow lg:mt-2 lg:size-4"
							/>
							<h3 className="leading-6 lg:text-[24px]/8">{supportArea}</h3>
						</li>
					)}
				/>
			</article>
		</section>
	);
}

function DonateFormSection() {
	return (
		<section className="flex flex-col gap-6 lg:flex-row lg:gap-5">
			<Image
				src={heroImg}
				alt="CedarRise outreach group"
				className="min-h-[303px] w-full min-w-0 rounded-[24px] object-cover lg:min-h-[533px]
					lg:rounded-[32px]"
			/>

			<article className="flex w-full flex-col gap-6">
				<header className="flex items-center justify-between gap-[64px] lg:px-9">
					<h2 className="shrink-0 leading-none lg:text-[24px]">Donate Form</h2>
					<p className="text-[10px]/4 text-cedar-black/60 lg:max-w-[290px] lg:text-[10px]/4">
						*Please fill information correctly according to field tag
					</p>
				</header>

				<DonateForm />
			</article>
		</section>
	);
}

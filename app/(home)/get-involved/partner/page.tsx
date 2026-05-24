import Image from "next/image";
import { heroImg } from "@/assets/images/get-involved/partner";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../../-components/Main";

function PartnerPage() {
	return (
		<Main className="gap-10 lg:gap-[80px]">
			<PartnerHeroSection />
			<PartnerFormLinkSection />
		</Main>
	);
}

export default PartnerPage;

const waysToPartner = ["Co-host programs", "Provide resources", "Sponsor initiatives", "Offer expertise"];

function PartnerHeroSection() {
	return (
		<section className="flex flex-col gap-10 lg:flex-row lg:gap-6">
			<header className="flex w-full flex-col gap-4 lg:max-w-[282px]">
				<h1 className="text-[40px]/[1.2] text-cedar-red lg:text-[64px]">Partner with us</h1>

				<p className="text-[12px]/4 text-pretty lg:text-base/7">
					We collaborate with schools, NGOs, businesses, professional associations, and government
					agencies to expand impact.
				</p>
			</header>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red p-9 text-cedar-white
					lg:min-h-[420px] lg:max-w-[424px] lg:gap-8 lg:rounded-[32px] lg:p-12"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">Ways to Partner:</h2>

				<ForWithWrapper
					className="flex flex-col gap-3 lg:gap-5"
					each={waysToPartner}
					renderItem={(way) => (
						<li key={way} className="flex items-start gap-3 lg:gap-5">
							<span
								className="mt-1.5 size-3 shrink-0 rounded-full bg-cedar-yellow lg:mt-2 lg:size-4"
							/>
							<h3 className="leading-6 lg:text-[24px]/8">{way}</h3>
						</li>
					)}
				/>
			</article>

			<Image
				src={heroImg}
				alt="CedarRise partners"
				priority={true}
				className="min-h-[334px] w-full min-w-0 rounded-[24px] object-cover lg:min-h-[420px]
					lg:rounded-[32px]"
			/>
		</section>
	);
}

function PartnerFormLinkSection() {
	return (
		<section
			className="flex items-center justify-between gap-5 rounded-[16px] bg-cedar-black py-2 pr-2 pl-6
				text-cedar-white lg:gap-12 lg:rounded-[20px] lg:py-5.5 lg:pr-5.5 lg:pl-12"
		>
			<NavLink href="#" className="text-[14px]/[1.2] underline underline-offset-5 lg:hidden">
				Sign Up to be a Partner
			</NavLink>

			<div className="contents max-lg:hidden">
				<NavLink href="#" className="text-[24px]/[1.2] underline underline-offset-5">
					Partner Registration Form
				</NavLink>

				<p className="max-w-[456px] text-cedar-white/80 lg:text-base/6">
					Click and complete this form so we can match you with suitable Partnership opportunities.
				</p>
			</div>

			<Button size="icon" className="shrink-0 self-end lg:self-auto">
				<IconBox icon="solar:arrow-right-up-outline" />
			</Button>
		</section>
	);
}

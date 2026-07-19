"use client";

import Image from "next/image";
import { heroImg } from "@/assets/images/get-involved/partner";
import { NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../../-components/Main";

function PartnerPage() {
	return (
		<Main layout="fill">
			<PartnerHeroSection />
		</Main>
	);
}

export default PartnerPage;

function PartnerHeroSection() {
	return (
		<section
			className="relative isolate flex h-[425px] w-full items-center justify-center px-6 lg:h-[610px]
				lg:px-[50px]"
		>
			<article
				className="mt-[100px] flex w-full flex-col items-center gap-8 text-center text-cedar-white
					lg:gap-10"
			>
				<header className="flex flex-col items-center gap-4">
					<h1 className="text-[40px]/none lg:text-[64px]">Partner with us</h1>

					<p className="max-w-[258px] text-[12px]/5 lg:max-w-[490px] lg:text-base/7">
						We collaborate with schools, NGOs, businesses, professional associations, and government
						agencies to expand impact.
					</p>
				</header>

				<NavLinkEphemeral
					href={(ctx) => ({
						pathname: "/get-form-link",
						query: { from: ctx.pathname, program: "Partner", type: "REGISTRATION" },
					})}
				>
					<Button className="shrink-0 max-lg:w-full max-lg:max-w-[282px]">Partner with us</Button>
				</NavLinkEphemeral>
			</article>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={heroImg}
					alt="CedarRise partners"
					priority={true}
					className="size-full object-cover"
				/>

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-black/0.64)_0%,theme(--color-cedar-black/0.64)_100%]"
				/>
			</div>
		</section>
	);
}

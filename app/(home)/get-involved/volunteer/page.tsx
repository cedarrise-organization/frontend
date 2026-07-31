"use client";

import Image from "next/image";
import { heroImg } from "@/assets/images/get-involved/volunteer";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../../-components/Main";

function VolunteerPage() {
	return (
		<Main layout="fill">
			<VolunteerHeroSection />
		</Main>
	);
}

export default VolunteerPage;

function VolunteerHeroSection() {
	return (
		<section
			className="relative isolate flex h-[540px] w-full items-center justify-center px-6 lg:h-[610px]
				lg:px-[50px]"
		>
			<article
				className="mt-[150px] flex w-full max-w-[345px] flex-col items-center gap-10 text-center
					text-cedar-white lg:mt-[56px] lg:max-w-[542px]"
			>
				<header className="flex flex-col items-center gap-[18px]">
					<h1 className="text-[40px]/none lg:text-[64px]">Volunteer</h1>

					<p className="text-[12px]/5 lg:text-base/7">
						At CedarRise, volunteers are the heartbeat of our mission. Whether you're supporting
						workshops, mentoring students, teaching literacy or ICT, assisting in our outreaches or
						helping with media or logistics, your time and passion can transform lives. <br /> If you care,
						you qualify.
					</p>
				</header>

				<div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:gap-8.5">
					<NavLinkEphemeral
						href={(ctx) => ({
							pathname: "/get-form-link",
							query: { from: ctx.pathname, program: "VOLUNTEER", type: "REGISTRATION" },
						})}
					>
						<Button className="shrink-0 max-lg:w-full max-lg:max-w-[282px]">Volunteer Now</Button>
					</NavLinkEphemeral>

					<NavLink
						href={(ctx) => ({
							pathname: "/get-form-link",
							query: { from: ctx.pathname, program: "VOLUNTEER", type: "FEEDBACK" },
						})}
						className="flex items-center gap-4"
					>
						<p className="text-[14px] font-medium lg:text-[20px]">Feedback</p>

						<Button theme="secondary" size="icon" className="shrink-0">
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>
					</NavLink>
				</div>
			</article>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={heroImg}
					alt="CedarRise volunteer passing supplies"
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

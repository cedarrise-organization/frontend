"use client";

import { tw } from "@zayne-labs/toolkit-core";
import Image from "next/image";
import { approachSectionImg, heroImg } from "@/assets/images/social-initiatives/tacots";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { FinalCTASection } from "../../-components/FinalCTASectionShared";
import { Main } from "../../-components/Main";
import { TacotsStoriesCarousel } from "./-components/TacotsCarousels";

function TacotsPage() {
	return (
		<Main layout="fill" className="gap-10 lg:gap-[64px]">
			{(ctx) => (
				<>
					<div className="w-full">
						<TacotsHeroSection />
						<TacotsSuccessSection />
					</div>

					<div className={ctx.constrainedClassName}>
						<TacotsOverviewSection />
					</div>

					<TacotsApproachSection />

					<div className={ctx.constrainedClassName}>
						<WhatWeProvideSection />
						<StoriesSection />
					</div>

					<FinalCTASection
						title="Support a childs learning Journey"
						description="Your support can help more students access quality education and mentorship"
						actionLayout="stack-mobile"
						actions={[
							{ href: "/donate", label: "Become a Benefactor" },
							{
								href: "/social-initiatives/tacots/recommendation",
								kind: "outline-button",
								label: "Refer a Child",
							},
							{
								href: (innerCtx) => ({
									pathname: "/get-form-link",
									query: { from: innerCtx.pathname, program: "TACOTS", type: "Feedback" },
								}),
								kind: "icon-link",
								label: "Feedback",
							},
						]}
					/>
				</>
			)}
		</Main>
	);
}

export default TacotsPage;

function TacotsHeroSection() {
	return (
		<section
			className="relative isolate flex h-[402px] w-full items-center justify-center px-8 text-center
				lg:h-[670px]"
		>
			<h1 className="text-[32px]/[1.1] text-cedar-white lg:text-[64px]/[1.1]">
				Take a Child off the Streets(TACOTS)
			</h1>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={heroImg}
					alt="TACOTS beneficiaries"
					priority={true}
					className="size-full object-cover"
				/>

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-red/0.4)_0%,theme(--color-cedar-red/0.4)_100%]"
				/>
			</div>
		</section>
	);
}

const successStats = [
	{ label: "Students Enrolled", value: "9" },
	{ label: "Currently in school", value: "5+" },
	{ label: "Graduated", value: "4" },
	{ label: "Partner Schools", value: "3" },
];

function TacotsSuccessSection() {
	return (
		<section className="flex w-full justify-center bg-cedar-red px-6 py-10 lg:px-[50px] lg:py-[52px]">
			<div
				className="flex w-full flex-col items-center gap-10 lg:max-w-[1300px] lg:flex-row-reverse
					lg:justify-between"
			>
				<ForWithWrapper
					className="grid w-full max-w-[362px] grid-cols-[repeat(2,min(100%/2,144px))] gap-4.5
						rounded-[20px] bg-[hsl(351,96%,18%)] p-7 lg:max-w-[488px]
						lg:grid-cols-[repeat(2,min(100%/2,160px))] lg:gap-[54px] lg:p-[56px]"
					each={successStats}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex min-h-[92px] flex-col justify-center gap-2 rounded-[16px] bg-cedar-red
								px-7 lg:min-h-[120px] lg:rounded-[20px]"
						>
							<h3 className="text-[24px]/none text-cedar-white lg:text-[36px]/none">
								{stat.value}
							</h3>
							<p className="max-w-min text-[10px]/[1.2] text-cedar-white/80 lg:text-[12px]">
								{stat.label}
							</p>
						</li>
					)}
				/>

				<article className="flex flex-col gap-10 text-cedar-white lg:gap-[64px]">
					<header className="flex flex-col gap-4 max-lg:items-center max-lg:text-center lg:gap-6">
						<h2 className="max-w-[228px] text-[24px]/[1.1] lg:max-w-[456px] lg:text-[40px]">
							Every Child Deserves a Seat at Success.
						</h2>
						<p
							className="max-w-[285px] text-[10px]/4 text-cedar-white/80 lg:max-w-[456px]
								lg:text-base/7"
						>
							Reconnecting out-of-school and at-risk children with education, mentorship, and a
							pathway to a better future.
						</p>
					</header>

					<div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8.5">
						<NavLinkEphemeral
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "TACOTS", type: "Registration" },
							})}
						>
							<Button className="shrink-0 max-lg:w-full">Refer a Child</Button>
						</NavLinkEphemeral>

						<NavLink
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "TACOTS", type: "Feedback" },
							})}
							className="flex items-center gap-4"
						>
							<p className="text-[14px] font-medium lg:text-[20px]">Feedback</p>

							<Button theme="secondary" size="icon" className="shrink-0 bg-[hsl(351,96%,18%)]">
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLink>
					</div>
				</article>
			</div>
		</section>
	);
}

function TacotsOverviewSection() {
	return (
		<section className="flex flex-col gap-4 lg:flex-row lg:gap-5">
			<article
				className="flex w-full flex-col gap-4 rounded-[16px] bg-cedar-grey p-6 lg:rounded-[24px]
					lg:px-[50px] lg:py-7.5"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">About TACOTS</h2>

				<div className="text-[10px]/4 text-pretty lg:text-base/7">
					<p>
						TACOTS (Take a Child Off The Street) is CedarRise's social initiative focused on
						addressing the growing number of out-of-school children.
					</p>
					<p>
						The program identifies vulnerable children, reconnects them with formal education, and
						provides continuous academic, emotional, and social support to help them build stable and
						meaningful futures.
					</p>
				</div>
			</article>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red p-6 text-cedar-white
					lg:rounded-[32px] lg:px-12 lg:py-9"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">The Challenge</h2>

				<div className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-base/7">
					<p>
						Many children face barriers to education due to poverty, instability, and lack of access
						to support systems. Without intervention, these challenges can lead to long-term social
						and economic disadvantages.
					</p>
					<p>TACOTS exists to break this cycle by restoring access to education and opportunity.</p>
				</div>
			</article>
		</section>
	);
}

const approachSteps = [
	{
		description:
			"Children are identified through community partnerships and enrolled in suitable schools.",
		title: "Identification & Onboarding",
	},
	{
		description: "Continuous academic, emotional, and mentorship support ensures steady progress.",
		title: "Ongoing Support",
	},
	{
		description: "Close tracking, family engagement, and early intervention keep students on track.",
		title: "Retention & Monitoring",
	},
	{
		description: "Graduates are supported into higher education, vocational training, or employment.",
		title: "Transition & Future Pathways",
	},
];

function TacotsApproachSection() {
	return (
		<section
			className="flex w-full justify-center bg-cedar-black px-6 py-10 text-cedar-white lg:px-[50px]
				lg:py-[52px]"
		>
			<div
				className="grid w-full max-w-[380px] gap-y-10 max-lg:justify-items-center lg:max-w-[1300px]
					lg:grid-cols-[min(100%,480px)_min(100%,590px)] lg:justify-between lg:gap-x-10"
			>
				<article
					className="flex flex-col gap-4 rounded-[20px] bg-[hsl(240,4%,5%)] p-6 lg:gap-5
						lg:rounded-[24px] lg:p-7.5"
				>
					<h2 className="text-[24px]/[1.2] lg:text-[40px]">Who We Serve</h2>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						TACOTS supports children aged 6-17 who are out of school or at risk of dropping out,
						particularly those living in vulnerable environments with limited access to structured
						education.
					</p>
				</article>

				<article
					className="flex w-full max-w-[328px] flex-col gap-6 lg:col-[1/2] lg:row-[1/3]
						lg:max-w-[480px] lg:gap-10"
				>
					<h2 className="text-[24px]/[1.2] max-lg:text-center lg:text-[40px]">Our Approach</h2>

					<ForWithWrapper
						className="flex flex-col gap-6 lg:gap-12"
						each={approachSteps}
						renderItem={(step, index) => (
							<li key={step.title} className="flex items-center gap-5">
								<h4
									className="grid size-[64px] shrink-0 place-content-center rounded-[12px]
										bg-cedar-red text-[32px] text-cedar-yellow lg:size-[80px] lg:text-[40px]"
								>
									{index + 1}
								</h4>

								<div className="flex flex-col gap-2">
									<h3 className="text-[16px]/[1.2] lg:text-[20px]">{step.title}</h3>
									<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[12px]/5">
										{step.description}
									</p>
								</div>
							</li>
						)}
					/>
				</article>

				<div className="relative isolate">
					<Image
						src={approachSectionImg}
						alt="TACOTS approach session"
						className="h-full max-h-[228px] rounded-[20px] object-cover lg:max-h-[320px]
							lg:rounded-[24px]"
					/>

					<span
						className="absolute inset-0 rounded-[24px]
							bg-linear-[270deg,theme(--color-cedar-black/0.4)_0%,theme(--color-cedar-black/0.4)_100%]
							mix-blend-multiply"
					/>
				</div>
			</div>
		</section>
	);
}

const whatWeProvideItems = [
	{ color: tw`bg-cedar-red`, title: "School sponsorship (fees, books, uniforms)" },
	{ color: tw`bg-cedar-black`, title: "Parental & family support" },
	{ color: tw`bg-cedar-red`, title: "Life skills training" },
	{ color: tw`bg-cedar-black`, title: "Community partnerships" },
	{ color: tw`bg-cedar-black`, title: "One-on-one mentorship" },
	{ color: tw`bg-cedar-red`, title: "Long-term academic tracking" },
] as const;

function WhatWeProvideSection() {
	return (
		<section className="flex flex-col items-center gap-8 lg:gap-11">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">What We Provide</h2>

			<ForWithWrapper
				className="flex max-w-[1040px] flex-wrap justify-center gap-4 lg:gap-5"
				each={whatWeProvideItems}
				renderItem={(item) => (
					<li
						key={item.title}
						className={cnJoin(
							"rounded-[8px] px-5 py-4 text-center lg:rounded-[12px] lg:px-8 lg:py-5",
							item.color
						)}
					>
						<h3 className="text-[12px]/[1.2] font-medium text-cedar-white lg:text-[18px]">
							{item.title}
						</h3>
					</li>
				)}
			/>
		</section>
	);
}

function StoriesSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-10">
			<div className="flex items-center justify-between gap-6">
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">Impact Testimonials</h2>
				<IconBox icon="solar:arrow-right-outline" className="size-5 shrink-0 lg:hidden" />
			</div>

			<TacotsStoriesCarousel />
		</section>
	);
}

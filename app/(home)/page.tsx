"use client";

import Image from "next/image";
import {
	programmeFour,
	programmeOne,
	programmeThree,
	programmeTwo,
	sustainableImpact1,
	sustainableImpact2,
} from "@/assets/images/landing";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLinkEphemeral, type MainAppRoutes } from "@/components/common/NavLink";
import {
	communityOutReachIcon,
	educationIcon,
	humanDevelopmentIcon,
	mentorshipIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cnJoin } from "@/lib/utils/cn";
import { FinalCTASection } from "./-components/FinalCTASectionShared";
import { HomeHeroCarousel, HomeTestimonialCarousel } from "./-components/HomesCarousels";
import { Main } from "./-components/Main";

function HomePage() {
	return (
		<Main layout="fill" className="gap-12 lg:gap-[80px]">
			{(props) => (
				<>
					<div className="w-full">
						<HeroSection />
						<WhatWeDoSection />
					</div>
					<div className={props.constrainedClassName}>
						<OurProgrammesSection />
						<SustainableImpactSection />
						<TestimonialsSection />
					</div>
					<FinalCTASection />
				</>
			)}
		</Main>
	);
}

export default HomePage;

const impactStats = [
	{ count: "500+", label: "Total Beneficiaries" },
	{ count: "10+", label: "Communities Impacted" },
	{ count: "5+", label: "Years of Impact" },
	{ count: "120+", label: "Volunteers Engaged" },
] satisfies Array<{ count: string; label: string }>;

function HeroSection() {
	return (
		<section
			className="relative isolate w-full px-4 pt-[148px] pb-12 text-cedar-white lg:px-[50px]
				lg:pt-[198px] lg:pb-[54px]"
		>
			<h1 className="max-w-[380px] text-[32px]/12 lg:max-w-[640px] lg:text-[56px]/[64px]">
				Nurturing Minds, Transforming Communities
			</h1>

			<p
				className="mt-4 max-w-[400px] text-[14px]/[1.2] text-inherit/80 lg:mt-5 lg:max-w-[632px]
					lg:text-base"
			>
				CedarRise Initiative for Human Development is a transformative organization dedicated to
				empowering individuals and communities through education, mentorship, professional development
				and skill-building.
			</p>

			<ForWithWrapper
				className="mt-12 grid grid-cols-[repeat(4,min(100%/4,124px))] gap-1 lg:mt-20 lg:gap-5"
				each={impactStats}
				renderItem={(stat) => (
					<li key={stat.label} className="flex flex-col gap-1">
						<h4 className="text-[36px]/none">{stat.count}</h4>
						<p className="max-w-[90px] text-[12px]/[1.3] lg:text-[14px]">{stat.label}</p>
					</li>
				)}
			/>

			<HomeHeroCarousel />
		</section>
	);
}

const offers: Array<{ description: string; icon: string; title: string }> = [
	{
		description: "Providing structured academic guidance and learning opportunities.",
		icon: educationIcon,
		title: "Education Support",
	},
	{
		description: "Connecting young minds with mentors for guidance and growth",
		icon: mentorshipIcon,
		title: "Mentorship",
	},
	{
		description: "Reaching underserved communities with impactful initiatives",
		icon: communityOutReachIcon,
		title: "Community Outreach",
	},
	{
		description: "Equipping individuals with practical and vocational skills",
		icon: humanDevelopmentIcon,
		title: "Human Development",
	},
];

function WhatWeDoSection() {
	return (
		<section
			className="flex w-full flex-col gap-9.5 bg-cedar-black px-5 pt-7.5 pb-10 lg:gap-[52px]
				lg:px-[80px] lg:pt-[72px] lg:pb-[128px]"
		>
			<h2 className="text-center text-[32px]/[1.2] text-cedar-yellow lg:text-[40px]">What we do</h2>

			<ForWithWrapper
				className="grid grid-cols-2 gap-2 lg:grid-cols-[repeat(4,min(100%/4,245px))] lg:justify-center
					lg:gap-5"
				each={offers}
				renderItem={(offer, index) => {
					const offerCount = index + 1;

					const totalColumns = 2;

					const rowNumber = Math.ceil(offerCount / totalColumns);

					const columnPlacement = offerCount % totalColumns;

					const colNumber = columnPlacement === 0 ? totalColumns : columnPlacement;

					const isEvenRow = rowNumber % 2 === 0;

					const swappedColNumber = isEvenRow ? totalColumns + 1 - colNumber : colNumber;

					const isOfferCountEven = offerCount % 2 === 0;

					// NOTE - FIX FOR HOVER ISSUES:
					// We use a static wrapper (li) as the hover "hit box" and apply a `group` class to it.
					// Since the wrapper never rotates, its physical boundaries never change.
					// The inner div uses `group-hover` to perform the actual rotation, which prevents the endless loop where rotating an element moves it out from under the cursor, losing the hover state.
					return (
						<li
							data-order={offerCount}
							key={offer.title}
							className={cnJoin(
								"group min-h-[148px] lg:min-h-[252px]",
								isEvenRow && "max-lg:[grid-area:var(--grid-area)]"
							)}
							style={
								isEvenRow ?
									({ "--grid-area": `${rowNumber}/${swappedColNumber}` } as React.CSSProperties)
								:	undefined
							}
						>
							<div
								className={cnJoin(
									`flex size-full flex-col gap-3 rounded-[16px] bg-[hsl(240,5%,5%)] p-2
									transition-[rotate] duration-500 ease-[cubic-bezier(0.34,2,0.64,1)] lg:gap-5
									lg:rounded-[20px] lg:pt-4 lg:pr-3.5 lg:pb-6 lg:pl-4`,
									isOfferCountEven ? "lg:group-hover:rotate-6" : "lg:group-hover:-rotate-6"
								)}
							>
								<span
									className={cnJoin(
										"w-fit rounded-[12px] p-3.5 lg:rounded-[20px] lg:p-6",
										isOfferCountEven ? "bg-cedar-yellow" : "bg-cedar-red"
									)}
								>
									<Image
										width={20}
										height={20}
										src={offer.icon}
										alt="icon"
										className="size-5 lg:size-8"
									/>
								</span>
								<h4 className="leading-[1.2] text-cedar-white lg:text-[24px]">{offer.title}</h4>
								<p className="text-[12px]/[1.4] text-pretty text-cedar-white/80 lg:text-[14px]">
									{offer.description}
								</p>
							</div>
						</li>
					);
				}}
			/>
		</section>
	);
}

const initiatives: Array<{ description: string; image: string; link: MainAppRoutes; title: string }> = [
	{
		description: "After school learning programme for students in underserved communities.",
		image: programmeOne,
		link: "/social-initiatives/ash",
		title: "ASH (After School Hours)",
	},
	{
		description: "Reconnecting out-of-school children with formal education and all-round support.",
		image: programmeTwo,
		link: "/social-initiatives/tacots",
		title: "TACOTS (Take a Child Off The Streets)",
	},
	{
		description: "Community-driven initiatives creating real impact.",
		image: programmeThree,
		link: "/social-initiatives/outreaches",
		title: "Outreaches",
	},
	{
		description: "Transformative learning experiences designed to meet real-world needs.",
		image: programmeFour,
		link: "/capacity-building",
		title: "Capacity Building",
	},
];

function OurProgrammesSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<header className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:gap-9.5">
				<h2 className="shrink-0 text-[28px]/[1.2] lg:text-[48px]/none">Our Programmes</h2>
				<p className="max-w-[825px] text-[13px]/5 text-black lg:text-base/7">
					At CedarRise, our social initiatives focus on expanding opportunity for underserved
					communities, particularly children and young people who face barriers to education,
					mentorship, and personal development. Through targeted programs and community outreach, we
					work to restore access, strengthen support systems, and create pathways for long-term
					growth.
				</p>
			</header>

			<ForWithWrapper
				className="grid grid-cols-1 gap-4 lg:grid-cols-[repeat(2,min(100%/2,590px))] lg:justify-center
					lg:gap-5"
				each={initiatives}
				renderItem={(initiative) => (
					<li
						key={initiative.title}
						className="relative isolate flex min-h-[320px] flex-col justify-between rounded-[24px]
							pb-9 lg:min-h-[416px]"
					>
						<div className="absolute inset-0 isolate -z-1 rounded-[inherit]">
							<Image
								src={initiative.image}
								alt="Initiative"
								className="size-full rounded-[inherit] object-cover"
							/>
							<span
								className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit]
									bg-linear-[180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%]
									mix-blend-multiply lg:h-3/4"
							/>
						</div>

						<NavLinkEphemeral href={initiative.link}>
							<Button theme="secondary" size="icon" className="mt-3 mr-3 self-end lg:mt-4 lg:mr-4">
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLinkEphemeral>

						<div className="flex flex-col gap-2 px-10 text-cedar-white lg:gap-2.5">
							<h3 className="text-[28px] lg:text-[36px]">{initiative.title}</h3>
							<p className="max-w-[237px] text-[12.5px] text-pretty lg:max-w-[330px] lg:text-[14px]">
								{initiative.description}
							</p>
						</div>
					</li>
				)}
			/>
		</section>
	);
}

function TestimonialsSection() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-center text-[18px] leading-[1.2] text-cedar-yellow lg:text-[24px]">Testimonials</h2>
			<h3 className="text-center text-[26px]/[1.2] lg:text-[40px]">Our Impact So Far</h3>

			<HomeTestimonialCarousel />
		</section>
	);
}

const sustainableImpactInitatives: Array<{
	bgImage: string;
	ctaButton: React.ReactNode;
	description: React.ReactNode;
	subTitle: string;
	title: string;
}> = [
	{
		bgImage: sustainableImpact1,
		ctaButton: (
			<NavLinkEphemeral
				href={(ctx) => ({
					pathname: "/get-form-link",
					query: { from: ctx.pathname, program: "ASH", type: "REGISTRATION" },
				})}
			>
				<Button>Enroll Now</Button>
			</NavLinkEphemeral>
		),
		description: (
			<p>
				Personalized online tutoring that helps students build confidence, improve academic
				performance, and thrive beyond the classroom. Every enrollment also supports the broader ASH
				initiative, expanding access to after-school learning opportunities for underserved children.
			</p>
		),
		subTitle: "Learning support that empowers students and communities",
		title: "ASH Online Tutorials",
	},
	{
		bgImage: sustainableImpact2,
		ctaButton: (
			<a
				rel="noopener noreferrer"
				target="_blank"
				href={siteConfig.contact.phone.whatsAppUrl}
				className="contents"
			>
				<Button>
					<p>View Collection</p>
					<IconBox icon="ph:arrow-right" className="size-4 lg:size-7.5" />
				</Button>
			</a>
		),
		description: (
			<p>
				Gifts and Events by CedarRise creates premium gift packages and event gifting solutions for
				celebrations, corporate events, milestones, and special occasions. Every purchase supports
				TACOTS (Take A Child Off The Street), helping provide underprivileged children with access to
				education and mentorship. <br />
				Celebrate life's special moments while creating opportunities that change lives.
			</p>
		),
		subTitle: "Thoughtfully curated gifts. Purposefully delivered",
		title: "Gifts and Events by CedarRise",
	},
];

function SustainableImpactSection() {
	return (
		<section id="sustainable-impact" className="flex flex-col gap-6 lg:gap-10">
			<header className="flex flex-col items-center gap-2.5 text-center lg:gap-4">
				<h2 className="text-[26px] lg:text-[40px]">Sustainable Impact Initiatives</h2>

				<p className="max-w-[390px] text-[12.5px] text-pretty lg:max-w-[770px] lg:text-[14px]">
					To sustain our programs and expand our impact, CedarRise operates a number of
					mission-aligned initiatives that generate income while supporting our social work. Proceeds
					from these activities are reinvested directly into our programs, particularly TACOTS and
					ASH, helping us reach more children and communities.
				</p>
			</header>

			<ForWithWrapper
				each={sustainableImpactInitatives}
				className="grid gap-4 lg:grid-cols-2 lg:justify-between lg:gap-5"
				renderItem={(initiative) => (
					<li
						key={initiative.title}
						className="relative isolate flex min-h-[424px] flex-col gap-2 rounded-[24px] px-8
							pt-[114px] pb-8 lg:min-h-[560px] lg:gap-4 lg:px-11.5 lg:pt-[152px] lg:pb-11.5"
					>
						<h3 className="text-[24px] text-cedar-white lg:text-[32px]">{initiative.title}</h3>
						<h5 className="text-[14px] text-cedar-white lg:text-[20px]">{initiative.subTitle}</h5>
						<div className="max-w-[458px] grow text-[12px]/[1.4] text-cedar-white/80 lg:text-[14px]">
							{initiative.description}
						</div>

						{initiative.ctaButton}

						<div className="absolute inset-0 -z-1 rounded-[inherit]">
							<Image
								src={initiative.bgImage}
								alt="bgImage"
								width={380}
								height={424}
								className="size-full rounded-[inherit] object-cover"
							/>

							<span
								className="absolute inset-0 rounded-[inherit]
									bg-linear-[180deg,theme(--color-cedar-red/0)_0%,theme(--color-cedar-red/0.8)_100%]"
							/>
						</div>
					</li>
				)}
			/>
		</section>
	);
}

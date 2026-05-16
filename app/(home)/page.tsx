import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import type React from "react";
import {
	heroImg,
	programmeFour,
	programmeOne,
	programmeThree,
	programmeTwo,
} from "@/assets/images/landing";
import { IconBox } from "@/components/common/IconBox";
import {
	communityOutReachIcon,
	educationIcon,
	humanDevelopmentIcon,
	mentorshipIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { Main } from "./-components/Main";

function HomePage() {
	return (
		<Main className="gap-12 lg:gap-[80px]">
			<HeroSection />
			<WhatWeDoSection />
			<OurProgrammesSection />
		</Main>
	);
}

export default HomePage;

const stats: Array<{ count: string; label: string }> = [
	{ count: "500", label: "Children Impacted" },
	{ count: "10", label: "Communities Reached" },
	{ count: "120", label: "Volunteers Engaged" },
	{ count: "1000", label: "Hours of Mentorship" },
];

function HeroSection() {
	return (
		<section className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-[85px]">
			<article className="lg:max-w-[553px]">
				<h1 className="text-[40px]/12 lg:text-[64px]/[72px]">
					Nurturing Minds, Transforming Communities
				</h1>

				<p className="mt-4 text-[10px]/[1.4] text-cedar-black/80 lg:mt-5 lg:text-base">
					CedarRise Initiative for Human Development is a transformative organization dedicated to
					empowering individuals and communities through education, mentorship, and skill-Building.
				</p>

				<div className="mt-12 flex items-center gap-4.5 lg:mt-20 lg:gap-11">
					<Button className="shrink-0">Donate Now</Button>

					<span className="flex items-center gap-4.5">
						<p className="font-medium lg:text-[20px]">Get Involved</p>

						<Button theme="secondary" size="icon" className="shrink-0">
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>
					</span>
				</div>
			</article>

			<article
				className="relative h-[444px] w-full min-w-[360px] lg:h-[472px] lg:max-w-[562px]
					lg:self-center"
			>
				<Image
					src={heroImg}
					width={380}
					height={444}
					alt="Hero image"
					priority={true}
					className="size-full rounded-[24px] object-cover lg:rounded-[32px]"
				/>

				<ForWithWrapper
					className="absolute inset-y-0 right-4 flex flex-col justify-center gap-4 lg:right-6
						lg:gap-5"
					each={stats}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex h-[92px] w-[102px] flex-col justify-center gap-1 rounded-[16px]
								bg-cedar-black px-4 text-cedar-yellow lg:w-[124px] lg:rounded-[12px] lg:px-7"
						>
							<h4 className="text-[32px]/none">{stat.count}+</h4>
							<p className="text-[10px]/4 lg:text-[12px]">{stat.label}</p>
						</li>
					)}
				/>
			</article>
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
		description: "Reaching deserved communities with impactful initiatives",
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
			className="rounded-[24px] bg-cedar-black px-5 pt-7.5 pb-9.5 lg:mt-10 lg:rounded-[40px]
				lg:px-[80px] lg:pt-11 lg:pb-[96px]"
		>
			<h2 className="text-center leading-none text-cedar-yellow lg:text-[24px]">What we do</h2>
			<h3 className="mt-2 text-center text-[20px]/none text-cedar-white lg:mt-3 lg:text-[40px]">
				Dismantling barriers, building futures.
			</h3>

			<ForWithWrapper
				className="mt-9.5 grid auto-rows-[148px] grid-cols-2 justify-center gap-2 lg:mt-[52px]
					lg:auto-rows-[minmax(252px,1fr)] lg:grid-cols-[repeat(4,min(100%/4,245px))] lg:gap-5"
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

					// NOTE - FIX FOR HOVER SPAZZING:
					// We use a static wrapper (li) as the hover "hit box" and apply a `group` class to it.
					// Since the wrapper never rotates, its physical boundaries never change.
					// The inner div uses `group-hover` to perform the actual rotation, which prevents the endless loop where rotating an element moves it out from under the cursor, losing the hover state.
					return (
						<li
							data-order={offerCount}
							key={offer.title}
							className={cnJoin("group", isEvenRow && "max-lg:[grid-area:var(--grid-area)]")}
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
								<h4 className="leading-none text-cedar-white lg:text-[24px]">{offer.title}</h4>
								<p className="text-[10px]/[1.4] text-pretty text-cedar-white/80 lg:text-[14px]">
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

const initiatives: Array<{ description: string; image: string; title: string }> = [
	{
		description: "Supporting students with academic excellence beyond the classroom.",
		image: programmeOne,
		title: "ASH (After School Hours)",
	},
	{
		description: "Taking children off the streets and guiding them toward purpose.",
		image: programmeTwo,
		title: "TACOTS (Take a Child Off The Streets)",
	},
	{
		description: "Community-driven initiatives creating real impact.",
		image: programmeThree,
		title: "Outreaches",
	},
	{
		description: "Transformative learning experiences designed to meet real-world needs.",
		image: programmeFour,
		title: "Capacity Building",
	},
];

function OurProgrammesSection() {
	return (
		<section>
			<header className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:gap-9.5">
				<h2 className="shrink-0 text-[24px] leading-none lg:text-[48px]">Our Programmes</h2>
				<p className="max-w-[825px] text-[12px]/5 text-black lg:text-base/7">
					At CedarRise, our social initiatives focus on expanding opportunity for underserved
					communities, particularly children and young people who face barriers to education,
					mentorship, and personal development. Through targeted programs and community outreach, we
					work to restore access, strengthen support systems, and create pathways for long-term
					growth.
					<br />
					Our social impact work is driven by three key initiatives:
				</p>
			</header>

			<ForWithWrapper
				className="mt-6 grid auto-rows-[320px] grid-cols-1 justify-center gap-4 lg:mt-12
					lg:auto-rows-[416px] lg:grid-cols-[repeat(2,min(100%/2,590px))] lg:gap-5"
				each={initiatives}
				renderItem={(initiative) => (
					<li
						key={initiative.title}
						className="relative isolate flex flex-col justify-between rounded-[24px] pb-9"
					>
						<div className="absolute inset-0 isolate -z-1 rounded-[inherit]">
							<Image
								src={initiative.image}
								alt="Initiative"
								className="absolute inset-0 size-full rounded-[inherit] object-cover
									mix-blend-multiply"
							/>
							<span
								className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit]
									bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]
									mix-blend-multiply lg:h-3/4"
							/>
						</div>

						<Button
							theme="secondary"
							size="icon"
							className="mt-3 mr-3 size-10 self-end max-lg:text-base lg:mt-4 lg:mr-4"
						>
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>

						<div className="flex flex-col gap-2 px-10 text-cedar-white lg:gap-2.5">
							<h3 className="text-[24px] lg:text-[36px]">{initiative.title}</h3>
							<p className="max-w-[237px] text-[10px] text-pretty lg:max-w-[330px] lg:text-[14px]">
								{initiative.description}
							</p>
						</div>
					</li>
				)}
			/>
		</section>
	);
}

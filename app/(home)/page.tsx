import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import type React from "react";
import { heroImg } from "@/assets/images/landing";
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

				<p className="mt-4 text-[10px]/[1.4] lg:mt-5 lg:text-base">
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
				className="mt-9.5 grid grid-cols-2 grid-rows-[148px] items-stretch justify-center gap-2
					lg:mt-[52px] lg:grid-cols-[repeat(4,minmax(min-content,245px))]
					lg:grid-rows-[minmax(252px,1fr)] lg:gap-4.5"
				each={offers}
				renderItem={(offer, index) => {
					const offerCount = index + 1;

					const totalColumns = 2;

					const rowNumber = Math.ceil(offerCount / totalColumns);

					const columnPlacement = offerCount % totalColumns;

					const colNumber = columnPlacement === 0 ? totalColumns : columnPlacement;

					const isEvenRow = rowNumber % 2 === 0;

					const swappedColNumber = isEvenRow ? totalColumns + 1 - colNumber : colNumber;

					return (
						<li
							data-order={offerCount}
							key={offer.title}
							className={cnJoin(
								`flex w-full shrink-0 flex-col justify-between gap-3 rounded-[16px]
								bg-[hsl(240,5%,5%)] p-2 lg:rounded-[20px] lg:pt-4 lg:pr-3.5 lg:pb-6 lg:pl-4`,
								isEvenRow && "max-lg:[grid-area:var(--grid-area)]"
							)}
							style={
								isEvenRow ?
									({ "--grid-area": `${rowNumber}/${swappedColNumber}` } as React.CSSProperties)
								:	undefined
							}
						>
							<span
								className={cnJoin(
									"w-fit rounded-[12px] p-3.5 lg:rounded-[20px] lg:p-6",
									offerCount % 2 === 0 ? "bg-cedar-yellow" : "bg-cedar-red"
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
							<p className="text-[10px]/[1.4] text-cedar-white/80 lg:text-[14px]">
								{offer.description}
							</p>
						</li>
					);
				}}
			/>
		</section>
	);
}

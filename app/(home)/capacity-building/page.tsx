"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { homeCarousel2 } from "@/assets/images/landing";
import { ForWithWrapper } from "@/components/common/for";
import { Button } from "@/components/ui/button";
import { clientSideImpactQuery } from "@/lib/react-query/queryOptions";
import { cnJoin } from "@/lib/utils/cn";
import { FinalCTASection } from "../-components/FinalCTASectionShared";
import { Main } from "../-components/Main";
import {
	CapacityBuildingMomentsCarousel,
	CapacityBuildingTestimonialCarousel,
} from "./-components/CapacityBuildingCarousels";
import { RegisterProgramCollapsible } from "./-components/RegisterProgramCollapsible";

function CapacityBuildingPage() {
	const [isRegisterProgramOpen, setIsRegisterProgramOpen] = useState(false);

	const handleRegisterProgram = () => {
		setIsRegisterProgramOpen(true);
		setTimeout(() => {
			document.querySelector("#register-program")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 0);
	};

	return (
		<Main layout="fill" className="gap-10 lg:gap-[64px]">
			{(ctx) => (
				<>
					<div className="w-full">
						<HeroSection />
						<CapacitySubHeroSection onRegister={handleRegisterProgram} />
					</div>
					<div className={ctx.constrainedClassName}>
						<IntroSection />
						<HowItWorksSection />
					</div>

					<FeaturedCapacityProgramsSection />

					<div className={ctx.constrainedClassName}>
						<CapacityTestimonialsSection />
					</div>

					<div className={ctx.constrainedClassName}>
						<MomentsSection />
						<RegisterPromptSection
							isOpen={isRegisterProgramOpen}
							onOpenChange={setIsRegisterProgramOpen}
						/>
					</div>

					<FinalCTASection
						title="Partner With Us to Build Capacity"
						description="We collaborate with schools, organizations, and institutions to deliver impactful training programs"
						tone="light"
						actions={[
							{ href: "/get-involved/partner", label: "Partner with us" },
							{ href: "#", kind: "icon-link", label: "Contact Us" },
						]}
					/>
				</>
			)}
		</Main>
	);
}

export default CapacityBuildingPage;

function HeroSection() {
	return (
		<section className="relative isolate flex h-[402px] w-full items-center justify-center lg:h-[670px]">
			<h1 className="text-[32px]/none text-cedar-white lg:text-[64px]">Capacity Building</h1>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={homeCarousel2}
					alt="Capacity building training session"
					priority={true}
					className="size-full object-cover"
				/>

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-black/0.4)_0%,theme(--color-cedar-black/0.8)_100%]
						mix-blend-multiply"
				/>
			</div>
		</section>
	);
}

function CapacitySubHeroSection(props: { onRegister: () => void }) {
	const { onRegister } = props;
	const impact = useQuery(clientSideImpactQuery()).data?.capacityBuilding;
	const capacityImpactStata = [
		{ label: "Participants Impacted", value: `${impact?.participantsImpacted ?? 132}+` },
		{ label: "Workshops Conducted", value: `${impact?.workshopsConducted ?? 6}+` },
		{ label: "Volunteers Engaged", value: `${impact?.volunteersEngaged ?? 15}+` },
		{ label: "Organizations Partnered With", value: `${impact?.organizationsPartneredWith ?? 5}+` },
	];
	return (
		<section className="flex w-full justify-center bg-cedar-black px-6 py-10 lg:px-[50px] lg:py-[52px]">
			<div
				className="flex w-full flex-col items-center gap-10 lg:max-w-[1300px] lg:flex-row-reverse
					lg:justify-between"
			>
				<ForWithWrapper
					className="grid w-full max-w-[362px] grid-cols-[repeat(2,min(100%/2,144px))] gap-4.5
						rounded-[20px] bg-[hsl(240,5%,5%)] p-7 lg:max-w-[488px]
						lg:grid-cols-[repeat(2,min(100%/2,160px))] lg:gap-[54px] lg:p-[56px]"
					each={capacityImpactStata}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex min-h-[92px] flex-col justify-center gap-2 rounded-[16px]
								bg-cedar-white/7 px-7 lg:min-h-[120px] lg:rounded-[20px]"
						>
							<h3 className="text-[24px]/none text-cedar-white lg:text-[36px]">{stat.value}</h3>
							<p className="max-w-min text-[10px]/[1.2] text-cedar-white/80 lg:text-[12px]">
								{stat.label}
							</p>
						</li>
					)}
				/>

				<article className="flex flex-col gap-10 text-cedar-white lg:gap-[64px]">
					<header className="flex flex-col gap-4 lg:gap-6">
						<h2 className="text-[24px]/[1.1] lg:text-[40px]">
							Skills for Growth, Opportunities for Impact
						</h2>
						<p
							className="max-w-[282px] text-[12px]/5 text-cedar-white/80 lg:max-w-[614px]
								lg:text-base/7"
						>
							Transformative learning experiences that equip individuals and organizations with
							practical skills, fresh perspectives, and measurable impact.
						</p>
					</header>

					<div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8.5">
						<Button className="shrink-0 max-lg:w-full" onClick={onRegister}>
							Register for a Program
						</Button>
					</div>
				</article>
			</div>
		</section>
	);
}

const trainingFormats: Array<{ description: string; theme: "black" | "red" | "yellow"; title: string }> = [
	{
		description:
			"Interactive, high-impact training sessions tailored for educators, professionals, and organizations.",
		theme: "black",
		title: "Professional Seminars & Workshops",
	},
	{
		description:
			"Mentorship-driven learning experiences that help young people build confidence, leadership, and future-ready skills.",
		theme: "yellow",
		title: "Youth Development Programmes",
	},
	{
		description:
			"Immersive, multi-day programs focused on leadership, entrepreneurship, and practical life skills.",
		theme: "red",
		title: "Bootcamps & Live-in Experiences",
	},
];

function IntroSection() {
	return (
		<section className="flex flex-col gap-10">
			<p className="text-[10px]/4 lg:text-base/7">
				We deliver transformative learning experiences designed to meet real-world needs. Our capacity
				building programs support individuals, institutions, and organizations seeking practical
				skills, fresh perspectives, and measurable impact. Through partnerships with schools,
				professionals, and organizations, we create learning environments that are engaging, practical,
				and results-driven.
			</p>

			<ForWithWrapper
				className="flex w-full flex-col gap-4 lg:flex-row lg:justify-between lg:gap-5"
				each={trainingFormats}
				renderItem={(format) => (
					<li
						key={format.title}
						className={cnJoin(
							`flex min-h-[114px] w-full flex-col gap-4 rounded-[20px] p-6 lg:min-h-[220px]
							lg:gap-3.5 lg:p-9`,
							format.theme === "black" && "bg-cedar-black",
							format.theme === "yellow" && "bg-cedar-yellow",
							format.theme === "red" && "bg-cedar-red"
						)}
					>
						<h3 className="text-[14px]/[1.2] text-cedar-white lg:text-[24px]">{format.title}</h3>
						<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-base/7">
							{format.description}
						</p>
					</li>
				)}
			/>
		</section>
	);
}

const featuredPrograms: Array<{ description: string; title: string }> = [
	{
		description:
			"A professional development session designed for legal practitioners, focused on reflection, strategic thinking, and renewing clarity around professional goals and practice.",
		title: "Refresh & Refocus for Lawyers",
	},
	{
		description:
			"A practical training program introducing participants to core project management concepts, tools, and frameworks needed to plan and execute projects effectively.",
		title: "Cedar Prize - Project Management and Social Impact Projects",
	},
	{
		description:
			"Capacity building sessions designed to support educators with improved teaching strategies, classroom engagement techniques, and professional development.",
		title: "Teacher Training Workshops",
	},
	{
		description:
			"CedarEdge is a finishing school programme designed to prepare young adults for life beyond the university through a carefully curated blend of mentorship, and practical experience.",
		title: "Cedar Edge",
	},
];

function FeaturedCapacityProgramsSection() {
	return (
		<section
			className="flex w-full justify-center bg-cedar-black px-5 py-8.5 text-cedar-white lg:px-[50px]
				lg:py-[54px]"
		>
			<article className="flex flex-col gap-5 lg:max-w-[1080px] lg:gap-11">
				<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">
					Featured Capacity Building Programs
				</h2>

				<ForWithWrapper
					className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5"
					each={featuredPrograms}
					renderItem={(program) => (
						<li
							key={program.title}
							className="flex min-h-[140px] flex-col justify-center rounded-[16px]
								bg-[hsl(240,5%,5%)] px-6 lg:min-h-[180px] lg:rounded-[20px]"
						>
							<h3 className="text-[14px]/[1.2] lg:text-[24px]">{program.title}</h3>
							<p className="mt-3 text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
								{program.description}
							</p>
						</li>
					)}
				/>
			</article>
		</section>
	);
}

const steps: Array<{ description: string; title: string }> = [
	{
		description: "Sign up for available programs through our online form",
		title: "Register",
	},
	{
		description: "Join interactive sessions, workshops, or bootcamps.",
		title: "Participate",
	},
	{
		description: "Gain practical skills and apply them in real-world settings.",
		title: "Apply & Grow",
	},
];

function HowItWorksSection() {
	return (
		<section className="flex flex-col items-center gap-6.5 lg:gap-[60px]">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">How it Works</h2>

			<article className="flex w-full gap-2.5 lg:flex-col lg:px-[64px]">
				<ForWithWrapper
					className="flex flex-col max-lg:pb-6 lg:flex-row lg:pr-[136px] lg:pl-6"
					each={steps}
					renderItem={(step, index) => {
						const stepCount = index + 1;

						return (
							<li
								key={stepCount}
								className={cnJoin("flex flex-col items-center lg:flex-row", index !== 0 && "grow")}
							>
								{index !== 0 && <hr className="h-full w-0.5 bg-cedar-red lg:h-0.5 lg:w-full" />}

								<h3
									key={step.title}
									className="grid size-8 shrink-0 place-content-center rounded-full bg-cedar-red
										text-[20px] font-medium text-cedar-yellow lg:size-10 lg:text-[24px]"
								>
									{stepCount}
								</h3>
							</li>
						);
					}}
				/>

				<ForWithWrapper
					className="flex flex-col gap-[56px] lg:flex-row lg:justify-between lg:gap-[100px]"
					each={steps}
					renderItem={(step) => (
						<li key={step.title} className="flex flex-col gap-2">
							<h3 className="text-[14px]/[1.2] lg:text-[24px]">{step.title}</h3>
							<p className="max-w-[220px] text-[10px]/4 text-cedar-black/80 lg:text-[14px]/6">
								{step.description}
							</p>
						</li>
					)}
				/>
			</article>
		</section>
	);
}

function MomentsSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<h2 className="text-center text-[24px]/[1.1] lg:text-[40px]">
				Moments from Our Capacity Building Exercise
			</h2>

			<CapacityBuildingMomentsCarousel />
		</section>
	);
}

function RegisterPromptSection(props: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
	const { isOpen, onOpenChange } = props;

	return (
		<section id="register-program" className="mt-5 scroll-mt-24 lg:mt-9">
			<RegisterProgramCollapsible isOpen={isOpen} onOpenChange={onOpenChange} />
		</section>
	);
}

function CapacityTestimonialsSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-2">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">
				Voices from Our Capacity Building Programs
			</h2>
			<CapacityBuildingTestimonialCarousel />
		</section>
	);
}

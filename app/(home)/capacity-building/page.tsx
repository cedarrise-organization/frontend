import Image from "next/image";
import { heroImg } from "@/assets/images/capacity-building";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { Main } from "../-components/Main";

function CapacityBuildingPage() {
	return (
		<Main className="gap-10 lg:gap-[64px]">
			<HeroSection />
			<IntroSection />
			<FeaturedCapacityProgramsSection />
			<HowItWorksSection />
			<RegisterPromptSection />
			<PartnerCtaSection />
		</Main>
	);
}

export default CapacityBuildingPage;

function HeroSection() {
	return (
		<section
			className="relative isolate flex h-[160px] items-center justify-center rounded-[24px] lg:h-[260px]
				lg:rounded-[32px]"
		>
			<div className="absolute inset-0 isolate -z-1 rounded-[inherit]">
				<Image
					src={heroImg}
					alt="Capacity building training session"
					priority={true}
					className="absolute inset-0 size-full rounded-[inherit] object-cover"
				/>

				<span className="absolute inset-0 rounded-[inherit] bg-cedar-red/60" />
			</div>

			<h1 className="text-center text-[40px]/none text-cedar-white lg:text-[80px]">
				Capacity Building
			</h1>
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
		title: "Youth Development Programme",
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
		<section className="flex flex-col gap-4 lg:flex-row lg:justify-center lg:gap-10.5">
			<article className="flex w-full flex-col gap-4 lg:max-w-[569px] lg:gap-10.5">
				<h2 className="text-[24px]/[1.1] lg:text-[40px]">
					What is Capacity Building at <span className="text-cedar-red">CedarRise?</span>
				</h2>

				<p className="text-[10px]/4 text-pretty lg:text-base/7">
					At CedarRise, we deliver transformative learning experiences designed to meet real-world
					needs. Our capacity-building programs support individuals, institutions, and organizations
					seeking practical skills, fresh perspectives, and measurable impact. Through partnerships
					with schools, professionals, and organizations, we create learning environments that are
					engaging, practical, and results-driven.
				</p>
			</article>

			<ForWithWrapper
				className="flex w-full flex-col gap-3 lg:max-w-[590px] lg:gap-5"
				each={trainingFormats}
				renderItem={(format) => (
					<li
						key={format.title}
						className={cnJoin(
							`flex min-h-[114px] flex-col justify-center gap-4 rounded-[20px] p-6 lg:min-h-[168px]
							lg:gap-3.5 lg:p-9`,
							format.theme === "black" && "bg-cedar-black",
							format.theme === "yellow" && "bg-cedar-yellow",
							format.theme === "red" && "bg-cedar-red"
						)}
					>
						<h3 className="text-[14px]/none text-cedar-white lg:text-[24px]">{format.title}</h3>
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
			"Capacity-building sessions designed to support educators with improved teaching strategies, classroom engagement techniques, and professional development.",
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
			className="flex flex-col gap-5 rounded-[24px] bg-cedar-black px-5 pt-8.5 pb-4.5 text-cedar-white
				lg:gap-11 lg:rounded-[40px] lg:px-[60px] lg:pt-11.5 lg:pb-9"
		>
			<h2 className="text-center text-[20px]/none lg:text-[40px]">
				Featured Capacity-Building Programs
			</h2>

			<ForWithWrapper
				className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5"
				each={featuredPrograms}
				renderItem={(program) => (
					<li
						key={program.title}
						className="flex min-h-[140px] flex-col justify-center rounded-[16px] bg-[hsl(240,5%,5%)]
							px-6 lg:min-h-[180px] lg:rounded-[20px]"
					>
						<h3 className="text-[14px]/none lg:text-[24px]">{program.title}</h3>
						<p className="mt-3 text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
							{program.description}
						</p>
					</li>
				)}
			/>
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
			<h2 className="text-center text-[24px]/none lg:text-[40px]/none">How it Works</h2>

			<article className="flex w-full gap-2.5 lg:flex-col lg:px-[64px]">
				<ForWithWrapper
					className="flex flex-col max-lg:pb-6 lg:flex-row lg:pr-[136px] lg:pl-6"
					each={steps}
					renderItem={(step, index) => {
						const stepCount = index + 1;
						const isLastStep = stepCount === steps.length;

						return (
							<li
								className={cnJoin("flex flex-col items-center lg:flex-row", !isLastStep && "grow")}
							>
								<h3
									key={step.title}
									className="grid size-8 shrink-0 place-content-center rounded-full bg-cedar-red
										text-[20px] font-medium text-cedar-yellow lg:size-10 lg:text-[24px]"
								>
									{stepCount}
								</h3>
								{!isLastStep && <hr className="h-full w-0.5 bg-cedar-red lg:h-0.5 lg:w-full" />}
							</li>
						);
					}}
				/>

				<ForWithWrapper
					className="flex flex-col gap-[56px] lg:flex-row lg:justify-between lg:gap-[100px]"
					each={steps}
					renderItem={(step) => (
						<li key={step.title} className="flex flex-col gap-2">
							<h3 className="text-[14px]/none lg:text-[24px]">{step.title}</h3>
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

function RegisterPromptSection() {
	return (
		<section className="mt-5 flex items-center justify-center gap-2 lg:mt-9 lg:gap-7.5">
			<h2 className="text-[24px]/none underline underline-offset-5 lg:text-[40px] lg:decoration-1">
				Register for a Program
			</h2>

			<Button size="icon" className="lg:text-[30px]">
				<IconBox icon="lucide:chevron-down" />
			</Button>
		</section>
	);
}

function PartnerCtaSection() {
	return (
		<section
			className="flex flex-col items-center rounded-[24px] bg-[hsl(0,0%,94%)] p-6 text-center
				text-cedar-black lg:rounded-[32px] lg:p-[64px]"
		>
			<h2 className="text-[32px] leading-none lg:text-[48px]">Partner With Us to Build Capacity</h2>

			<p className="mt-2 text-[10px] lg:mt-4 lg:text-base">
				We collaborate with schools, organizations, and institutions to deliver impactful training
				programs.
			</p>

			<div className="mt-10 flex items-center gap-2 lg:mt-12.5 lg:gap-8.5">
				<Button className="shrink-0">Partner with us</Button>

				<NavLink href="#" className="flex items-center gap-2">
					<p className="text-[14px] font-medium lg:text-[20px]">Contact Us</p>

					<Button theme="secondary" size="icon" className="shrink-0">
						<IconBox icon="solar:arrow-right-up-outline" />
					</Button>
				</NavLink>
			</div>
		</section>
	);
}

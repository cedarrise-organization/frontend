"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { TestimonialCarouselShared } from "@/app/(home)/-components/CarouselsShared";
import { homeCarousel3 } from "@/assets/images/landing";
import { aboutOutreachImg } from "@/assets/images/social-initiatives/outreaches";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { clientSideImpactQuery } from "@/lib/react-query/queryOptions";
import { FinalCTASection } from "../../-components/FinalCTASectionShared";
import { Main } from "../../-components/Main";
import { OutreachesMomentsCarousel } from "./-components/OutreachesCarousels";

function OutreachesPage() {
	return (
		<Main layout="fill" className="gap-10 lg:gap-[64px]">
			{(ctx) => (
				<>
					<div className="w-full">
						<OutreachHeroSection />
						<OutreachConnectSection />
					</div>

					<div className={ctx.constrainedClassName}>
						<OutreachAboutSection />
						<StoriesSection />
						<MomentsSection />
					</div>

					<FinalCTASection
						title="Be Part of the Impact"
						description="Join us as we bring support, opportunity, and hope to communities in need"
						actions={[
							{ href: "/get-involved/volunteer", label: "Volunteer" },
							{ href: "/get-involved/partner", kind: "icon-link", label: "Partner With Us" },
						]}
					/>
				</>
			)}
		</Main>
	);
}

export default OutreachesPage;

function OutreachHeroSection() {
	return (
		<section
			className="relative isolate flex h-[402px] w-full items-center justify-center px-8 text-center
				lg:h-[670px]"
		>
			<h1 className="text-[32px]/[1.1] text-cedar-white lg:text-[64px]/[1.1]">Cedar Reaches</h1>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={homeCarousel3}
					alt="CedarRise outreach medical support"
					priority={true}
					className="size-full object-cover"
				/>

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-black/0.48)_0%,theme(--color-cedar-black/0.48)_100%]"
				/>
			</div>
		</section>
	);
}

function OutreachConnectSection() {
	const impact = useQuery(clientSideImpactQuery()).data?.outreaches;
	const impactStats = [
		{ label: "Outreach events conducted", value: String(impact?.outreachEvents ?? 3) },
		{ label: "Volunteers", value: String(impact?.volunteers ?? 12) },
		{ label: "Beneficiaries reached", value: `${impact?.beneficiariesReached ?? 190}+` },
		{ label: "Partners", value: String(impact?.partners ?? 2) },
		{ label: "Communities Engaged", value: `${impact?.communitiesEngaged ?? 4}+` },
	];
	return (
		<section className="flex w-full justify-center bg-cedar-black px-6 py-10 lg:px-[50px] lg:py-[52px]">
			<div
				className="flex w-full flex-col items-center gap-10 lg:max-w-[1300px] lg:flex-row-reverse
					lg:justify-between"
			>
				<ForWithWrapper
					className="grid w-full max-w-[362px] grid-cols-[repeat(2,min(100%/2,144px))] gap-4.5
						rounded-[20px] bg-[hsl(240,4%,5%)] p-7 lg:max-w-[612px]
						lg:grid-cols-[repeat(3,min(100%/3,136px))] lg:gap-[54px] lg:p-[56px]"
					each={impactStats}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex min-h-[92px] flex-col justify-center gap-2 rounded-[16px]
								bg-cedar-white/7 px-7 lg:min-h-[112px] lg:rounded-[20px]"
						>
							<h3 className="text-[24px]/none text-cedar-white lg:text-[32px]/none">
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
						<h2 className="max-w-[288px] text-[32px]/[1.1] lg:max-w-[456px] lg:text-[40px]">
							Connecting Needs with Opportunities
						</h2>
						<p
							className="max-w-[285px] text-[12px]/4 text-cedar-white/80 lg:max-w-[456px]
								lg:text-base/7"
						>
							Bringing meaningful support directly to underserved communities through education,
							mentorship, and sustainable impact initiatives.
						</p>
					</header>

					<div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8.5">
						<NavLinkEphemeral
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "VOLUNTEER", type: "REGISTRATION" },
							})}
						>
							<Button className="shrink-0 max-lg:w-full">Volunteer</Button>
						</NavLinkEphemeral>

						<NavLink
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "PARTNER", type: "REGISTRATION" },
							})}
							className="flex items-center gap-4"
						>
							<p className="text-[14px] font-medium lg:text-[20px]">Partner with us</p>

							<Button theme="secondary" size="icon" className="shrink-0">
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLink>
					</div>
				</article>
			</div>
		</section>
	);
}

const outreachFocus = [
	{
		description: "Providing learning materials, mentorship, and academic support.",
		title: "Educational Support Drives",
	},
	{
		description: "Promoting basic wellness and early health checks.",
		title: "Health & Awareness Campaigns",
	},
	{
		description: "Equipping individuals with practical, community-relevant skills.",
		title: "Skill Acquisition Programs",
	},
	{
		description: "Creating spaces for connection, learning, and empowerment.",
		title: "Community Engagement Events",
	},
];

function OutreachAboutSection() {
	return (
		<section className="flex flex-col gap-4 lg:flex-row lg:gap-5">
			<article
				className="flex w-full flex-col gap-4 rounded-[16px] bg-cedar-red px-4 pt-4 pb-5
					text-cedar-white lg:gap-7.5 lg:rounded-[24px] lg:px-5 lg:pt-5 lg:pb-8"
			>
				<div className="relative h-[248px] rounded-[16px] lg:h-[370px] lg:rounded-[20px]">
					<Image
						src={aboutOutreachImg}
						alt="CedarRise outreach group"
						priority={true}
						className="absolute inset-0 size-full rounded-[inherit] object-cover"
					/>

					<span
						className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit]
							bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]
							lg:h-[60%]"
					/>
				</div>

				<div className="flex flex-col gap-4 lg:gap-5">
					<h2 className="text-[24px]/[1.2] lg:text-[40px]">About Our Outreaches</h2>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						CedarReaches transforms compassion into action by serving underserved communities through
						health interventions, education, mentorship, and practical empowerment.
					</p>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						Together, we're restoring hope, strengthening lives, and creating lasting change.
					</p>
				</div>
			</article>

			<article
				className="flex w-full flex-col gap-4 rounded-[16px] bg-cedar-black px-4 py-6 text-cedar-white
					lg:gap-6 lg:rounded-[24px] lg:px-11 lg:py-10"
			>
				<h2 className="text-center text-[24px]/[1.2] lg:text-[32px]">Our Outreach Activities</h2>

				<ForWithWrapper
					className="flex flex-col gap-4 lg:gap-5"
					each={outreachFocus}
					renderItem={(item) => (
						<li
							key={item.title}
							className="flex min-h-[96px] flex-col gap-2 rounded-[12px] bg-[hsl(240,5%,5%)] p-5
								lg:min-h-[110px] lg:gap-3 lg:p-6"
						>
							<h3 className="text-[14px]/[1.2] lg:text-[24px]">{item.title}</h3>
							<p
								className="text-[10px]/4 text-pretty text-cedar-white/80 max-lg:max-w-[272px]
									lg:text-[14px]/6"
							>
								{item.description}
							</p>
						</li>
					)}
				/>
			</article>
		</section>
	);
}

const stories = [
	{
		quote: "I am deeply grateful for the free medical care, medications, and laboratory tests. This outreach brought quality healthcare to people who truly needed it.",
		title: "Awlaw Medical Outreach Beneficiary",
	},
	{
		quote: "Volunteering was both fulfilling and beautiful. It reminded me of the impact we can make when we serve together.",
		title: "V. O., Volunteer, Awlaw Medical Outreach",
	},
	{
		quote: "Before this programme, I was confused about my future. Now I have clarity, direction, and confidence in the career I want to pursue.",
		title: "E. V., SS1 Student, Career Pathway Program",
	},
	{
		quote: "The programme helped me clearly understand the career I want to pursue. I can now confidently choose my own path instead of being influenced by others.",
		title: "O. E., SS2 Student, Career Pathway Program",
	},
	{
		quote: "Mentoring students reminded me that guidance can change a young person's future. Seeing them gain clarity about their dreams was incredibly fulfilling.",
		title: "M. O., Volunteer, Career Pathway Program",
	},
	{
		quote: "Every conversation with the students reminded me why service matters. It was a truly rewarding experience.",
		title: "Oge, Volunteer, Career Pathway Program",
	},
];

function StoriesSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-10">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">Stories from the Field</h2>

			<TestimonialCarouselShared testimonials={stories} />
		</section>
	);
}

function MomentsSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">Moments from Our Outreaches</h2>

			<OutreachesMomentsCarousel />
		</section>
	);
}

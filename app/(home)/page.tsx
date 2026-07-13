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
		<Main layout="full" className="gap-12 lg:gap-[80px]">
			{(props) => (
				<>
					<div>
						<HeroSection />
						<WhatWeDoSection />
					</div>
					<div className={props.constrainedClassName}>
						<OurProgrammesSection />
						<SustainableImpactSection />
						<TestimonialsSection />
						<FinalCTASection />
					</div>
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
			<h1 className="max-w-[380px] text-[40px]/12 lg:max-w-[640px] lg:text-[64px]/[72px]">
				Nurturing Minds, Transforming Communities
			</h1>

			<p
				className="mt-4 max-w-[302px] text-[10px]/[1.2] text-inherit/80 lg:mt-5 lg:max-w-[632px]
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
						<h4 className="text-[32px]/none">{stat.count}</h4>
						<p className="max-w-[90px] text-[10px]/[1.3] lg:text-[12px]">{stat.label}</p>
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
		<section className="w-full bg-cedar-black px-5 pt-7.5 pb-10 lg:px-[80px] lg:pt-[80px] lg:pb-[148px]">
			<h2 className="text-center text-[24px]/[1.2] text-cedar-yellow lg:text-[36px]">What we do</h2>

			<ForWithWrapper
				className="mt-9.5 grid grid-cols-2 gap-2 lg:mt-[52px]
					lg:grid-cols-[repeat(4,min(100%/4,245px))] lg:justify-center lg:gap-5"
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
				<h2 className="shrink-0 text-[24px]/[1.2] lg:text-[48px]/none">Our Programmes</h2>
				<p className="max-w-[825px] text-[12px]/5 text-black lg:text-base/7">
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

function TestimonialsSection() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-center leading-[1.2] text-cedar-yellow lg:text-[24px]">Testimonials</h2>
			<h3 className="text-center text-[24px]/[1.2] lg:text-[40px]">Our Impact So Far</h3>

			<HomeTestimonialCarousel />
		</section>
	);
}

const sustainableImpactInitatives: Array<{
	bgImage: string;
	ctaButton: React.ReactNode;
	description: React.ReactNode;
	title: string;
}> = [
	{
		bgImage: sustainableImpact1,
		ctaButton: (
			<NavLinkEphemeral href="/social-initiatives/ash/register">
				<Button>Enroll now</Button>
			</NavLinkEphemeral>
		),
		description: (
			<>
				<p>
					Learning support that empowers students and communities. ASH Online Tutorials provides
					structured academic support for students who need additional guidance outside the classroom.
					Through experienced tutors and personalized sessions, we help learners strengthen their
					understanding, confidence, and academic performance.
				</p>
				<p>
					The program also supports the broader ASH initiative, enabling CedarRise to extend
					after-school academic support and holistic learning opportunities to underserved youth. By
					enrolling in ASH Online Tutorials, families receive quality learning support while helping
					expand access to education for children in need.
				</p>
			</>
		),
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
			<>
				<p>
					Gifts by CedarRise curates beautiful and thoughtful gift packages for celebrations,
					corporate events, milestones, and special occasions. Each gift is carefully assembled to
					create memorable experiences while supporting a greater cause. Every purchase contributes
					directly to TACOTS (Take A Child Off The Street), helping provide educational support and
					mentorship to vulnerable children.
				</p>
				<p>
					By choosing Gifts by CedarRise, you are not only celebrating life’s special moments, you are
					also helping a child access education and opportunity
				</p>
			</>
		),
		title: "Gifts by CedarRises",
	},
];

function SustainableImpactSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-10">
			<header className="flex flex-col items-center gap-2.5 text-center lg:gap-4">
				<h2 className="text-[24px] lg:text-[40px]">Sustainable Impact Initiatives</h2>

				<p className="max-w-[340px] text-[10px] text-pretty lg:max-w-[770px] lg:text-[14px]">
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
						<div className="max-w-[458px] grow text-[10px]/[1.4] text-cedar-white/80 lg:text-[14px]">
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

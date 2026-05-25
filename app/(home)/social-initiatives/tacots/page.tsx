import Image from "next/image";
import { approachSectionImg, heroImg } from "@/assets/images/social-initiatives/tacots";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { Main } from "../../-components/Main";
import { TacotsMomentsCarousel, TacotsStoriesCarousel } from "./-components/TacotsCarousels";

function TacotsPage() {
	return (
		<Main className="gap-10 lg:gap-[80px]">
			<TacotsHeroSection />
			<TacotsOverviewSection />
			<TacotsApproachSection />
			<SupportSection />
			<StoriesSection />
			<MomentsSection />
			<TacotsFormLinksSection />
			<FinalCTASection />
		</Main>
	);
}

export default TacotsPage;

function TacotsHeroSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-10">
			<header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
				<h1 className="text-[32px]/[1.2] lg:max-w-[503px] lg:text-[48px]">
					TACOTS <span className="text-cedar-red">(Take a Child off the Streets)</span>
				</h1>

				<div className="flex flex-col gap-6 lg:max-w-[440px]">
					<p className="text-[10px]/4 text-pretty lg:text-base/6">
						Reconnecting out-of-school and at-risk children with opportunity, mentorship, and a
						clearer path toward education.
					</p>

					<div className="flex items-center gap-3 lg:gap-5">
						<Button className="h-[64px] shrink-0 text-base">Donate Now</Button>

						<NavLink href="#" className="flex items-center gap-4.5">
							<p className="font-medium lg:text-[20px]">Get Involved</p>

							<Button
								theme="secondary"
								size="icon"
								className="size-[64px] shrink-0 max-lg:text-[20px]"
							>
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLink>
					</div>
				</div>
			</header>

			<article
				className="relative isolate flex min-h-[268px] items-end justify-center rounded-[24px] px-6
					pb-9 text-center text-cedar-white lg:min-h-[370px] lg:rounded-[32px] lg:pb-10"
			>
				<Image
					src={heroImg}
					alt="TACOTS beneficiaries"
					priority={true}
					className="absolute inset-0 -z-1 size-full rounded-[inherit] object-cover"
				/>

				<span
					className="absolute inset-x-0 bottom-0 -z-1 h-[80%] rounded-b-[inherit]
						bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]"
				/>

				<h2 className="text-[24px]/[1.2] lg:text-[40px]">Every Child Deserves a Seat at Success.</h2>
			</article>
		</section>
	);
}

const impactStats = [
	{ label: "Students enrolled", value: "9" },
	{ label: "Communities reached", value: "5+" },
	{ label: "Boys enrolled", value: "4" },
	{ label: "Partner school", value: "3" },
];

function TacotsOverviewSection() {
	return (
		<section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
			<article className="flex flex-col gap-6 rounded-[24px] bg-[hsl(0,0%,94%)] p-5 lg:rounded-[32px]">
				<h2 className="w-fit rounded-[12px] bg-cedar-black px-7 py-3 text-cedar-yellow">Our Impact</h2>

				<ForWithWrapper
					className="grid grid-cols-2 gap-x-10 gap-y-5 lg:gap-x-16"
					each={impactStats}
					renderItem={(stat) => (
						<li key={stat.label}>
							<h3 className="text-[32px]/[1.2] lg:text-[40px]">{stat.value}</h3>
							<p className="mt-1 text-[10px]/4 text-pretty lg:text-[14px]/5">{stat.label}</p>
						</li>
					)}
				/>
			</article>

			<article
				className="flex flex-col gap-4 rounded-[24px] bg-[hsl(0,0%,94%)] p-6 lg:rounded-[32px] lg:px-10
					lg:py-8"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[32px]">About TACOTS</h2>

				<p className="text-[10px]/4 text-pretty lg:text-[14px]/6">
					TACOTS (Take a Child off the Streets) is CedarRise&apos;s social initiative focused on
					addressing educational exclusion among out-of-school children.
				</p>

				<p className="text-[10px]/4 text-pretty lg:text-[14px]/6">
					The programme identifies vulnerable children, reconnects them with formal education, and
					provides sponsorship, academic tracking, emotional care, social support to help them build
					stable and meaningful futures.
				</p>
			</article>

			<article
				className="flex flex-col gap-4 rounded-[24px] bg-cedar-yellow p-6 text-cedar-white
					lg:rounded-[32px] lg:px-10 lg:py-8"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[32px]">Who We Serve</h2>

				<p className="text-[10px]/4 text-pretty lg:text-[14px]/6">
					TACOTS supports children aged 5-18 who are out of school, at risk of dropping out, or from
					families facing significant financial barriers to education. Priority goes to orphaned and
					vulnerable children.
				</p>
			</article>

			<article
				className="flex flex-col gap-4 rounded-[24px] bg-cedar-red p-6 text-cedar-white
					lg:rounded-[32px] lg:px-10 lg:py-8"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[32px]">The Challenge</h2>

				<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
					Many children face barriers to education due to poverty, instability, and lack of access to
					support systems. Without intervention, these children are likely to lose years of learning
					and opportunity. TACOTS exists to break this cycle by restoring access to education and
					opportunity.
				</p>
			</article>
		</section>
	);
}

const approachSteps = [
	{
		description: "Children are identified through community links, recommendations, and outreach.",
		title: "Identification & Onboarding",
	},
	{
		description: "Students receive academic, material, and emotional support through every term.",
		title: "Ongoing Support",
	},
	{
		description: "School progress, family engagement, and daily learning outcomes are monitored.",
		title: "Retention & Monitoring",
	},
	{
		description: "Students are supported with higher education, vocational training, or employment.",
		title: "Transition & Future Pathways",
	},
];

function TacotsApproachSection() {
	return (
		<section
			className="flex flex-col gap-8 rounded-[24px] bg-cedar-black p-6 text-cedar-white lg:flex-row
				lg:items-center lg:gap-12 lg:rounded-[32px] lg:p-10"
		>
			<article className="flex w-full flex-col gap-6 lg:max-w-[470px]">
				<h2 className="text-center text-[24px]/[1.2] lg:text-left lg:text-[32px]">Our Approach</h2>

				<ForWithWrapper
					className="flex flex-col gap-4 lg:gap-5"
					each={approachSteps}
					renderItem={(step, index) => (
						<li key={step.title} className="flex items-center gap-4 lg:gap-5">
							<span
								className="grid size-[54px] shrink-0 place-content-center rounded-[12px]
									bg-cedar-red text-[24px] text-cedar-yellow lg:size-[64px]"
							>
								{index + 1}
							</span>

							<div className="flex flex-col gap-1.5">
								<h3 className="text-[12px]/[1.2] lg:text-base">{step.title}</h3>
								<p className="text-[10px]/4 text-pretty text-cedar-white/72 lg:text-[14px]/5">
									{step.description}
								</p>
							</div>
						</li>
					)}
				/>
			</article>

			<Image
				src={approachSectionImg}
				alt="TACOTS approach session"
				className="h-[286px] rounded-[16px] object-cover lg:h-[480px] lg:min-w-0 lg:rounded-[24px]"
			/>
		</section>
	);
}

const supportItems = [
	"School sponsorship (fees, books, uniforms)",
	"Parental & family support",
	"Life skills training",
	"Community partnerships",
	"Long-term academic tracking",
	"One-on-one mentorship",
];

function SupportSection() {
	return (
		<section className="flex flex-col items-center gap-8">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[32px]">What We Provide</h2>

			<ForWithWrapper
				className="flex max-w-[968px] flex-wrap justify-center gap-3 lg:gap-4"
				each={supportItems}
				renderItem={(item, index) => (
					<li
						key={item}
						className={cnJoin(
							`rounded-[12px] px-4 py-3 text-[10px] font-medium text-cedar-white lg:px-6
							lg:text-[14px]`,
							index % 2 === 0 ? "bg-cedar-red" : "bg-cedar-black"
						)}
					>
						{item}
					</li>
				)}
			/>
		</section>
	);
}

function StoriesSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-7">
			<h2 className="text-[24px]/[1.2] lg:text-[32px]">Impact Testimonials</h2>

			<TacotsStoriesCarousel />
		</section>
	);
}

function MomentsSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-8">
			<h2 className="text-[24px]/[1.2] lg:text-[32px]">Some Moments of TACOTS</h2>

			<TacotsMomentsCarousel />
		</section>
	);
}

const formLinks = [
	{
		description: "Know a child in need of support? Help us connect them by submitting a recommendation.",
		href: "/social-initiatives/tacots/recommendation",
		label: "Refer a Child",
	},
	{
		description: "Share your feedback to help us improve and expand our impact.",
		href: "/social-initiatives/tacots/feedback",
		label: "Give us your Feedback",
	},
] satisfies Array<{ description: string; href: MainAppRoutes; label: string }>;

function TacotsFormLinksSection() {
	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<ForWithWrapper
				className="flex flex-col gap-3 lg:gap-4"
				each={formLinks}
				renderItem={(item) => (
					<li
						key={item.label}
						className="flex items-center justify-between gap-5 rounded-[14px] bg-cedar-black py-2
							pr-2 pl-5 text-cedar-white lg:gap-12 lg:rounded-[16px] lg:py-4 lg:pr-4 lg:pl-10"
					>
						<NavLink
							href={item.href}
							className="text-[12px]/[1.2] underline underline-offset-5 lg:text-base"
						>
							{item.label}
						</NavLink>

						<p className="text-[10px]/4 text-cedar-white/80 max-lg:hidden lg:text-[12px]/5">
							{item.description}
						</p>

						<Button
							size="icon"
							className="size-10 shrink-0 self-end rounded-[12px] text-base lg:self-auto"
						>
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>
					</li>
				)}
			/>
		</section>
	);
}

function FinalCTASection() {
	return (
		<section
			className="flex flex-col items-center rounded-[24px] bg-cedar-black p-6 text-center
				text-cedar-white lg:rounded-[32px] lg:p-[64px]"
		>
			<h2 className="text-[24px]/[1.2] text-cedar-yellow lg:text-[40px]">
				Support a Child&apos;s Learning Journey
			</h2>

			<p className="mt-2 text-[10px] lg:mt-4 lg:text-base">
				Your support can provide education, mentorship, and a future filled with possibility.
			</p>

			<div className="mt-10 flex items-center gap-2 lg:mt-12.5 lg:gap-8.5">
				<Button className="shrink-0">Donate Now</Button>

				<NavLink href="#" className="flex items-center gap-2">
					<p className="text-[14px] font-medium lg:text-[20px]">Get Involved</p>

					<Button theme="secondary" size="icon" className="shrink-0">
						<IconBox icon="solar:arrow-right-up-outline" />
					</Button>
				</NavLink>
			</div>
		</section>
	);
}

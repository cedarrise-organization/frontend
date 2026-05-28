import Image from "next/image";
import { heroImg, impactSectionImg } from "@/assets/images/social-initiatives/ash";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { FinalCTASection } from "../../-components/FinalCTASectionShared";
import { Main } from "../../-components/Main";
import { AshMomentsCarousel, AshStoriesCarousel } from "./-components/AshCarousels";

function AshPage() {
	return (
		<Main className="gap-10 lg:gap-[80px]">
			<AshHeroSection />
			<AshOverviewSection />
			<StudentGainsSection />
			<StoriesSection />
			<MomentsSection />
			<AshFormLinksSection />
			<FinalCTASection />
		</Main>
	);
}

export default AshPage;

function AshHeroSection() {
	return (
		<section className="flex flex-col gap-12 lg:items-center lg:gap-10">
			<header className="flex flex-col items-center gap-4 text-center lg:gap-5">
				<h1 className="text-[32px]/none lg:text-[48px]">
					ASH <span className="text-cedar-red">(After School Hours)</span>
				</h1>

				<p className="text-[10px]/4 lg:text-base/6">Academic Support for Holistic Development</p>
			</header>

			<article
				className="relative isolate flex min-h-[335px] w-full items-end rounded-[24px] pb-12 pl-9
					text-cedar-white lg:min-h-[370px] lg:rounded-[32px] lg:pb-10 lg:pl-12"
			>
				<div className="absolute inset-0 isolate rounded-[inherit]">
					<Image
						src={heroImg}
						alt="ASH students"
						priority={true}
						className="absolute inset-0 size-full rounded-[inherit] object-cover"
					/>

					<span
						className="absolute inset-x-0 bottom-0 h-[80%] rounded-b-[inherit]
							bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]"
					/>
				</div>

				<div className="relative flex w-full flex-col gap-2 lg:flex-row lg:items-end lg:gap-[64px]">
					<h2 className="text-[24px]/[1.2] lg:text-[48px]">Learn, Grow... After the Bell.</h2>
					<p className="max-w-[368px] text-[10px]/4 text-cedar-white/80 lg:text-base/7">
						Supporting students beyond the classroom to achieve academic excellence.
					</p>
				</div>
			</article>
		</section>
	);
}

const impactStats = [
	{ label: "Students enrolled", value: "50+" },
	{ label: "Volunteers", value: "14+" },
	{ label: "Communities engaged", value: "4+" },
	{ label: "Improvement in grades", value: "20%" },
	{ label: "Improved concentration", value: "43.8%" },
];

function AshOverviewSection() {
	return (
		<section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
			<article className="flex flex-col gap-5 rounded-[24px] bg-[hsl(0,0%,94%)] p-5 lg:rounded-[32px]">
				<h2
					className="w-fit rounded-[12px] bg-cedar-black px-7 py-3 text-cedar-yellow lg:px-8
						lg:py-3.5"
				>
					Our Impact
				</h2>

				<ForWithWrapper
					className="grid grid-cols-[repeat(3,auto)] gap-x-1 gap-y-5"
					each={impactStats}
					renderItem={(stat) => (
						<li key={stat.label}>
							<h3 className="text-[24px]/[1.2] text-cedar-black lg:text-[48px]">{stat.value}</h3>
							<p className="mt-1 text-[10px]/4 text-pretty lg:text-[14px]/5">{stat.label}</p>
						</li>
					)}
				/>

				<Image
					src={impactSectionImg}
					alt="ASH classroom session"
					className="h-[251px] rounded-[16px] object-cover lg:mt-6 lg:rounded-[20px]"
				/>
			</article>

			<div className="flex flex-col gap-4">
				<article
					className="flex flex-col gap-4 rounded-[24px] bg-cedar-red p-6 text-cedar-white
						lg:rounded-[32px] lg:px-12 lg:py-7.5"
				>
					<h2 className="text-[24px]/[1.2] lg:text-[40px]">About ASH</h2>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						ASH (After School Hours) is CedarRise's academic support program designed to help
						underserved students improve their performance while building confidence, creativity, and
						essential life skills.
					</p>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						By combining structured tutoring, mentorship, and creative engagement, ASH provides a
						balanced approach to both academic success and personal development.
					</p>
				</article>

				<article
					className="flex flex-col gap-4 rounded-[24px] bg-cedar-yellow p-6 text-cedar-white
						lg:rounded-[32px] lg:px-12 lg:py-7.5"
				>
					<h2 className="text-[24px]/[1.2] lg:text-[32px]">Who We Serve</h2>

					<p className="text-[10px]/4 text-pretty lg:text-[14px]/6">
						ASH supports students ages 8-18 from underserved communities, particularly those
						attending public or low-cost private schools with limited access to academic support.
					</p>
				</article>
			</div>
		</section>
	);
}

const studentGains = [
	"Academic improvement & structured tutoring",
	"Confidence & leadership development",
	"Mentorship & guidance",
	"Creative expression & performance arts",
	"Practical life and employability skills",
];

function StudentGainsSection() {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">What Students Gain</h2>

			<ForWithWrapper
				className="grid grid-cols-2 gap-4 max-lg:px-5 lg:grid-cols-5 lg:justify-center lg:gap-5"
				each={studentGains}
				renderItem={(gain, index) => (
					<li
						key={gain}
						className="flex min-h-[146px] flex-col gap-4 rounded-[12px] bg-cedar-black p-6
							text-cedar-white lg:min-h-[220px] lg:rounded-[20px] lg:px-7"
					>
						<h3 className="text-[24px]/none text-cedar-yellow lg:text-[40px]">{index + 1}</h3>
						<p className="text-[10px] lg:text-[20px]">{gain}</p>
					</li>
				)}
			/>
		</section>
	);
}

function StoriesSection() {
	return (
		<section className="flex flex-col gap-4 lg:gap-7">
			<h2 className="text-[24px]/[1.2] lg:text-[40px]">Stories that Matter</h2>

			<AshStoriesCarousel />
		</section>
	);
}

function MomentsSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<h2 className="text-center text-[32px]/[1.2] lg:text-[64px]">Moments from ASH</h2>

			<AshMomentsCarousel />
		</section>
	);
}

const formLinks = [
	{
		description: "Click to enrol a student in the ASH program.",
		href: "/social-initiatives/ash/register",
		label: "Register for ASH",
	},
	{
		description: "Help us improve by sharing your experience with the ASH program.",
		href: "/social-initiatives/ash/feedback",
		label: "Give us a feedback",
	},
] satisfies Array<{ description: string; href: MainAppRoutes; label: string }>;

function AshFormLinksSection() {
	return (
		<section>
			<ForWithWrapper
				className="flex flex-col gap-4 lg:gap-5"
				each={formLinks}
				renderItem={(item) => (
					<li
						key={item.label}
						className="flex items-center justify-between gap-5 rounded-[16px] bg-cedar-black py-2
							pr-2 pl-6 text-cedar-white lg:gap-12 lg:rounded-[20px] lg:py-5.5 lg:pr-5.5 lg:pl-12"
					>
						<NavLink
							href={item.href}
							className="text-[14px]/[1.2] underline underline-offset-5 lg:text-[24px]"
						>
							{item.label}
						</NavLink>

						<p className="text-cedar-white/80 max-lg:hidden lg:text-base/6">{item.description}</p>

						<NavLinkEphemeral href={item.href}>
							<Button size="icon" className="shrink-0 self-end lg:self-auto">
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLinkEphemeral>
					</li>
				)}
			/>
		</section>
	);
}

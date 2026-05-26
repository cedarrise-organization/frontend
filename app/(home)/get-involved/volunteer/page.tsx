import Image from "next/image";
import { heroImg } from "@/assets/images/get-involved/volunteer";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../../-components/Main";

function VolunteerPage() {
	return (
		<Main className="gap-10 lg:gap-[80px]">
			<VolunteerHeroSection />
			<VolunteerFormLinksSection />
		</Main>
	);
}

export default VolunteerPage;

const waysToHelp = [
	"Mentor students",
	"Teach literacy / ICT",
	"Support workshops",
	"Assist in outreach",
	"Help with logistics/media",
];

function VolunteerHeroSection() {
	return (
		<section className="flex flex-col gap-10 lg:flex-row lg:gap-6">
			<header className="flex w-full flex-col gap-4 lg:max-w-[282px]">
				<h1 className="text-[40px]/[1.2] text-cedar-red lg:text-[64px]">Volunteer</h1>

				<p className="text-[12px]/4 text-pretty lg:text-base/7">
					At CedarRise, volunteers are the heartbeat of our mission. Whether you're supporting an
					after-school session or helping with outreach and events, your time and passion can
					transform lives. If you care, you qualify.
				</p>
			</header>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red p-9 text-cedar-white
					lg:min-h-[420px] lg:max-w-[424px] lg:gap-8 lg:rounded-[32px] lg:p-12"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">Ways to Help::</h2>

				<ForWithWrapper
					className="flex flex-col gap-3 lg:gap-5"
					each={waysToHelp}
					renderItem={(way) => (
						<li key={way} className="flex items-start gap-3 lg:gap-5">
							<span
								className="mt-1.5 size-3 shrink-0 rounded-full bg-cedar-yellow lg:mt-2 lg:size-4"
							/>
							<h3 className="leading-6 lg:text-[24px]/8">{way}</h3>
						</li>
					)}
				/>
			</article>

			<Image
				src={heroImg}
				alt="CedarRise volunteers"
				priority={true}
				className="min-h-[334px] w-full min-w-0 rounded-[24px] object-cover lg:min-h-[420px]
					lg:rounded-[32px]"
			/>
		</section>
	);
}

const volunteerFormLinks = [
	{
		href: "/get-involved/volunteer/register",
		label: "Sign Up as a Volunteer",
	},
	{
		href: "/get-involved/volunteer/feedback",
		label: "Leave us a feedback",
	},
] satisfies Array<{ href: MainAppRoutes; label: string }>;

function VolunteerFormLinksSection() {
	return (
		<section className="flex flex-col gap-4 lg:gap-5">
			<ForWithWrapper
				className="flex flex-col gap-4 lg:gap-5"
				each={volunteerFormLinks}
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

						<NavLink href={item.href} className="contents">
							<Button size="icon" className="shrink-0 self-end lg:self-auto">
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</NavLink>
					</li>
				)}
			/>
		</section>
	);
}

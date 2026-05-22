import Image from "next/image";
import { outreachHeroImg, outReachImpactSectionImg } from "@/assets/images/social-initiative";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../../-components/Main";
import { MomentsCarousel } from "./-components/MomentsCarousel";

function OutreachesPage() {
	return (
		<Main className="gap-10 lg:gap-[80px]">
			<OutreachHeroSection />
			<OutreachOverviewSection />
			<StoriesImpactSection />
			<MomentsSection />
			<FinalCTASection />
		</Main>
	);
}

export default OutreachesPage;

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

function OutreachHeroSection() {
	return (
		<section className="flex flex-col lg:items-center lg:text-center">
			<h1 className="text-[40px]/[1.2] lg:max-w-[702px] lg:text-[48px]">
				Connecting Needs with Opportunities at <span className="text-cedar-red">Outreaches</span>
			</h1>

			<p className="mt-4 text-[10px]/4 text-pretty lg:mt-8 lg:max-w-[521px] lg:text-base/6">
				Bridging meaningful support directly to underserved communities through education, mentorship,
				and sustainable impact initiatives.
			</p>

			<Button className="mt-9 h-[64px] lg:mt-12 lg:text-base">Volunteer for an Outreach</Button>
		</section>
	);
}

function OutreachOverviewSection() {
	return (
		<section className="flex flex-col gap-4 lg:flex-row lg:gap-5">
			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red px-4 pt-4 pb-5
					text-cedar-white lg:gap-7.5 lg:rounded-[32px] lg:px-5 lg:pt-5 lg:pb-8"
			>
				<div className="relative h-[284px] rounded-[20px] lg:h-[370px]">
					<Image
						src={outreachHeroImg}
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
						CedarRise outreaches are designed to respond to real community needs through health
						support, education, mentorship, and practical empowerment.
					</p>

					<p className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-[14px]/6">
						These initiatives take our mission beyond classrooms and programmes, reaching people
						where support can make an immediate difference.
					</p>
				</div>
			</article>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-black px-4 py-6 text-cedar-white
					lg:gap-6 lg:rounded-[32px] lg:px-11 lg:py-10"
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
		quote: "I am very grateful for the help we received; our child is safer.",
		title: "Medical Outreach Beneficiary",
	},
	{
		quote: "This outreach renewed the community's hope in the power of education and human connection.",
		title: "Community Leader, Awka",
	},
	{
		quote: "This outreach renewed the community's hope in the power of education and human connection.",
		title: "Community Leader, Awka",
	},
];

const impactStats = [
	{ label: "Communities engaged", value: "4+" },
	{ label: "Outreach events conducted", value: "3" },
	{ label: "Volunteers", value: "12" },
	{ label: "Individuals reached", value: "190+" },
	{ label: "Partner", value: "1" },
];

function StoriesImpactSection() {
	return (
		<section className="flex flex-col gap-5 lg:flex-row">
			<article className="flex w-full flex-col gap-5 max-lg:hidden">
				<h2 className="text-[40px]/[1.2]">Stories from the Field</h2>

				<ForWithWrapper
					className="flex flex-col gap-5"
					each={stories}
					renderItem={(story) => (
						<li
							key={story.title}
							className="flex min-h-[164px] flex-col gap-6 rounded-[16px] bg-[hsl(0,0%,94%)] p-5"
						>
							<div className="flex items-center gap-5">
								<span
									className="grid h-11 w-[55px] shrink-0 place-content-center rounded-[20px]
										bg-cedar-yellow text-[64px] text-cedar-red"
								>
									<svg
										width="22"
										height="19"
										viewBox="0 0 22 19"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M-0.000238419 0.000179291V3.20018C3.26376 4.03218 4.86376 5.95218 4.92776 9.98418H-0.000238419V18.6242H8.83176V12.0962C8.83176 4.86418 6.65576 1.40818 -0.000238419 0.000179291ZM12.3518 0.000179291V3.20018C15.6158 4.03218 17.2158 5.95218 17.2798 9.98418H12.3518V18.6242H21.1838V12.0962C21.1838 4.86418 19.0078 1.40818 12.3518 0.000179291Z"
											fill="currentColor"
										/>
									</svg>
								</span>

								<h3 className="text-[20px]/[1.2] text-cedar-red">{story.title}</h3>
							</div>

							<p className="leading-7 text-pretty">"{story.quote}"</p>
						</li>
					)}
				/>
			</article>

			<article
				className="flex w-full flex-col gap-6 rounded-[24px] bg-[hsl(0,0%,94%)] p-5 lg:rounded-[32px]"
			>
				<h2
					className="w-fit rounded-[12px] bg-cedar-black px-7 py-4 text-cedar-yellow lg:px-8 lg:py-3.5
						lg:text-[20px]"
				>
					Our Impact
				</h2>

				<ForWithWrapper
					className="grid grid-cols-[repeat(3,auto)] gap-x-1 gap-y-5 lg:grid-cols-[repeat(2,auto)]
						lg:gap-y-3.5"
					each={impactStats}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3"
						>
							<h3 className="text-[32px]/[1.2] text-cedar-red lg:text-[40px]">{stat.value}</h3>
							<p className="text-[10px]/4 text-pretty lg:text-[16px]/5">{stat.label}</p>
						</li>
					)}
				/>

				<Image
					src={outReachImpactSectionImg}
					alt="CedarRise outreach impact"
					className="h-[251px] rounded-[16px] object-cover lg:h-[279px] lg:rounded-[20px]"
				/>
			</article>
		</section>
	);
}

function MomentsSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<h2 className="text-center text-[32px]/[1.2] lg:text-[64px]">Moments from Our Outreaches</h2>

			<MomentsCarousel />
		</section>
	);
}

function FinalCTASection() {
	return (
		<section
			className="flex flex-col items-center rounded-[24px] bg-cedar-black p-6 text-center
				text-cedar-white lg:rounded-[32px] lg:p-[64px]"
		>
			<h2 className="text-[32px]/[1.2] text-cedar-yellow lg:text-[48px]">
				Help Us Reach More Communities
			</h2>

			<p className="mt-2 text-[10px] lg:mt-4 lg:text-base">
				Support outreaches that bring care, learning, and practical help closer to the people who need
				it.
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

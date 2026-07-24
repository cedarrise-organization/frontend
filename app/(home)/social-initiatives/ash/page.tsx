"use client";

import Image from "next/image";
import { homeCarousel1 } from "@/assets/images/landing";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { FinalCTASection } from "../../-components/FinalCTASectionShared";
import { Main } from "../../-components/Main";
import { AshMomentsCarousel, AshStoriesCarousel } from "./-components/AshCarousels";

function AshPage() {
	return (
		<Main layout="fill" className="gap-10 lg:gap-[64px]">
			{(ctx) => (
				<>
					<div className="w-full">
						<AshHeroSection />
						<AshAfterBellSection />
					</div>
					<div className={ctx.constrainedClassName}>
						<AshOverviewSection />
						<StudentGainsSection />
						<StoriesSection />
						<MomentsSection />
					</div>

					<FinalCTASection
						title="Support a Child’s Learning Journey"
						description="Your support can help more students access quality education and mentorship."
					/>
				</>
			)}
		</Main>
	);
}

export default AshPage;

function AshHeroSection() {
	return (
		<section className="relative isolate flex h-[402px] w-full items-center justify-center lg:h-[670px]">
			<h1 className="text-[32px]/none text-cedar-white lg:text-[64px]">After School Hours(ASH)</h1>

			<div className="absolute inset-0 isolate -z-1">
				<Image
					src={homeCarousel1}
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

const afterBellStats = [
	{ label: "Students Enrolled", value: "50+" },
	{ label: "Volunteers", value: "14+" },
	{ label: "Improvement in grades", value: "20%" },
	{ label: "Communities Engaged", value: "4+" },
];

function AshAfterBellSection() {
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
					each={afterBellStats}
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
						<h2 className="text-[24px]/[1.1] lg:text-[48px]">Learn, Grow... After the Bell.</h2>
						<p
							className="max-w-[282px] text-[12px]/5 text-cedar-white/80 lg:max-w-[614px]
								lg:text-base/7"
						>
							Supporting students beyond the classroom to achieve academic excellence.
						</p>
					</header>

					<div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8.5">
						<NavLinkEphemeral
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "ASH", type: "REGISTRATION" },
							})}
						>
							<Button className="shrink-0 max-lg:w-full">Register Now</Button>
						</NavLinkEphemeral>

						<NavLink
							href={(ctx) => ({
								pathname: "/get-form-link",
								query: { from: ctx.pathname, program: "ASH", type: "FEEDBACK" },
							})}
							className="flex items-center gap-4"
						>
							<p className="text-[14px] font-medium lg:text-[20px]">Feedback</p>

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

function AshOverviewSection() {
	return (
		<section className="flex flex-col gap-4 lg:flex-row lg:gap-5">
			<article
				className="flex w-full flex-col gap-4 rounded-[16px] bg-cedar-red p-6 text-cedar-white
					lg:rounded-[24px] lg:px-[50px] lg:py-7.5"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">About ASH</h2>

				<div className="text-[10px]/4 text-pretty text-cedar-white/80 lg:text-base/7">
					<p>
						ASH (After School Hours) is CedarRise's academic support program designed to help
						underserved students improve their performance while building confidence, creativity, and
						essential life skills.
					</p>
					<p>
						By combining structured tutoring, mentorship, and creative engagement, ASH provides a
						balanced approach to both academic success and personal development.
					</p>
				</div>
			</article>

			<article
				className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-yellow p-6 text-cedar-white
					lg:rounded-[32px] lg:px-12 lg:py-9"
			>
				<h2 className="text-[24px]/[1.2] lg:text-[40px]">Who We Serve</h2>

				<p className="text-[10px]/4 text-pretty lg:text-base/7">
					ASH supports students ages 8-18 from underserved communities, particularly those attending public or low-cost private schools with limited access to academic support.
				</p>
			</article>
		</section>
	);
}

const studentGains = [
	"Academic improvement & structured tutoring",
	"Confidence & leadership development",
	"Mentorship & guidance",
	"Creative expression & performance arts",
];

function StudentGainsSection() {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">What Students Gain</h2>

			<ForWithWrapper
				className="grid grid-cols-2 gap-4 max-lg:px-5 lg:grid-cols-4 lg:justify-center lg:gap-5"
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

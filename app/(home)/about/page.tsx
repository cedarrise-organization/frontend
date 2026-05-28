import Image from "next/image";
import { aboutCoreValueDesktopImg, aboutCoreValueMobileImg, aboutHeroImg } from "@/assets/images/about";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { FinalCTASection } from "../-components/FinalCTASectionShared";
import { Main } from "../-components/Main";

function AboutPage() {
	return (
		<Main className="gap-10 lg:gap-16">
			<HeroSection />
			<WhoWeAreSection />
			<MissionVisionSection />
			<CoreValuesSection />
			<TeamSection />
			<FinalCTASection />
		</Main>
	);
}

export default AboutPage;

function HeroSection() {
	return (
		<section className="flex flex-col items-center pt-8 text-center lg:pt-14">
			<h1 className="text-[40px]/[1.1] lg:text-[64px]/[1.1]">
				About <span className="text-cedar-red">CedarRise</span>
			</h1>

			<p className="mt-4 max-w-[560px] text-[10px]/[1.5] lg:text-base/6">
				Empowering individuals and communities through education, mentorship, and sustainable
				development.
			</p>
		</section>
	);
}

function WhoWeAreSection() {
	return (
		<section
			className="grid overflow-hidden rounded-[20px] bg-cedar-black lg:grid-cols-2 lg:rounded-[24px]"
		>
			<article className="p-6 text-cedar-white lg:p-10">
				<h2 className="text-[28px]/[1.2] lg:text-[40px]/[1.2]">Who We Are</h2>

				<div className="mt-6 space-y-4 text-[12px]/[1.6] lg:text-base/7">
					<p>
						CedarRise Initiative for Human Development is a non-profit organization dedicated to
						strengthening individuals and communities through education, professional development,
						skills training, and social impact programs.
					</p>

					<p>
						Inspired by the resilience of the cedar tree, we equip people with the knowledge, skills,
						and opportunities they need to grow and thrive.
					</p>

					<p>
						Our work supports diverse groups—including students, educators, professionals, and
						underserved communities—with a strong focus on children and women.
					</p>
				</div>
			</article>

			<Image
				src={aboutHeroImg}
				alt="CedarRise participants holding certificates"
				className="h-[260px] w-full object-cover lg:h-full"
				priority={true}
			/>
		</section>
	);
}

function MissionVisionSection() {
	return (
		<section className="grid gap-4 lg:grid-cols-2 lg:gap-5">
			<article className="rounded-[20px] bg-cedar-red p-6 text-cedar-white lg:rounded-[24px] lg:p-10">
				<div className="flex items-start justify-between gap-4">
					<h2 className="text-[24px]/[1.2] lg:text-[32px]/[1.2]">Mission</h2>
					<IconBox icon="solar:target-linear" className="size-6 shrink-0 lg:size-10" />
				</div>

				<p className="mt-6 text-[12px]/[1.6] lg:text-base/7">
					To empower communities through education, skill-building, and mentorship programs that drive
					personal growth, academic excellence, and long-term impact
				</p>
			</article>

			<article className="rounded-[20px] bg-cedar-yellow p-6 text-cedar-white lg:rounded-[24px] lg:p-10">
				<div className="flex items-start justify-between gap-4">
					<h2 className="text-[24px]/[1.2] lg:text-[32px]/[1.2]">Vision</h2>
					<IconBox icon="solar:magnifer-linear" className="size-6 shrink-0 lg:size-10" />
				</div>

				<p className="mt-6 text-[12px]/[1.6] lg:text-base/7">
					To build a world where every child, youth, and woman, regardless of background, has access
					to quality education, mentorship and opportunities to thrive.
				</p>
			</article>
		</section>
	);
}

function CoreValuesSection() {
	return (
		<section className="flex flex-col items-center gap-6 lg:gap-8">
			<picture className="w-full max-w-[1050px]">
				<source media="(min-width: 1024px)" srcSet={aboutCoreValueDesktopImg.src} />

				<Image
					src={aboutCoreValueMobileImg}
					alt="CedarRise core values"
					className="w-full object-contain"
					sizes="(min-width: 1024px) 1050px, 100vw"
				/>
			</picture>
		</section>
	);
}

function TeamSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-12">
			<header className="max-w-[620px]">
				<h2 className="text-[28px]/[1.2] lg:text-[40px]/[1.2]">Our Team</h2>

				<p className="mt-4 text-[12px]/[1.6] lg:text-base/7">
					CedarRise is driven by a team of passionate individuals committed to creating impact.
					Together, we bring diverse expertise, shared values and a deep dedication to empowering
					communities.
				</p>
			</header>

			<ForWithWrapper
				className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
				each={10}
				renderItem={(index) => (
					<li
						key={index}
						className="min-h-[180px] rounded-[18px] bg-cedar-black lg:min-h-[280px]
							lg:rounded-[24px]"
					/>
				)}
			/>
		</section>
	);
}
